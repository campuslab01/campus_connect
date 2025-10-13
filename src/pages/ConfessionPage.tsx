import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, EyeOff, ArrowLeft, MessageCircle, Share2 } from 'lucide-react';
import { mockConfessions, Comment, Reply } from '../data/mockConfessions';
import CommentSection from '../components/CommentSection';
import bgImage from '/images/login.jpeg';
import { useNavigate } from 'react-router-dom';

const ConfessionPage: React.FC = () => {
  const [showNewConfession, setShowNewConfession] = useState(false);
  const [confessionText, setConfessionText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [likedConfessions, setLikedConfessions] = useState<Set<number>>(new Set());
  const [selectedConfession, setSelectedConfession] = useState<number | null>(null);
  const [confessions, setConfessions] = useState(mockConfessions);
  const navigate = useNavigate();

  const handleSubmitConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionText.trim()) return;

    console.log('New confession:', { text: confessionText, anonymous: isAnonymous });

    setConfessionText('');
    setShowNewConfession(false);
  };

  const handleLike = (confessionId: number) => {
    setLikedConfessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(confessionId)) newSet.delete(confessionId);
      else newSet.add(confessionId);
      return newSet;
    });
  };

  const handleAddComment = (confessionId: number, text: string, isAnonymous: boolean) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: isAnonymous ? 'Anonymous' : 'You',
      text,
      time: 'now',
      likes: 0,
      isLiked: false,
      isAnonymous,
      replies: []
    };

    setConfessions(prev => prev.map(confession => 
      confession.id === confessionId 
        ? { 
            ...confession, 
            comments: confession.comments + 1,
            commentsList: [...confession.commentsList, newComment]
          }
        : confession
    ));
  };

  const handleAddReply = (confessionId: number, commentId: string, text: string, isAnonymous: boolean) => {
    const newReply: Reply = {
      id: `r${Date.now()}`,
      author: isAnonymous ? 'Anonymous' : 'You',
      text,
      time: 'now',
      likes: 0,
      isLiked: false,
      isAnonymous
    };

    setConfessions(prev => prev.map(confession => 
      confession.id === confessionId 
        ? {
            ...confession,
            commentsList: confession.commentsList.map(comment =>
              comment.id === commentId
                ? { ...comment, replies: [...comment.replies, newReply] }
                : comment
            )
          }
        : confession
    ));
  };

  const handleLikeComment = (confessionId: number, commentId: string) => {
    setConfessions(prev => prev.map(confession => 
      confession.id === confessionId 
        ? {
            ...confession,
            commentsList: confession.commentsList.map(comment =>
              comment.id === commentId
                ? { 
                    ...comment, 
                    isLiked: !comment.isLiked,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                  }
                : comment
            )
          }
        : confession
    ));
  };

  const handleLikeReply = (confessionId: number, commentId: string, replyId: string) => {
    setConfessions(prev => prev.map(confession => 
      confession.id === confessionId 
        ? {
            ...confession,
            commentsList: confession.commentsList.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.map(reply =>
                      reply.id === replyId
                        ? { 
                            ...reply, 
                            isLiked: !reply.isLiked,
                            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                          }
                        : reply
                    )
                  }
                : comment
            )
          }
        : confession
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08 } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 25 }
    },
  };

  return (
    <motion.div 
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>

      <div className="relative z-10 max-w-3xl mx-auto h-screen flex flex-col">

        {/* Confession Header */}
<motion.div 
  className="flex justify-between items-center p-4 bg-black/80 backdrop-blur-md sticky top-0 z-20 shadow-md"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Left section: optional back button */}
  <div className="flex items-center gap-3">
    <motion.h2 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
 bg-clip-text text-transparent text-xl font-semibold tracking-wide">
      Confessions
    </motion.h2>
  </div>

  {/* Right section: New Confession + Profile */}
  <div className="flex items-center gap-3">
    {/* New Confession button */}
    <motion.button
      onClick={() => setShowNewConfession(true)}
      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-pink-500/40 transition-all"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      + Add Confession
    </motion.button>

    {/* Profile button */}
    <button
      onClick={() => navigate('/profile')}
      className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/30 shadow-md"
    >
      <img
        src="/images/login.jpeg" // replace with dynamic avatar if available
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </button>
  </div>
