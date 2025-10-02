import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Sparkles,
  Smile,
  Paperclip,
  Search,
  Star,
} from "lucide-react";
import { mockChats } from "../data/mockChats";
import bgImage from "/images/login.jpeg";


const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<{ [key: number]: any[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState(mockChats);


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

  // Quiz questions (static)
  const quizQuestions = [
    { id: 1, q: "What’s your favorite color?", options: ["Red", "Blue", "Green", "Black"], type: "select" },
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
  }, [messages, selectedChat]);

  const handleSendMessage = (e: React.FormEvent | null = null) => {
    if (e) e.preventDefault();
    if (!message.trim() || selectedChat === null) return;

    const newMessage = {
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };

    const initialMessages = mockChats.find(c => c.id === selectedChat)?.messages || [];
    const allMessagesNow = [...(messages[selectedChat] || []), newMessage];

    // Trigger quiz after 5 user messages
    if (allMessagesNow.length === 5) {
      setShowQuiz(true);
      setQuizTimeLeft(300);
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat]: allMessagesNow,
    }));

    setMessage("");
  };

 // Replace the old filteredChats with this:
const filteredChats = mockChats.filter(
  (chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
);


  if (selectedChat !== null) {
    const chat = chats.find(c => c.id === selectedChat);
    if (!chat) return null;

    const allMessages = [...chat.messages, ...(messages[selectedChat] || [])];

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
                  className="text-cyan-300 hover:text-cyan-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft size={22} />
                </motion.button>

                <div className="relative">
                  <motion.img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400/30"
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
  <span className="text-xs bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-400/30">
    {chat.compatibilityScore}% Match
  </span>
)}

                  </h3>
                  <p className="text-xs text-white/60">{chat.isOnline ? "Online now" : "Last seen recently"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button className="text-white/70 hover:text-cyan-300 transition-colors p-2 rounded-xl hover:bg-white/5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Phone size={20} />
                </motion.button>
                <motion.button className="text-white/70 hover:text-cyan-300 transition-colors p-2 rounded-xl hover:bg-white/5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Video size={20} />
                </motion.button>
                <motion.button className="text-white/70 hover:text-cyan-300 transition-colors p-2 rounded-xl hover:bg-white/5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <MoreVertical size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <motion.div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {allMessages.map((msg, index) => (
                <motion.div key={index} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: index * 0.05, type: "spring", stiffness: 500, damping: 30 }}>
                  <motion.div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md border ${msg.isOwn ? "bg-gradient-to-br from-cyan-500/80 to-blue-500/80 text-white border-cyan-400/30 shadow-neon" : "bg-white/10 text-white border-white/10"}`} whileHover={{ scale: 1.02 }}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? "text-cyan-100" : "text-white/50"}`}>{msg.time}</p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {showScoreCard && selectedChat !== null && completedScores[selectedChat] && (
              <motion.div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl p-4 text-center backdrop-blur-md border border-pink-400/30 shadow-neonPink relative" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }}>
                <button className="absolute top-2 right-2 text-white/70 hover:text-white" onClick={() => setShowScoreCard(false)}>✕</button>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="text-yellow-300" size={20} fill="currentColor" />
                  <h4 className="font-bold text-white">Compatibility Quiz Complete!</h4>
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
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
              <motion.button type="button" className="text-cyan-300 hover:text-cyan-200 transition-colors p-2 rounded-xl hover:bg-white/5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Paperclip size={20} />
              </motion.button>

              <motion.input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type your message..."
  className="flex-1 px-2 py-2 rounded-full bg-white/10 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 backdrop-blur-sm"
/>


              <motion.button type="button" className="text-cyan-300 hover:text-cyan-200 transition-colors p-2 rounded-xl hover:bg-white/5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Smile size={20} />
              </motion.button>

              <motion.button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-full p-3 transition-all shadow-neon" whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Send size={20} />
              </motion.button>
            </div>
          </motion.form>
        </div>

        {/* Quiz Modal */}
        <AnimatePresence>
  {showQuiz && (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl max-w-lg w-full text-white shadow-2xl overflow-y-auto max-h-[90vh] space-y-6 border border-white/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        <h2 className="text-2xl font-bold mb-1 text-center drop-shadow-lg">
          Compatibility Quiz
        </h2>
        <p className="text-sm text-white/70 text-center mb-4 animate-pulse">
          Time left: {Math.floor(quizTimeLeft / 60)}:{(quizTimeLeft % 60).toString().padStart(2, "0")}
        </p>

        {quizQuestions.map((q) => (
          <div key={q.id} className="space-y-2">
            <p className="font-medium mb-2">{q.q}</p>

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl border transition font-medium
                    ${
                      quizAnswers[q.id] === opt
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-cyan-400 shadow-lg"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                    }`}
                  onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
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
                onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                className="mt-2 w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            )}
          </div>
        ))}

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0,255,255,0.7)" }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-xl mt-4 font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg text-white text-lg"
          onClick={() => {
            setShowQuiz(false);
            const score = Math.floor(Math.random() * 100);
            if (selectedChat !== null) {
              setCompletedScores((prev) => ({ ...prev, [selectedChat]: score }));
              setShowScoreCard(true);
            }
          }}
        >
          Submit Quiz
        </motion.button>
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

      <div className="relative z-10 max-w-3xl mx-auto p-4">
        {/* Header */}
        <motion.div
          className="sticky top-0 z-20 -mx-4 px-4 pt-4 pb-3 bg-black/40 backdrop-blur-md border-b border-white/10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-cyan-300 mb-4">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold tracking-wide">Messages</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300/70 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-white/10 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 shadow-neon backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* DM Requests */}
        <motion.div
          className="mt-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
            DM Requests ({filteredChats.filter((c) => c.isDMRequest).length})
          </h3>
          <div className="space-y-3">
            {filteredChats
              .filter((chat) => chat.isDMRequest)
              .map((chat, index) => (
                <motion.div
                  key={chat.id}
                  className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/20 rounded-2xl p-4 backdrop-blur-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
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
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <motion.button
                        onClick={() => setSelectedChat(chat.id)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-neon"
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
        </motion.div>

        {/* Active Chats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            Active Chats
          </h3>
          <div className="space-y-3 pb-24">
            {filteredChats
              .filter((chat) => !chat.isDMRequest)
              .map((chat, index) => (
                <motion.div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:shadow-neon transition-all cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <motion.img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400/30"
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
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-neon"
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
        </motion.div>

        {filteredChats.length === 0 && (
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
              className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 p-6 rounded-2xl max-w-lg w-full text-white shadow-xl space-y-4"
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
                            ? "bg-cyan-500 text-white border-cyan-400"
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
  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-2 rounded-xl mt-4 font-semibold shadow-lg"
  onClick={() => {
    const score = Math.floor(Math.random() * 100);
    if (selectedChat !== null) {
      setCompletedScores((prev) => ({ ...prev, [selectedChat]: score }));
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat
            ? { ...chat, compatibilityScore: score }
            : chat
        )
      );
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
