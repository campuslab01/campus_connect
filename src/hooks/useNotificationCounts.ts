import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';

interface NotificationCounts {
  messages: number;
  likes: number;
  confessions: number;
  profile: number;
}

export const useNotificationCounts = () => {
  return useQuery<NotificationCounts>({
    queryKey: ['notificationCounts'],
    queryFn: async () => {
      try {
        // Fetch all notification counts in parallel
        const [unreadMessages, likesData, confessionsData] = await Promise.allSettled([
          api.get('/chat/unread-count').catch(() => ({ data: { data: { count: 0 } } })),
          api.get('/users/likes').catch(() => ({ data: { data: { newMatches: 0, newLikes: 0 } } })),
          api.get('/confessions').catch(() => ({ data: { data: { unreadCount: 0 } } }))
        ]);

        // Extract message count
        const messagesCount = unreadMessages.status === 'fulfilled' 
          ? unreadMessages.value.data?.data?.count || 0
          : 0;

        // Extract likes count (new matches + new likes)
        const likesDataResult = likesData.status === 'fulfilled'
          ? likesData.value.data?.data || {}
          : {};
        const likesCount = (likesDataResult.newMatches || 0) + (likesDataResult.newLikes || 0);

        // For confessions, we'll use a simple count - you can adjust this based on your API
        // For now, assuming we track unread confessions or new ones
        const confessionsCount = confessionsData.status === 'fulfilled'
          ? confessionsData.value.data?.data?.unreadCount || 0
          : 0;

        // Profile notifications - could be new profile views, etc.
        // For now, set to 0 unless you have a specific endpoint
        const profileCount = 0;

        return {
          messages: Math.max(0, messagesCount),
          likes: Math.max(0, likesCount),
          confessions: Math.max(0, confessionsCount),
          profile: Math.max(0, profileCount),
        };
      } catch (error) {
        // Return zero counts on error
        return {
          messages: 0,
          likes: 0,
          confessions: 0,
          profile: 0,
        };
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds to keep counts updated
    staleTime: 5000, // Consider data stale after 5 seconds for more frequent updates
  });
};