</motion.div>



        {/* New Confession Modal */}
        <AnimatePresence>
          {showNewConfession && (
            <motion.div 
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md flex flex-col"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <motion.h3 
                  className="text-xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Share Your Confession
                </motion.h3>

                <form onSubmit={handleSubmitConfession}>
                  <motion.textarea
                    value={confessionText}
                    onChange={(e) => setConfessionText(e.target.value)}
                    placeholder="What's on your mind? Share anonymously..."
                    className="w-full h-32 p-3 border border-white/20 rounded-2xl bg-black/20 text-white placeholder-white/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none backdrop-blur-sm"
                    maxLength={500}
                  />

                  <motion.div className="flex items-center justify-between mt-4">
                    <motion.button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all ${
                        isAnonymous 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300' 
                          : 'bg-white/10 text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="text-sm font-medium">
                        {isAnonymous ? 'Anonymous' : 'Show Identity'}
                      </span>
                    </motion.button>
                    
                    <div className="text-sm text-white/60">
                      {confessionText.length}/500
                    </div>
                  </motion.div>

                  <motion.div className="flex space-x-3 mt-6">
                    <motion.button
                      type="button"
                      onClick={() => setShowNewConfession(false)}
                      className="flex-1 bg-white/10 text-white font-medium py-3 rounded-2xl hover:bg-white/20 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-pink-500/40 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Post
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <motion.div className="space-y-4" variants={containerVariants}>
            {confessions.map((confession, index) => (
              <motion.div 
                key={index}
                className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-lg flex flex-col space-y-2"
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.01 }}
                layout
              >
                <div className="flex items-start gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {confession.isAnonymous 
                      ? <EyeOff size={16} /> 
                      : <img src={confession.avatar} alt="User" className="w-full h-full rounded-full object-cover" />}
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white truncate">
                        {confession.isAnonymous ? 'Anonymous' : confession.author}
                      </h4>
                      <span className="text-xs text-white/60 ml-2">{confession.time}</span>
                    </div>

                    <p className="text-white/80 leading-relaxed">{confession.text}</p>

                    {confession.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {confession.tags.map((tag, idx) => (
                          <motion.span
                            key={idx}
                            className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-pink-300 text-xs px-2 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons: Like, Comment, Share */}
                <div className="flex justify-center h-auto items-center p-2 gap-5 mt-3 shadow-sm backdrop-blur-md border border-white/20 rounded-2xl">
                  <motion.button
                    onClick={() => handleLike(confession.id)}
                    className={`flex items-center justify-center w-10 h-5 rounded-xl backdrop-blur-md border border-white/20 text-white shadow-lg transition-all ${
                      likedConfessions.has(confession.id) ? 'bg-pink-500/30' : 'bg-white/10'
                    }`}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart size={14} className={likedConfessions.has(confession.id) ? 'fill-current' : ''} />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setSelectedConfession(confession.id)}
                    className="flex items-center justify-center w-10 h-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle size={14} />
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center justify-center w-10 h-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 size={14} />
                  </motion.button>
                </div>


              </motion.div>
            ))}
          </motion.div>
        </div>

        {confessions.length === 0 && (
          <div className="text-center py-12 text-white/70">
            <h3 className="text-base font-medium mb-1">No confessions yet</h3>
            <p className="text-sm">Be the first to share one!</p>
          </div>
        )}
      </div>

      {/* Comment Section Modal */}
      <AnimatePresence>
        {selectedConfession && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedConfession(null)}
          >
            <motion.div 
              className="bg-black/40 backdrop-blur-xl border-t border-white/20 rounded-t-3xl w-full max-h-[80vh] flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-white font-semibold">Comments</h3>
                <button
                  onClick={() => setSelectedConfession(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Comment Section */}
              {selectedConfession && (
                <CommentSection
                  confessionId={selectedConfession}
                  comments={confessions.find(c => c.id === selectedConfession)?.commentsList || []}
                  onAddComment={(text, isAnonymous) => handleAddComment(selectedConfession, text, isAnonymous)}
                  onAddReply={(commentId, text, isAnonymous) => handleAddReply(selectedConfession, commentId, text, isAnonymous)}
                  onLikeComment={(commentId) => handleLikeComment(selectedConfession, commentId)}
                  onLikeReply={(commentId, replyId) => handleLikeReply(selectedConfession, commentId, replyId)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConfessionPage;
