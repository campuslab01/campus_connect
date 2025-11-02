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
        const [unreadMessages, likesData] = await Promise.allSettled([
          api.get('/chat/unread-count').catch(() => ({ data: { data: { unreadCount: 0 } } })),
          api.get('/users/likes').catch(() => ({ data: { data: { likedBy: [], matches: [] } } }))
        ]);

        // Extract message count - API returns { data: { unreadCount } }
        const messagesCount = unreadMessages.status === 'fulfilled' 
          ? unreadMessages.value.data?.data?.unreadCount || 0
          : 0;

        // Extract likes count - count likedBy (people who liked you) that aren't matches
        const likesDataResult = likesData.status === 'fulfilled'
          ? likesData.value.data?.data || {}
          : {};
        
        // Count likes: likedBy count minus matches (since matches are also in likedBy)
        const likedByCount = Array.isArray(likesDataResult.likedBy) ? likesDataResult.likedBy.length : 0;
        const matchesCount = Array.isArray(likesDataResult.matches) ? likesDataResult.matches.length : 0;
        // People who liked you but you haven't matched with yet = new likes
        const likesCount = Math.max(0, likedByCount - matchesCount);

        // For confessions, count total confessions (you can add read tracking later)
        // For now, return 0 as confessions don't have unread tracking yet
        // You can implement read tracking similar to messages if needed
        const confessionsCount = 0;

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

