import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { createSharedSecret, encryptMessage } from '../lib/e2ee';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, theirPublicKey: string, messageId?: string) => void;
  onMessage: (callback: (data: any) => void) => void;
  offMessage: (callback: (data: any) => void) => void;
  onTypingStart: (callback: (data: any) => void) => void;
  offTypingStart: (callback: (data: any) => void) => void;
  onTypingStop: (callback: (data: any) => void) => void;
  offTypingStop: (callback: (data: any) => void) => void;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  onMatchNew: (callback: (data: any) => void) => void;
  offMatchNew: (callback: (data: any) => void) => void;
  onLikeNew: (callback: (data: any) => void) => void;
  offLikeNew: (callback: (data: any) => void) => void;
  onConfessionNew: (callback: (data: any) => void) => void;
  offConfessionNew: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const keyPair = JSON.parse(localStorage.getItem('keyPair') || 'null');
    if (!keyPair || !keyPair.publicKey) {
      console.error('Could not find public key for socket connection');
      return;
    }

    // Get API base URL
    const apiUrl = import.meta.env.VITE_API_URL 
      || (import.meta.env.DEV 
        ? 'http://localhost:5000' 
        : 'https://campus-connect-server-yqbh.onrender.com');

    // Remove /api suffix if present for Socket.io
    const socketUrl = apiUrl.replace('/api', '');

    const newSocket = io(socketUrl, {
      auth: {
        token: token,
        publicKey: keyPair.publicKey
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.io connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.io disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.io connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  const joinChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('join:chat', chatId);
    }
  };

  const leaveChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('leave:chat', chatId);
    }
  };

  const sendMessage = (chatId: string, content: string, theirPublicKey: string, messageId?: string) => {
    if (socket && isConnected) {
      const keyPair = JSON.parse(localStorage.getItem('keyPair') || 'null');
      if (!keyPair || !keyPair.secretKey) {
        console.error('Could not find secret key to encrypt message');
        return;
      }

      const sharedSecret = createSharedSecret(theirPublicKey, keyPair.secretKey);
      const encryptedContent = encryptMessage(content, sharedSecret);

      socket.emit('message:send', {
        chatId,
        content: encryptedContent,
        messageId: messageId || `temp-${Date.now()}`
      });
    }
  };

  const onMessage = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('message:new', callback);
    }
  };

  const offMessage = (callback: (data: any) => void) => {
    if (socket) {
      socket.off('message:new', callback);
    }
  };

  const onTypingStart = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('typing:start', callback);
    }
  };

  const offTypingStart = (callback: (data: any) => void) => {
    if (socket) {
      socket.off('typing:start', callback);
    }
  };

  const onTypingStop = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('typing:stop', callback);
    }
  };

  const offTypingStop = (callback: (data: any) => void) => {
    if (socket) {
      socket.off('typing:stop', callback);
    }
  };

  const lastTypingSentRef = useRef<number>(0);

  const startTyping = (chatId: string) => {
    if (socket && isConnected) {
      const now = Date.now();
      // Throttle: Only send typing:start if we haven't sent it in the last 2 seconds
      if (now - lastTypingSentRef.current > 2000) {
        socket.emit('typing:start', { chatId });
        lastTypingSentRef.current = now;
      }
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Auto-stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(chatId);
      }, 3000);
    }
  };

  const stopTyping = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('typing:stop', { chatId });
      lastTypingSentRef.current = 0; // Reset throttle
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const onMatchNew = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('match:new', callback);
    }
  };

  const offMatchNew = (callback: (data: any) => void) => {
    if (socket) {
      socket.off('match:new', callback);
    }
  };

  const onLikeNew = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('like:new', callback);
    }
  };

  const offLikeNew = (callback: (data: any) => void) => {
    if (socket) {
      socket.off('like:new', callback);
    }
  };

  const onConfessionNew = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('confession:new', callback);
    }
  };

  const offConfessionNew = (callback: (data: any) => void) => {
    if (socket) {
      socket.off('confession:new', callback);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinChat,
        leaveChat,
        sendMessage,
        onMessage,
        offMessage,
        onTypingStart,
        offTypingStart,
        onTypingStop,
        offTypingStop,
        startTyping,
        stopTyping,
        onMatchNew,
        offMatchNew,
        onLikeNew,
        offLikeNew,
        onConfessionNew,
        offConfessionNew,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

