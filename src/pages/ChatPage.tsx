import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { mockChats } from '../data/mockChats';

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [messages, setMessages] = useState<{[key: number]: any[]}>({});

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Simulate word count trigger for quiz
    const wordCount = message.split(' ').length;
    if (wordCount > 50) { // Simplified trigger
      setShowQuiz(true);
    }
    
    // Add message to local state
    const newMessage = {
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedChat!]: [...(prev[selectedChat!] || []), newMessage]
    }));
    
    setMessage('');
  };

  if (selectedChat !== null) {
    const chat = mockChats[selectedChat];
    const allMessages = [...chat.messages, ...(messages[selectedChat] || [])];
    
    return (
      <motion.div 
        className="max-w-lg mx-auto bg-white h-screen flex flex-col"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Chat Header */}
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex items-center justify-between"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setSelectedChat(null)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <motion.img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
              whileHover={{ scale: 1.1 }}
            />
            <div>
              <motion.h3 
                className="font-semibold"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {chat.name}
              </motion.h3>
              <p className="text-sm text-white/80">{chat.isOnline ? 'Online' : 'Last seen recently'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button 
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Phone size={20} />
            </motion.button>
            <motion.button 
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Video size={20} />
            </motion.button>
            <motion.button 
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreVertical size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {allMessages.map((msg, index) => (
              <motion.div
                key={index}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                layout={true}
              >
                <motion.div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.time}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {chat.compatibilityScore && (
            <motion.div 
              className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.h4 
                className="font-bold text-gray-800 mb-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Compatibility Quiz Complete!
              </motion.h4>
              <motion.div 
                className="text-2xl font-bold text-purple-600 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
              >
                {chat.compatibilityScore}% Match
              </motion.div>
              <motion.p 
                className="text-sm text-gray-600"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                You both answered 8/12 questions similarly!
              </motion.p>
            </motion.div>
          )}
        </motion.div>

        {/* Message Input */}
        <motion.form 
          onSubmit={handleSendMessage} 
          className="p-4 border-t border-gray-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <motion.input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-lg mx-auto p-4 pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Messages
      </motion.h2>
      
      {/* DM Requests */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h3 
          className="text-lg font-semibold text-gray-700 mb-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          DM Requests (2)
        </motion.h3>
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          {mockChats.filter(chat => chat.isDMRequest).map((chat, index) => (
            <motion.div 
              key={index} 
              className="bg-blue-50 border border-blue-200 rounded-xl p-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{chat.name}</h4>
                    <p className="text-sm text-gray-600">{chat.lastMessage}</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <motion.button 
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Accept
                  </motion.button>
                  <motion.button 
                    className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Decline
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Active Chats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.h3 
          className="text-lg font-semibold text-gray-700 mb-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          Chats
        </motion.h3>
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, staggerChildren: 0.1 }}
        >
          {mockChats.filter(chat => !chat.isDMRequest).map((chat, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedChat(mockChats.indexOf(chat))}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <motion.img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  {chat.isOnline && (
                    <motion.div 
                      className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{chat.name}</h4>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <motion.div 
                    className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {chat.unreadCount}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ChatPage;