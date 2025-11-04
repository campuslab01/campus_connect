import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

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

export const useInfiniteMessages = (chatId: string | number | null) => {
  return useInfiniteQuery({
    queryKey: ['chatMessages', chatId, 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      if (!chatId) return null;
      const response = await api.get(`/chat/${chatId}/messages`, {
        params: { page: pageParam, limit: 50 }
      });
      return {
        messages: response.data.data.messages || [],
        pagination: response.data.data.pagination || {},
        nextPage: response.data.data.pagination?.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: !!chatId,
    initialPageParam: 1,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ chatId, content, type = 'text', confessionId = null }: { chatId: string | number; content: string; type?: string; confessionId?: string | null }) => {
      const response = await api.post(`/chat/${chatId}/messages`, { content, type, confessionId });
      return response.data.data;
    },
    onMutate: async ({ chatId, content, type = 'text', confessionId = null }) => {
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

      // Send via Socket.io immediately if connected
      if (socket.isConnected && socket.sendMessage) {
        try {
          socket.sendMessage(String(chatId), content, messageId);
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

