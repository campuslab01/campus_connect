import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MessageCircle, Star, Crown } from 'lucide-react';
import { mockLikes } from '../data/mockLikes';
import bgImage from '/images/login.jpeg';


const LikesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'likes' | 'matches'>('likes');
  const [showPremium, setShowPremium] = useState(false);

  const handleAction = (userId: number, action: 'like' | 'dislike' | 'dm') => {
    alert(`Action: ${action} for user ${userId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08 } 
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
    <div className="min-h-screen bg-black/50 backdrop-blur-[1.3px] relative">
      <div className="max-w-2xl mx-auto">
        {/* HEAD */}
      <div className="sticky top-0 z-20 bg-black/70 backdrop-blur-md pb-4 pt-2">
          {/* Header */}
        <div className="flex justify-between items-center mb-2 p-4">
          <h2 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
 bg-clip-text text-transparent text-xl font-semibold tracking-wide">Likes & Matches</h2>
          <button
            onClick={() => setShowPremium(true)}
            className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-medium px-3 py-2 rounded-xl hover:shadow-lg transition-all"
          >
            <Crown size={16} />
            <span className="text-sm">Premium</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-2 my-2 bg-white/5 rounded-2xl p-1 mb-6 backdrop-blur-md border border-white/10">
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all relative overflow-hidden ${
              activeTab === 'likes'
                ? 'text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {activeTab === 'likes' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl" />
            )}
            <span className="relative z-10">Likes ({mockLikes.likes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all relative overflow-hidden ${
              activeTab === 'matches'
                ? 'text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {activeTab === 'matches' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl" />
            )}
            <span className="relative z-10">Matches ({mockLikes.matches.length})</span>
          </button>
        </div>
        </div>
        
{/* sCROLL-Y */}
<div className="overflow-y-auto max-h-[calc(100vh-120px)] px-4 pt-2 pb-32 space-y-4 ">
        {/* Likes Tab */}
        {activeTab === 'likes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 mb-4 backdrop-blur-md border border-pink-400/30 shadow-lg shadow-pink-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">See who likes you!</h3>
                  <p className="text-sm text-white/70">Upgrade to Premium to see all your likes</p>
                </div>
                <button
                  onClick={() => setShowPremium(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg shadow-pink-500/30 hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Upgrade
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mockLikes.likes.map((like, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 rounded-2xl overflow-hidden backdrop-blur-md border border-white/10 shadow-lg shadow-pink-500/10 relative"
                >
                  <div className="relative">
                    <img
                      src={like.photo}
                      alt={like.name}
                      className={`w-full h-48 object-cover ${
                        !like.isPremiumVisible ? 'blur-sm' : ''
                      }`}
                    />
                    {!like.isPremiumVisible && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                        <div className="text-center text-white">
                          <Heart className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Premium Required</p>
                        </div>
                      </div>
                    )}
                    {like.verified && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <Star size={12} />
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h4 className="font-medium text-white mb-1">
                      {like.isPremiumVisible ? `${like.name}, ${like.age}` : 'Someone'}
                    </h4>
                    <p className="text-xs text-white/70 mb-2">
                      {like.isPremiumVisible ? like.college : 'Liked your profile'}
                    </p>

                    {like.isPremiumVisible ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleAction(like.id, 'like')}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg shadow-pink-500/20 hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                          Like
                        </button>
                        <button
                          onClick={() => handleAction(like.id, 'dislike')}
                          className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 hover:bg-white/20 transition-all"
                        >
                          Dislike
                        </button>
                        <button
                          onClick={() => handleAction(like.id, 'dm')}
                          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg shadow-pink-500/20 hover:from-purple-500 hover:to-pink-500 transition-all"
                        >
                          DM
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowPremium(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl font-medium shadow-lg shadow-pink-500/20 hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {mockLikes.matches.map((match, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 backdrop-blur-md border border-pink-400/30 shadow-lg shadow-pink-500/20 flex items-center gap-3"
              >
                <img
                  src={match.photo}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-400/40"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium">{match.name}, {match.age}</h4>
                  <p className="text-xs text-white/70">{match.college}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(match.id, 'dm')}
                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg shadow-pink-500/20 hover:from-purple-500 hover:to-pink-500 transition-all"
                  >
                    DM
                  </button>
                  <button
                    onClick={() => handleAction(match.id, 'dislike')}
                    className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Dislike
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
    </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full shadow-lg shadow-pink-500/30 relative"
            >
              <button
                onClick={() => setShowPremium(false)}
                className="absolute top-3 right-3 text-white hover:text-pink-400 transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-white text-xl font-bold mb-2">Go Premium!</h3>
              <p className="text-white/70 mb-4">Unlock all likes and see who really likes you.</p>
              <button
                onClick={() => alert('Premium Purchased!')}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-medium px-4 py-2 rounded-xl shadow-lg shadow-yellow-500/20 hover:from-yellow-500 hover:to-orange-500 transition-all"
              >
                Upgrade Now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </motion.div>
  );
};

export default LikesPage;
