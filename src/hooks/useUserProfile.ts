import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';

// Fetch user profile by ID
export const useUserProfile = (userId: string | number | null) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

