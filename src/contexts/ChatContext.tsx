import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: number;
  chatId: number;
  text: string;
  senderId: number;
  timestamp: Date;
  isRead: boolean;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (chatId: number, text: string) => void;
  markAsRead: (chatId: number) => void;
  getUnreadCount: (chatId: number) => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (chatId: number, text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      chatId,
      text,
      senderId: 1, // Current user ID
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const markAsRead = (chatId: number) => {
    setMessages(prev => 
      prev.map(message => 
        message.chatId === chatId 
          ? { ...message, isRead: true }
          : message
      )
    );
  };

  const getUnreadCount = (chatId: number) => {
    return messages.filter(
      message => message.chatId === chatId && !message.isRead && message.senderId !== 1
    ).length;
  };

  const value = {
    messages,
    sendMessage,
    markAsRead,
    getUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};