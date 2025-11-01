// ChatPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Picker from "@emoji-mart/react"; // default import
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Sparkles,
  Smile,
  Paperclip,
  Search,
  Star,
} from "lucide-react";
// Mock data removed - data will be fetched from MongoDB
import bgImage from "/images/login.jpeg";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useChats, useInfiniteMessages, useSendMessage } from '../hooks/useChatQuery';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axios';


const ChatPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { userId?: number | string } | undefined;
  const initialUserId = state?.userId ?? null;
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  
  // When navigating from DM, find or create chat
  useEffect(() => {
    if (initialUserId && !selectedChat) {
      const findOrCreateChat = async () => {
        try {
          // Use GET endpoint to get or create chat
          const response = await api.get(`/chat/${initialUserId}`);
          if (response.data.status === 'success') {
            const chat = response.data.data.chat;
            // Set selected chat directly using chat._id
            setSelectedChat(chat._id || chat.id);
            
            // Refresh chats list in background
            const { queryClient } = require('@tanstack/react-query');
            queryClient.invalidateQueries({ queryKey: ['chats'] });
          }
        } catch (err: any) {
          console.error('Error getting/creating chat:', err);
          const errorMsg = err.response?.data?.message || 'Failed to start chat';
          // TODO: Re-enable matching requirement check after testing phase
          // During testing phase, allow chatting without matching
          // if (errorMsg.includes('matched')) {
          //   alert('You need to match with this user first before you can chat.');
          // } else {
          //   alert(errorMsg);
          // }
          // For now, only show alert for non-matching errors during testing
          if (!errorMsg.includes('matched')) {
            alert(errorMsg);
          }
        }
      };
      findOrCreateChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUserId]);

const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji picker toggle

const handleEmojiSelect = (emoji: any) => {
  setMessage((prev) => prev + emoji.native); // Append emoji to message
};

  // const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"primary" | "requests">("primary");
  const { user } = useAuth();
  const socket = useSocket();
  
  // Fetch chats using React Query
  const { data: chatsData, isLoading: loading, error: chatsError } = useChats(1, 50);
  const chats = (chatsData as any)?.chats || (chatsData as any)?.data?.chats || [];
  
  // Transform chats to match UI structure
  const transformedChats = chats.map((chat: any) => {
    const userIdStr = ((user as any)?.id || (user as any)?._id)?.toString();
    const otherParticipant = chat.participants?.find((p: any) => {
      const pIdStr = (p._id || p.id)?.toString();
      return pIdStr !== userIdStr;
    });
    
    return {
      id: chat._id || chat.id,
      name: otherParticipant?.name || 'Unknown',
      avatar: otherParticipant?.profileImage || '/images/login.jpeg',
      lastMessage: chat.lastMessage?.content || chat.lastMessage || 'No messages yet',
      time: chat.lastMessageAt ? formatTime(chat.lastMessageAt) : 'Just now',
      unreadCount: chat.unreadCount || 0,
      isOnline: false, // TODO: Implement online status
      isDMRequest: false, // TODO: Implement DM request logic
      compatibilityScore: chat.compatibilityScore,
      chatId: chat._id || chat.id
    };
  });

  // Get messages for selected chat with infinite scroll
  const selectedChatData = transformedChats.find((c: any) => c.id === selectedChat);
  const { data: messagesData, fetchNextPage: fetchMoreMessages, hasNextPage: hasMoreMessages } = useInfiniteMessages(
    selectedChatData?.chatId || null
  );

  // Flatten paginated messages
  const allMessages = messagesData?.pages.flatMap((page: any) => page?.messages || []) || [];
  
  // Transform messages to match UI
  const transformedMessages = allMessages.map((msg: any) => ({
    text: msg.content || msg.text,
    time: msg.createdAt ? formatTime(msg.createdAt) : 'Just now',
    isOwn: (msg.sender?._id || msg.sender?.id?.toString()) === ((user as any)?.id?.toString() || (user as any)?._id?.toString()),
    id: msg._id || msg.id
  }));

  // Send message mutation with optimistic updates
  const sendMessageMutation = useSendMessage();

  // Real-time message updates via Socket.io
  useEffect(() => {
    if (!socket.isConnected || !selectedChatData?.chatId) return;

    const handleNewMessage = (_data: any) => {
      // Invalidate React Query cache to refetch messages
      // React Query will handle the update automatically
      const { queryClient } = require('@tanstack/react-query');
      const client = queryClient;
      if (client) {
        client.invalidateQueries({ queryKey: ['chatMessages', selectedChatData.chatId] });
      }
    };

    socket.onMessage(handleNewMessage);
    socket.joinChat(String(selectedChatData.chatId));

    return () => {
      socket.offMessage(handleNewMessage);
      if (selectedChatData?.chatId) {
        socket.leaveChat(String(selectedChatData.chatId));
      }
    };
  }, [socket, selectedChatData?.chatId]);

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };
  const isQuizComplete = () => {
    return quizQuestions.every(q => {
      if (q.type === "select") return !!quizAnswers[q.id];
      if (q.type === "input") return !!quizAnswers[q.id]?.trim();
      return false;
    });
  };
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  

  // Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizTimeLeft, setQuizTimeLeft] = useState(300);
  const [completedScores, setCompletedScores] = useState<{ [key: number]: number }>({});
  const [showScoreCard, setShowScoreCard] = useState(false);

  // Lock scroll when quiz modal is open
  useEffect(() => {
    document.body.style.overflow = showQuiz ? "hidden" : "auto";
  }, [showQuiz]);

  useEffect(() => {
    if (initialUserId) {
      window.history.replaceState({}, document.title);
    }
  }, [initialUserId]);
  

  // Quiz questions (static)
  const quizQuestions = [
    { id: 1, q: "What's your favorite color?", options: ["Red", "Blue", "Green", "Black"], type: "select" },
    { id: 2, q: "Choose a weekend hobby:", options: ["Reading", "Gaming", "Sports", "Traveling"], type: "select" },
    { id: 3, q: "Preferred music genre?", options: ["Rock", "Pop", "Jazz", "Classical"], type: "select" },
    { id: 4, q: "Favorite season?", options: ["Summer", "Winter", "Spring", "Autumn"], type: "select" },
    { id: 5, q: "Pick a pet:", options: ["Dog", "Cat", "Bird", "Fish"], type: "select" },
    { id: 6, q: "Any custom answer?", options: [], type: "input" }, // example input
  ];
  

  // Timer effect
  useEffect(() => {
    if (showQuiz && quizTimeLeft > 0) {
      const timer = setInterval(() => setQuizTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showQuiz, quizTimeLeft]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transformedMessages, selectedChat]);

  const handleSendMessage = async (e: React.FormEvent | null = null) => {
    if (e) e.preventDefault();
    if (!message.trim() || selectedChat === null) return;

    const chat = transformedChats.find((c: any) => c.id === selectedChat);
    if (!chat || !chat.chatId) return;

    // Send via Socket.io immediately (optimistic) and API (for persistence)
    if (socket.isConnected) {
      socket.sendMessage(String(chat.chatId), message.trim());
    }

    // Use mutation for API call (includes optimistic update)
    sendMessageMutation.mutate(
      { chatId: chat.chatId, content: message.trim() },
      {
        onSuccess: () => {
          // Trigger quiz after 5 user messages
          if (transformedMessages.length + 1 >= 5) {
            setShowQuiz(true);
            setQuizTimeLeft(300);
          }
          setMessage("");
        },
        onError: (err: any) => {
          console.error('Error sending message:', err);
          alert(err.response?.data?.message || 'Failed to send message');
        }
      }
    );
  };

 // Filter chats based on search query
const filteredChats = transformedChats.filter(
  (chat: any) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
);


  if (selectedChat !== null) {
    // Find chat by chatId (which is the actual MongoDB _id)
    let chat = transformedChats.find((c: any) => c.chatId?.toString() === selectedChat.toString());
    // If not found, it might be a new chat - check if it's in the raw chats list
    if (!chat && chats.length > 0) {
      const rawChat = chats.find((c: any) => (c._id || c.id)?.toString() === selectedChat.toString());
      if (rawChat) {
        const userIdStr = ((user as any)?.id || (user as any)?._id)?.toString();
        const otherParticipant = rawChat.participants?.find((p: any) => {
          const pIdStr = (p._id || p.id)?.toString();
          return pIdStr !== userIdStr;
        });
        chat = {
          id: rawChat._id || rawChat.id,
          name: otherParticipant?.name || 'Unknown',
          avatar: otherParticipant?.profileImage || '/images/login.jpeg',
          lastMessage: rawChat.lastMessage?.content || 'No messages yet',
          time: rawChat.lastMessageAt ? formatTime(rawChat.lastMessageAt) : 'Just now',
          unreadCount: rawChat.unreadCount || 0,
          isOnline: false,
          isDMRequest: false,
          compatibilityScore: rawChat.compatibilityScore,
          chatId: rawChat._id || rawChat.id
        };
      }
    }
    if (!chat) return null;

    return (
      <motion.div
        className="min-h-screen bg-cover bg-center relative flex flex-col"
        style={{ backgroundImage: `url(${bgImage})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>

        <div className="fixed inset-x-0 top-0 bottom-16 z-10 max-w-3xl mx-auto flex flex-col">
        {/* Chat Header */}
          <motion.div className="bg-black/40 backdrop-blur-md border-b border-white/10 p-4 z-20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => {
                    setSelectedChat(null);
                    setShowQuiz(false);
                  }}
                  className="text-pink-300 hover:text-pink-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft size={22} />
                </motion.button>

                <div className="relative">
                  <motion.img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-pink-400/30"
                    whileHover={{ scale: 1.05 }}
                  />
                  {chat.isOnline && (
                    <motion.div
                      className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black/40"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    {chat.name}
                    {chat.compatibilityScore && (
  <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-400/30">
    {chat.compatibilityScore}% Match
  </span>
)}

                  </h3>
                  <p className="text-xs text-white/60">{chat.isOnline ? "Online now" : "Last seen recently"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                
                <motion.button className="text-white/70 hover:text-pink-300 transition-colors p-2 rounded-xl hover:bg-white/5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <MoreVertical size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <motion.div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Load more button */}
            {hasMoreMessages && (
              <button
                onClick={() => fetchMoreMessages()}
                className="w-full py-2 text-white/70 hover:text-white text-sm"
              >
                Load older messages...
              </button>
            )}
            <AnimatePresence>
              {transformedMessages.map((msg, index) => (
                <motion.div key={index} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: index * 0.05, type: "spring", stiffness: 500, damping: 30 }}>
                  <motion.div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md border ${msg.isOwn ? "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-pink-400/30 shadow-lg shadow-pink-500/20" : "bg-white/10 text-white border-white/10"}`} whileHover={{ scale: 1.02 }}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? "text-pink-100" : "text-white/50"}`}>{msg.time}</p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {showScoreCard && selectedChat !== null && completedScores[selectedChat] && (
              <motion.div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center backdrop-blur-md border border-pink-400/30 shadow-lg shadow-pink-500/20 relative" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }}>
                <button className="absolute top-2 right-2 text-white/70 hover:text-white" onClick={() => setShowScoreCard(false)}>✕</button>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="text-yellow-300" size={20} fill="currentColor" />
                  <h4 className="font-bold text-white">Compatibility Quiz Complete!</h4>
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                  {completedScores[selectedChat]}% Match
                </div>
                <p className="text-xs text-white/70">
                  You both answered 8/12 questions similarly!
                </p>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </motion.div>

          {/* Message Input */}
          <motion.form
            onSubmit={(e) => handleSendMessage(e)}
            className="flex-shrink-0 p-4 bg-black/40 backdrop-blur-md border-t border-white/10 sticky bottom-0 z-20"
          >
            <div className="flex items-center gap-2">
              <motion.button type="button" className=" text-white transition-colors p-2 rounded-xl hover:bg-white/5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Paperclip size={20} />
              </motion.button>

              <motion.input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type your message..."
  className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400/60 backdrop-blur-sm"
/>


             {/* Emoji Button */}
          <motion.button
            type="button"
            className=" text-white transition-colors p-2 rounded-xl hover:bg-white/5"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={20} />
          </motion.button>

              <motion.button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-full p-3 transition-all shadow-lg shadow-pink-500/30" whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Send size={20} />
              </motion.button>
              {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-14 right-0 z-50">
              <Picker onEmojiSelect={handleEmojiSelect} theme="dark" />
            </div>
          )}
            </div>
          </motion.form>
        </div>

        {/* Quiz Modal */}
        <AnimatePresence>
  {showQuiz && (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl max-w-lg w-full flex flex-col overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-md border-b border-white/20 rounded-t-2xl">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white drop-shadow-md">
              Compatibility Quiz
            </span>
            <span className="text-sm text-white/80 mt-1 animate-pulse">
              Time left: {Math.floor(quizTimeLeft / 60)}:
              {(quizTimeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <button
            className="text-white/70 hover:text-white font-bold text-xl"
            onClick={() => setShowQuiz(false)}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Questions */}
        <div className="px-6 py-4 flex-1 overflow-y-auto space-y-4 max-h-[60vh]">
          {quizQuestions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="font-medium text-white">{q.q}</p>
              <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt) => (
  <motion.button
    key={opt}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    disabled={isQuizSubmitted} // disable after submission
    className={`px-4 py-2 rounded-xl border font-medium transition
      ${
        quizAnswers[q.id] === opt
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-pink-400 shadow-lg"
          : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
      }
      ${isQuizSubmitted ? "opacity-50 cursor-not-allowed" : ""}
    `}
    onClick={() => !isQuizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
  >
    {opt}
  </motion.button>
))}



              </div>

              {q.type === "input" && (
                <motion.input
                  type="text"
                  placeholder="Type your answer"
                  value={quizAnswers[q.id] || ""}
                  onChange={(e) =>
                    setQuizAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  className="mt-2 w-full px-4 py-2 rounded-xl border border-white/20 bg-transparent text-white placeholder-white/50 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer / Submit Button */}
<div className="px-6 py-4 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-md border-t border-white/20 rounded-b-2xl">
<motion.button
  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(236,72,153,0.7)" }}
  whileTap={{ scale: 0.95 }}
  disabled={!isQuizComplete() || isQuizSubmitted} // disable until complete
  className={`w-full py-3 rounded-xl font-semibold text-white text-lg
              bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg
              border border-pink-400/40 hover:from-purple-600 hover:to-pink-600
              ${(!isQuizComplete() || isQuizSubmitted) ? "opacity-50 cursor-not-allowed" : ""}`}
  onClick={() => {
    if (!selectedChat) return;
    const score = Math.floor(Math.random() * 100);
    setCompletedScores((prev) => ({ ...prev, [selectedChat]: score }));
    // Compatibility score updated via React Query cache (TODO: Update via API)
    setShowScoreCard(true);
    setIsQuizSubmitted(true); // mark as submitted
    setShowQuiz(false);
  }}
>
  Submit Quiz
</motion.button>

</div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>

      <div className="relative z-10 max-w-2xl mx-auto  pb-4 px-4">
        {/* Messages Header */}
<motion.div
  className="sticky top-0 z-20 -mx-4 px-4 pt-4 pb-3 bg-black/40 backdrop-blur-md border-b border-white/10"
  initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
>
  {/* Header Row */}
  <div className="flex items-center justify-between mb-4">
    {/* Left: Title */}
    <div className="flex items-center gap-2 text-white">
      {/* <Sparkles className="h-5 w-5 text-pink-400" /> */}
      <h2 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
 bg-clip-text text-transparent text-xl font-semibold tracking-wide">
        Messages
      </h2>
    </div>

   
    <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/30 shadow-md">
      <img
        src="/images/login.jpeg"
        alt="Profile"
        onClick={() => navigate('/profile')}
        className="w-full h-full object-cover"
      />
    </button>
  </div>

  {/* Search Input */}
  <div className="relative mb-4">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search conversations..."
      className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-white/10 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50 shadow-lg backdrop-blur-sm"
    />
  </div>

  {/* Futuristic Tab Switcher */}
  <motion.div
    className="flex bg-white/5 rounded-2xl p-1 backdrop-blur-md border border-white/10"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2 }}
  >
    {/* Primary Tab */}
    <motion.button
      onClick={() => setActiveTab("primary")}
      className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
        activeTab === "primary" ? "text-white" : "text-white/60 hover:text-white/80"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {activeTab === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
        Primary
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {filteredChats.filter((c: any) => !c.isDMRequest).length}
        </span>
      </span>
    </motion.button>

    {/* Requests Tab */}
    <motion.button
      onClick={() => setActiveTab("requests")}
      className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
        activeTab === "requests" ? "text-white" : "text-white/60 hover:text-white/80"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {activeTab === "requests" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
        Requests
        {filteredChats.filter((c: any) => c.isDMRequest).length > 0 && (
          <span className="text-xs bg-pink-500/30 px-2 py-0.5 rounded-full border border-pink-400/30">
            {filteredChats.filter((c: any) => c.isDMRequest).length}
          </span>
        )}
      </span>
    </motion.button>
  </motion.div>
</motion.div>


        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 text-white/70">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-sm">Loading chats...</p>
          </div>
        )}

        {/* Error State */}
        {chatsError && !loading && (
          <div className="text-center py-16 text-red-400">
            <p className="text-sm mb-4">{(chatsError as any)?.response?.data?.message || 'Failed to load chats'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tab Content with Animation */}
        {!loading && !chatsError && (
          <AnimatePresence mode="wait">
            {activeTab === "requests" ? (
            /* DM Requests Tab */
            <motion.div
              key="requests"
              className="mt-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredChats.filter((c: any) => c.isDMRequest).length > 0 ? (
                <div className="space-y-3">
                  {filteredChats
                    .filter((chat: any) => chat.isDMRequest)
                    .map((chat: any, index: number) => (
                      <motion.div
                        key={chat.id}
                        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-pink-400/20 rounded-2xl p-4 backdrop-blur-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative">
                              <motion.img
                                src={chat.avatar}
                                alt={chat.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-pink-400/30"
                                whileHover={{ scale: 1.1 }}
                              />
                              {chat.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black/40" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">
                                {chat.name}
                              </h4>
                              <p className="text-xs text-white/60 truncate">
                                {chat.lastMessage}
                              </p>
                              <p className="text-xs text-pink-300/70 mt-1">
                                Sent request {chat.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <motion.button
                              onClick={() => setSelectedChat(chat.id)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg shadow-pink-500/30"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Accept
                            </motion.button>
                            <motion.button
                              className="bg-white/10 text-white/70 px-4 py-1.5 rounded-full text-xs font-medium border border-white/10"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(255,255,255,0.15)",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Decline
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-16 text-white/70"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Sparkles size={32} className="text-pink-400" />
                  </div>
                  <h3 className="text-base font-medium mb-2">No DM requests</h3>
                  <p className="text-sm text-white/50">New requests will appear here</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Primary Chats Tab */
            <motion.div
              key="primary"
              className="mt-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredChats.filter((c: any) => !c.isDMRequest).length > 0 ? (
                <div className="space-y-3 pb-24">
                  {filteredChats
                    .filter((chat: any) => !chat.isDMRequest)
                    .map((chat: any, index: number) => (
                      <motion.div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:shadow-lg hover:shadow-pink-500/20 transition-all cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <motion.img
                              src={chat.avatar}
                              alt={chat.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-purple-400/30"
                              whileHover={{ scale: 1.05 }}
                            />
                            {chat.isOnline && (
                              <motion.div
                                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-black/40"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-white truncate">
                                {chat.name}
                              </h4>
                              <span className="text-xs text-white/50 ml-2">
                                {chat.time}
                              </span>
                            </div>
                            <p className="text-sm text-white/60 truncate">
                              {chat.lastMessage}
                            </p>

                            {chat.compatibilityScore && (
                              <div className="mt-1.5 flex items-center gap-1">
                                <Star className="text-yellow-400" size={12} fill="currentColor" />
                                <span className="text-xs text-pink-300">
                                  {chat.compatibilityScore}% Compatible
                                </span>
                              </div>
                            )}
                          </div>

                          {chat.unreadCount > 0 && (
                            <motion.div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg shadow-pink-500/30"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              {chat.unreadCount}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-16 text-white/70"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Search size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-base font-medium mb-2">No active chats</h3>
                  <p className="text-sm text-white/50">Start a conversation to see it here</p>
                </motion.div>
              )}
            </motion.div>
          )}
          </AnimatePresence>
        )}

        {!loading && !chatsError && filteredChats.length === 0 && searchQuery.trim() !== '' && (
          <div className="text-center py-12 text-white/70">
            <Search size={48} className="mx-auto text-white/40 mb-4" />
            <h3 className="text-base font-medium mb-1">
              No conversations found
            </h3>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showQuiz && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 p-6 rounded-2xl max-w-lg w-full text-white shadow-xl space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-2">Compatibility Quiz</h2>
              <p className="text-sm text-white/70">
  Time left: {Math.floor(quizTimeLeft/60)}:
  {(quizTimeLeft % 60).toString().padStart(2, '0')}
</p>

              {quizQuestions.map((q) => (
                <div key={q.id}>
                  <p className="font-medium mb-1">{q.q}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        className={`px-3 py-2 rounded-xl border transition ${
                          quizAnswers[q.id] === opt
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-pink-400"
                            : "bg-white/10 border-white/20 hover:bg-white/20"
                        }`}
                        onClick={() =>
                          setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

<button
  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-xl mt-4 font-semibold shadow-lg shadow-pink-500/30"
  onClick={() => {
    const score = Math.floor(Math.random() * 100);
    if (selectedChat !== null) {
      setCompletedScores((prev) => ({ ...prev, [selectedChat]: score }));
      // Compatibility score updated via React Query cache (TODO: Update via API)
      setShowScoreCard(true);
      setShowQuiz(false);
    }
  }}
  
>
  Submit Quiz
</button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return null; // keep the DM/active chats part unchanged
};

export default ChatPage;
