import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share, Eye, EyeOff, Send } from 'lucide-react';
import { mockConfessions } from '../data/mockConfessions';

const ConfessionPage: React.FC = () => {
  const [showNewConfession, setShowNewConfession] = useState(false);
  const [confessionText, setConfessionText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedConfession, setSelectedConfession] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [likedConfessions, setLikedConfessions] = useState<Set<number>>(new Set());

  const handleSubmitConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionText.trim()) return;
    
    // Here you would submit the confession
    console.log('New confession:', { text: confessionText, anonymous: isAnonymous });
    
    setConfessionText('');
    setShowNewConfession(false);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // Add comment logic here
    setComment('');
  };

  const handleLike = (confessionId: number) => {
    setLikedConfessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(confessionId)) {
        newSet.delete(confessionId);
      } else {
        newSet.add(confessionId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="max-w-lg mx-auto p-4 pt-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-800"
          variants={itemVariants}
        >
          Confessions
        </motion.h2>
        <motion.button
          onClick={() => setShowNewConfession(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-2 rounded-xl hover:shadow-lg transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          New Confession
        </motion.button>
      </div>

      {/* New Confession Modal */}
      <AnimatePresence>
        {showNewConfession && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.h3 
                className="text-xl font-bold text-gray-800 mb-4"
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
                  className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  maxLength={500}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                />
                
                <motion.div 
                  className="flex items-center justify-between mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                        isAnonymous ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="text-sm font-medium">
                        {isAnonymous ? 'Anonymous' : 'Show Identity'}
                      </span>
                    </motion.button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {confessionText.length}/500
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex space-x-3 mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowNewConfession(false)}
                    className="flex-1 bg-gray-100 text-gray-600 font-medium py-3 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 rounded-xl"
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
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
      >
        {mockConfessions.map((confession, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            variants={itemVariants}
            whileHover={{ y: -2, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            layout={true}
          >
            <div className="flex items-start space-x-3 mb-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {confession.isAnonymous ? (
                  <EyeOff size={16} className="text-white" />
                ) : (
                  <img
                    src={confession.avatar}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {confession.isAnonymous ? 'Anonymous' : confession.author}
                  </h4>
                  <span className="text-sm text-gray-500">{confession.time}</span>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{confession.text}</p>
                
                {confession.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {confession.tags.map((tag, idx) => (
                      <motion.span
                        key={idx}
                        className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <motion.button 
                  onClick={() => handleLike(confession.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    likedConfessions.has(confession.id) 
                      ? 'text-pink-600' 
                      : 'text-gray-500 hover:text-pink-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={likedConfessions.has(confession.id) ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart 
                      size={16} 
                      className={likedConfessions.has(confession.id) ? 'fill-current' : ''}
                    />
                  </motion.div>
                  <span className="text-sm">{confession.likes}</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setSelectedConfession(selectedConfession === index ? null : index)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageCircle size={16} />
                  <span className="text-sm">{confession.comments}</span>
                </motion.button>
                
                <motion.button 
                  className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share size={16} />
                  <span className="text-sm">Share</span>
                </motion.button>
              </div>
              
              <div className="text-xs text-gray-500">
                {confession.college}
              </div>
            </div>
            
            {/* Comments Section */}
            {selectedConfession === index && (
              <motion.div 
                className="mt-4 pt-3 border-t border-gray-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-3 mb-3">
                  {confession.recentComments?.map((commentItem, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-start space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-sm text-gray-700">{commentItem.text}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 font-medium">
                            {commentItem.author}
                          </span>
                          <span className="text-xs text-gray-400">{commentItem.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <form onSubmit={handleComment} className="flex items-center space-x-2">
                  <motion.input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  />
                  <motion.button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-2 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send size={16} />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ConfessionPage;