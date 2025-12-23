import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { createSharedSecret, decryptMessage } from '../lib/e2ee';

const isLikelyBase64 = (s: string): boolean => {
  if (typeof s !== 'string') return false;
  const trimmed = s.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('{')) return false;
  if (trimmed.length % 4 !== 0) return false;
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(trimmed)) return false;
  try {
    atob(trimmed);
    return true;
  } catch {
    return false;
  }
};

// Chat queries
export const useChats = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['chats', page, limit],
    queryFn: async () => {
      const response = await api.get('/chat', {
        params: { page, limit }
      });
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useInfiniteChats = () => {
  return useInfiniteQuery({
    queryKey: ['chats', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/chat', {
        params: { page: pageParam, limit: 20 }
      });
      return {
        data: response.data.data.chats,
        pagination: response.data.data.pagination,
        nextPage: response.data.data.pagination.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useChatMessages = (chatId: string | number | null, page = 1, limit = 50) => {
  return useQuery({
    queryKey: ['chatMessages', chatId, page],
    queryFn: async () => {
      if (!chatId) return null;
      const response = await api.get(`/chat/${chatId}/messages`, {
        params: { page, limit }
      });
      return response.data.data;
    },
    enabled: !!chatId,
    placeholderData: (previousData) => previousData,
  });
};

export const useInfiniteMessages = (chatId: string | number | null, theirPublicKey: string | null) => {
  return useInfiniteQuery({
    queryKey: ['chatMessages', chatId, 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      if (!chatId) return null;
      const response = await api.get(`/chat/${chatId}/messages`, {
        params: { page: pageParam, limit: 50 }
      });

      const keyPair = JSON.parse(localStorage.getItem('keyPair') || 'null');
      if (!keyPair || !keyPair.secretKey || !theirPublicKey) {
        return {
          messages: response.data.data.messages || [],
          pagination: response.data.data.pagination || {},
          nextPage: response.data.data.pagination?.hasNext ? pageParam + 1 : undefined,
        };
      }

      const sharedSecret = createSharedSecret(theirPublicKey, keyPair.secretKey);
      const decryptedMessages = (response.data.data.messages || []).map((msg: any) => {
        try {
          const content = msg.content || msg.text || '';
          const looksJson = typeof content === 'string' && content.trim().startsWith('{');
          if (looksJson || !isLikelyBase64(content)) {
            return { ...msg, content };
          }
          const decryptedContent = decryptMessage(content, sharedSecret);
          return { ...msg, content: decryptedContent };
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          // Fallback to original content instead of error placeholder
          return { ...msg, content: msg.content || msg.text || '' };
        }
      });

      return {
        messages: decryptedMessages,
        pagination: response.data.data.pagination || {},
        nextPage: response.data.data.pagination?.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: !!chatId,
    initialPageParam: 1,
    refetchInterval: false, // Disable polling, rely on socket events
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Messages are immutable, don't refetch unless invalidated
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ chatId, content, theirPublicKey, type = 'text', confessionId = null }: { chatId: string | number; content: string; theirPublicKey?: string | null; type?: string; confessionId?: string | null }) => {
      const payload: any = { content, type };
      if (confessionId) payload.confessionId = confessionId;
      const response = await api.post(`/chat/${chatId}/messages`, payload);
      return response.data.data;
    },
    onMutate: async ({ chatId, content, theirPublicKey, type = 'text', confessionId = null }) => {
      // Get actual user ID for sender
      const userId = (user as any)?._id || (user as any)?.id;
      const userIdStr = userId?.toString();
      
      // Optimistic update
      const messageId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
      const optimisticMessage = {
        id: messageId,
        chatId,
        content,
        type,
        confessionId,
        createdAt: now,
        timestamp: now,
        isOwn: true, // Explicitly set to true
        sender: { 
          id: userIdStr || 'current-user', 
          name: (user as any)?.name || 'You', 
          _id: userIdStr || 'current-user' 
        },
        _id: messageId
      };

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['chatMessages', chatId] });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(['chatMessages', chatId, 'infinite']);

      // Optimistically update - add to the end of the first page (most recent messages)
      queryClient.setQueryData(['chatMessages', chatId, 'infinite'], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) {
          return {
            pages: [{ messages: [optimisticMessage] }],
            pageParams: [1]
          };
        }
        
        // Add optimistic message to the end of the first page (newest messages)
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              messages: [...(old.pages[0].messages || []), optimisticMessage]
            },
            ...old.pages.slice(1)
          ]
        };
      });

      // Send via Socket.io immediately if connected and we have a recipient public key
      if (socket.isConnected && socket.sendMessage && theirPublicKey) {
        try {
          socket.sendMessage(String(chatId), content, theirPublicKey, messageId);
        } catch (error) {
          console.error('Error sending message via socket:', error);
        }
      }

      return { previousMessages, optimisticMessage };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(['chatMessages', variables.chatId, 'infinite'], context.previousMessages);
      }
    },
    onSuccess: (_data, variables) => {
      // Replace optimistic message with real one
      queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

