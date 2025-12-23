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
        // Use countOnly=true for likes to reduce payload size
        const [unreadMessages, likesData] = await Promise.allSettled([
          api.get('/chat/unread-count').catch(() => ({ data: { data: { unreadCount: 0 } } })),
          api.get('/users/likes?countOnly=true').catch(() => ({ data: { data: { likes: [], likedBy: [], matches: [] } } }))
        ]);

        // Extract message count - API returns { data: { unreadCount } }
        const messagesCount = unreadMessages.status === 'fulfilled' 
          ? unreadMessages.value.data?.data?.unreadCount || 0
          : 0;

        // Extract likes count
        const likesDataResult = likesData.status === 'fulfilled'
          ? likesData.value.data?.data || {}
          : {};
        
        // When using countOnly=true, the backend might return counts directly or empty arrays
        // Check if we got counts or arrays
        let likedByCount = 0;
        let matchesCount = 0;

        if (Array.isArray(likesDataResult.likedBy)) {
             likedByCount = likesDataResult.likedBy.length;
        } else if (typeof likesDataResult.likedBy === 'number') {
             likedByCount = likesDataResult.likedBy;
        }

        if (Array.isArray(likesDataResult.matches)) {
             matchesCount = likesDataResult.matches.length;
        } else if (typeof likesDataResult.matches === 'number') {
             matchesCount = likesDataResult.matches;
        }

        // People who liked you but you haven't matched with yet = new likes
        // Note: If the backend logic for countOnly returns total likes including matches, adjust logic.
        // Assuming likedBy includes everyone who liked.
        const likesCount = Math.max(0, likedByCount - matchesCount);

        const confessionsCount = 0;
        const profileCount = 0;

        return {
          messages: Math.max(0, messagesCount),
          likes: Math.max(0, likesCount),
          confessions: Math.max(0, confessionsCount),
          profile: Math.max(0, profileCount),
        };
      } catch (error) {
        return {
          messages: 0,
          likes: 0,
          confessions: 0,
          profile: 0,
        };
      }
    },
    refetchInterval: 60000, // Refetch every 60 seconds (much less aggressive)
    staleTime: 30000, // Data is fresh for 30 seconds
    refetchOnWindowFocus: 'always', // Update when user comes back to tab
  });
};

