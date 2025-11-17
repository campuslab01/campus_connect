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
    refetchInterval: 35000,
    refetchIntervalInBackground: false,
    staleTime: 20000,
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
  });
};

export const useUserLikes = () => {
  return useQuery({
    queryKey: ['userLikes'],
    queryFn: async () => {
      const response = await api.get('/users/likes');
      return response.data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

