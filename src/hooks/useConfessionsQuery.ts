import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';

// Confession queries
export const useConfessions = () => {
  return useInfiniteQuery({
    queryKey: ['confessions'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/confessions', {
        params: { page: pageParam, limit: 20 }
      });
      return {
        confessions: response.data.data.confessions || [],
        pagination: response.data.data.pagination || {},
        nextPage: response.data.data.pagination?.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useCreateConfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, isAnonymous }: { content: string; isAnonymous: boolean }) => {
      const response = await api.post('/confessions', { content, isAnonymous });
      return response.data.data;
    },
    onMutate: async (variables) => {
      // Optimistic update
      const optimisticConfession = {
        id: `temp-${Date.now()}`,
        content: variables.content,
        isAnonymous: variables.isAnonymous,
        author: variables.isAnonymous ? undefined : 'You',
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        commentsList: [],
        tags: []
      };

      await queryClient.cancelQueries({ queryKey: ['confessions'] });

      const previousConfessions = queryClient.getQueryData(['confessions']);

      queryClient.setQueryData(['confessions'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              confessions: [optimisticConfession, ...old.pages[0].confessions]
            },
            ...old.pages.slice(1)
          ]
        };
      });

      return { previousConfessions };
    },
    onError: (err, variables, context) => {
      if (context?.previousConfessions) {
        queryClient.setQueryData(['confessions'], context.previousConfessions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
};

export const useLikeConfession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ confessionId, like }: { confessionId: number | string; like: boolean }) => {
      if (like) {
        const response = await api.post(`/confessions/${confessionId}/like`);
        return response.data;
      } else {
        const response = await api.delete(`/confessions/${confessionId}/like`);
        return response.data;
      }
    },
    onMutate: async ({ confessionId, like }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['confessions'] });

      const previousConfessions = queryClient.getQueryData(['confessions']);

      queryClient.setQueryData(['confessions'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            confessions: page.confessions.map((conf: any) =>
              conf.id === confessionId
                ? { ...conf, likes: like ? conf.likes + 1 : Math.max(0, conf.likes - 1) }
                : conf
            )
          }))
        };
      });

      return { previousConfessions };
    },
    onError: (err, variables, context) => {
      if (context?.previousConfessions) {
        queryClient.setQueryData(['confessions'], context.previousConfessions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
};

