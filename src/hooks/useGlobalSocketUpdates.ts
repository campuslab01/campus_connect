import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../contexts/SocketContext';

/**
 * Global hook to handle real-time updates via Socket.io
 * This ensures messages and notifications update even when user is on other pages
 */
export const useGlobalSocketUpdates = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    if (!socket.isConnected) return;

    // Handle new messages - refresh chat list and messages
    const handleNewMessage = () => {
      // Invalidate all chat-related queries
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    // Handle new likes/matches - refresh likes and notifications
    const handleNewLike = () => {
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    const handleNewMatch = () => {
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    // Handle new confessions - refresh confessions and notifications
    const handleNewConfession = () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    // Register socket listeners
    socket.onMessage(handleNewMessage);
    socket.onLikeNew(handleNewLike);
    socket.onMatchNew(handleNewMatch);
    socket.onConfessionNew(handleNewConfession);

    // Cleanup
    return () => {
      if (socket.socket) {
        socket.socket.off('message:new', handleNewMessage);
        socket.socket.off('like:new', handleNewLike);
        socket.socket.off('match:new', handleNewMatch);
        socket.socket.off('confession:new', handleNewConfession);
      }
    };
  }, [socket, queryClient]);
};
