import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '../config/axios';

// User queries
export const useUserSuggestions = (limit = 50) => {
  return useInfiniteQuery({
    queryKey: ['userSuggestions'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/users/suggestions', {
        params: { page: pageParam, limit }
      });
      return {
        users: response.data.data.users || [],
        pagination: response.data.data.pagination || {},
        nextPage: response.data.data.pagination?.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useSearchUsers = (filters: any, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['searchUsers', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        limit: 20,
        ...filters
      };

      const response = await api.get('/users/search', { params });
      return {
        users: response.data.data.users || [],
        pagination: response.data.data.pagination || {},
        nextPage: response.data.data.pagination?.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000, // Cache search results for 1 minute
  });
};

export const useUserLikes = (countOnly = false) => {
  return useQuery({
    queryKey: ['userLikes', { countOnly }],
    queryFn: async () => {
      const response = await api.get('/users/likes', {
        params: { countOnly }
      });
      return response.data.data;
    },
    refetchInterval: false, // Rely on socket updates
    staleTime: Infinity,
  });
};

