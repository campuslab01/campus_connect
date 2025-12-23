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

    // Handle chat request events
    const handleChatRequest = () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    const handleChatAccepted = () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    };

    const handleChatRejected = () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    // Handle premium activation
    const handlePremiumActivated = () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['premiumStatus'] });
    };

    // Handle profile updates
    const handleProfileRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userSuggestions'] });
    };

    // Handle user data refresh
    const handleUserDataRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    // Register socket listeners
    socket.onMessage(handleNewMessage);
    socket.onLikeNew(handleNewLike);
    socket.onMatchNew(handleNewMatch);
    socket.onConfessionNew(handleNewConfession);

    // Register new listeners
    if (socket.socket) {
      socket.socket.on('chat:request', handleChatRequest);
      socket.socket.on('chat:accepted', handleChatAccepted);
      socket.socket.on('chat:rejected', handleChatRejected);
      socket.socket.on('premium:activated', handlePremiumActivated);
      socket.socket.on('profile:refresh', handleProfileRefresh);
      socket.socket.on('user:data-refresh', handleUserDataRefresh);
    }

    // Cleanup
    return () => {
      socket.offMessage(handleNewMessage);
      socket.offLikeNew(handleNewLike);
      socket.offMatchNew(handleNewMatch);
      socket.offConfessionNew(handleNewConfession);

      if (socket.socket) {
        socket.socket.off('chat:request', handleChatRequest);
        socket.socket.off('chat:accepted', handleChatAccepted);
        socket.socket.off('chat:rejected', handleChatRejected);
        socket.socket.off('premium:activated', handlePremiumActivated);
        socket.socket.off('profile:refresh', handleProfileRefresh);
        socket.socket.off('user:data-refresh', handleUserDataRefresh);
      }
    };
  }, [socket, queryClient]);
};
