import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';

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
    keepPreviousData: true,
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
    keepPreviousData: true,
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

  return useMutation({
    mutationFn: async ({ chatId, content }: { chatId: string | number; content: string }) => {
      const response = await api.post(`/chat/${chatId}/messages`, { content });
      return response.data.data;
    },
    onMutate: async ({ chatId, content }) => {
      // Optimistic update
      const messageId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: messageId,
        chatId,
        content,
        createdAt: new Date().toISOString(),
        isOwn: true,
        sender: { id: 'current-user', name: 'You' }
      };

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['chatMessages', chatId] });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(['chatMessages', chatId, 'infinite']);

      // Optimistically update
      queryClient.setQueryData(['chatMessages', chatId, 'infinite'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              messages: [optimisticMessage, ...old.pages[0].messages]
            },
            ...old.pages.slice(1)
          ]
        };
      });

      // Send via Socket.io immediately
      if (socket.isConnected) {
        socket.sendMessage(String(chatId), content, messageId);
      }

      return { previousMessages, optimisticMessage };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(['chatMessages', variables.chatId, 'infinite'], context.previousMessages);
      }
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic message with real one
      queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

