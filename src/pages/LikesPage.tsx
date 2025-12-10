import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, Crown } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
// Mock data removed - data will be fetched from MongoDB
import bgImage from '/images/login.jpeg';
import { useQueryClient } from '@tanstack/react-query';
import { useUserLikes } from '../hooks/useUsersQuery';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';


const LikesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'likes' | 'matches'>('likes');
  const [showPremium, setShowPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'semiannual'>('monthly');
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isPremiumActive, setIsPremiumActive] = useState<boolean>(false);
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  // Fetch likes and matches using React Query
  const { data: likesData, isLoading: loading, error: queryError } = useUserLikes();
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessMessage, setAccessMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // Fetch premium status for current user (controls blur/lock on likes)
  useEffect(() => {
    let mounted = true;
    const fetchPremiumStatus = async () => {
      try {
        const res = await api.get('/payment/premium-status');
        const active = !!res?.data?.active;
        if (mounted) setIsPremiumActive(active);
      } catch (_) {
        // Default to non-premium if endpoint unavailable
        if (mounted) setIsPremiumActive(false);
      }
    };
    fetchPremiumStatus();
    return () => { mounted = false; };
  }, []);

  // Transform likes (users who liked you)
  // Rule: If current user is NOT premium and liker IS premium, show as locked; otherwise visible
  const likes = (likesData?.likedBy || [])
    .map((liker: any) => {
      const getImageUrl = (url: string | undefined) => {
        if (!url) return '/images/login.jpeg';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/uploads')) {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
          return `${apiUrl.replace('/api', '')}${url}`;
        }
        return url;
      };
      const photo = getImageUrl(liker.profileImage || liker.photos?.[0]);
      const likerIsPremium = Boolean(liker?.isPremium);
      const isLocked = !isPremiumActive && likerIsPremium;
      return {
        id: String(liker._id || liker.id),
        name: liker.name,
        age: liker.age,
        photo,
        college: liker.college,
        verified: Boolean(liker.isVerified ?? liker.verified),
        isLocked,
        likedAt: 'Recently'
      };
    });

  // Transform matches
  const matches = (likesData?.matches || []).map((user: any) => ({
    id: String(user._id || user.id),
    name: user.name,
    age: user.age,
    photo: (() => {
      const getImageUrl = (url: string | undefined) => {
        if (!url) return '/images/login.jpeg';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/uploads')) {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
          return `${apiUrl.replace('/api', '')}${url}`;
        }
        return url;
      };
      return getImageUrl(user.profileImage || user.photos?.[0]);
    })(),
    college: user.college,
    matchedAt: 'Recently',
    compatibilityScore: user.compatibilityScore,
    mutualInterests: user.mutualInterests || 0
  }));

  const error = queryError ? ((queryError as any)?.response?.data?.message || 'Failed to load likes') : null;

  // Real-time like/match notifications
  useEffect(() => {
    if (!socket.isConnected) return;

    const handleNewLike = (_data: any) => {
      console.log('New like received:', _data);
      // Invalidate React Query cache to refetch
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    const handleNewMatch = (_data: any) => {
      console.log('New match received:', _data);
      // Invalidate React Query cache to refetch
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    };

    socket.onLikeNew(handleNewLike);
    socket.onMatchNew(handleNewMatch);

    return () => {
      // Cleanup handled by SocketContext
    };
  }, [socket, queryClient]);

  // Handle Instamojo payment
  const handlePayment = async () => {
    if (processingPayment) return;
    
    setProcessingPayment(true);
    
    try {
      const response = await api.post('/payment/create-payment', {
        plan: selectedPlan,
        amount: selectedPlan === 'monthly' ? 99 : selectedPlan === 'quarterly' ? 267 : 474,
        redirect_url: window.location.origin + '/payment/callback'
      });

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to create payment');
      }

      const { longurl } = response.data.data;
      window.location.href = longurl;
    } catch (error: any) {
      console.error('Payment error:', error);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to initiate payment',
        duration: 5000
      });
      setProcessingPayment(false);
    }
  };

  const handleAction = async (userId: string, action: 'like' | 'dislike' | 'dm') => {
    try {
      if (action === 'dm') {
        // Navigate to chat page with user ID
        navigate('/chat', { state: { userId } });
        showToast({
          type: 'success',
          message: 'Opening chat...',
          duration: 2000
        });
      } else if (action === 'like') {
        // Like the user
        await api.post(`/users/${userId}/like`);
        showToast({
          type: 'success',
          message: 'User liked successfully!',
          duration: 2000
        });
        // Refresh likes data
        queryClient.invalidateQueries({ queryKey: ['userLikes'] });
        queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
      } else if (action === 'dislike') {
        // Unlike/remove the user
        await api.delete(`/users/${userId}/like`);
        showToast({
          type: 'success',
          message: 'User removed from likes',
          duration: 2000
        });
        // Refresh likes data
        queryClient.invalidateQueries({ queryKey: ['userLikes'] });
        queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to ${action} user`;
      if (error.response?.status === 403) {
        setAccessMessage(errorMessage || 'Account verification required');
        setPendingAction(() => async () => { await handleAction(userId, action); });
        setShowAccessModal(true);
      } else {
        showToast({ type: 'error', message: errorMessage, duration: 3000 });
      }
    }
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
        {loading && (
          <div className="text-center py-8 text-white/70">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <p className="text-sm">Loading...</p>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-8 text-red-400">
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-2 p-4">
              <h2 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
bg-clip-text text-transparent text-xl font-semibold tracking-wide">Likes & Matches</h2>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <button
                  onClick={() => setShowPremium(true)}
                  className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-medium px-3 py-2 rounded-xl hover:shadow-lg transition-all"
                >
                  <Crown size={16} />
                  <span className="text-sm">Premium</span>
                </button>
              </div>
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
                <span className="relative z-10">Likes ({likes.length})</span>
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
                <span className="relative z-10">Matches ({matches.length})</span>
              </button>
            </div>
          </>
        )}
      </div>
        
      {/* sCROLL-Y */}
      {!loading && !error && (
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
                  <p className="text-sm text-white/70">{isPremiumActive ? 'Premium active — all likes unlocked' : 'Upgrade to unlock premium likes'}</p>
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
              {likes.map((like: any, index: number) => (
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
                      className={`w-full h-48 object-cover ${like.isLocked ? 'blur-sm' : ''}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = '/images/login.jpeg';
                        if (target.src !== fallback && !target.src.includes(fallback)) {
                          target.src = fallback;
                        }
                      }}
                    />
                    {like.isLocked && (
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
                      {like.isLocked ? 'Premium user' : `${like.name}, ${like.age}`}
                    </h4>
                    <p className="text-xs text-white/70 mb-2">
                      {like.isLocked ? 'Liked your profile' : like.college}
                    </p>

                    {!like.isLocked ? (
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
              {matches.map((match: any, index: number) => (
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallback = '/images/login.jpeg';
                    if (target.src !== fallback && !target.src.includes(fallback)) {
                      target.src = fallback;
                    }
                  }}
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
      )}
      
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
              <h3 className="text-white text-xl font-bold mb-2 flex items-center gap-2">
                <Crown size={24} className="text-yellow-400" />
                Go Premium!
              </h3>
              <p className="text-white/70 mb-6">Unlock all likes and see who really likes you.</p>
              
              {/* Plan Selection */}
              <div className="space-y-3 mb-6">
                {[
                  { id: 'monthly' as const, name: 'Monthly', price: '₹99', savings: 'Limited-time offer' }
                ].map((plan) => (
                  <motion.button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all ${
                      selectedPlan === plan.id
                        ? 'border-pink-500 bg-pink-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative text-white">
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-medium">{plan.name}</p>
                          {plan.savings && (
                            <p className="text-xs text-green-400">{plan.savings}</p>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute -top-4 -right-3 text-white/70 text-xs line-through bg-white/10 px-2 py-0.5 rounded">
                            ₹475
                          </span>
                          <p className="font-extrabold text-lg">{plan.price}</p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowPriceDetails(prev => !prev); }}
                          className="text-xs text-white/80 hover:text-white transition-colors"
                        >
                          View price details
                        </button>
                        <AnimatePresence>
                          {showPriceDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 bg-white/5 border border-white/10 rounded-lg p-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-white/70">Original price</span>
                                <span className="text-white/70 line-through">₹475</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-white">Offer price</span>
                                <span className="text-green-400 font-semibold">₹99</span>
                              </div>
                              <p className="mt-1 text-white/60">Limited-time introductory offer on Premium.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={handlePayment}
                disabled={processingPayment}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-medium px-4 py-3 rounded-xl shadow-lg shadow-yellow-500/20 hover:from-yellow-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: processingPayment ? 1 : 1.02 }}
                whileTap={{ scale: processingPayment ? 1 : 0.98 }}
              >
                {processingPayment ? 'Processing...' : 'Upgrade Now'}
              </motion.button>
              
              <p className="text-xs text-white/50 mt-4 text-center">
                Secure payment powered by Instamojo
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccessModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-md w-full overflow-hidden" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="px-6 py-5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-b border-white/20">
                <h3 className="text-white text-lg font-bold">Email Verification Required</h3>
                <p className="text-white/80 text-sm mt-1">{accessMessage || 'Please verify your email to continue. Check your inbox for the verification link.'}</p>
              </div>
              <div className="px-6 py-5 space-y-3">
                <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition" onClick={async () => { if (pendingAction) { setShowAccessModal(false); await pendingAction(); } }}>
                  I Verified, Retry Now
                </button>
                <button className="w-full px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20" onClick={() => { setShowAccessModal(false); navigate('/auth'); }}>
                  Open Login
                </button>
                <button className="w-full px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition border border-white/10" onClick={() => setShowAccessModal(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </motion.div>
  );
};

export default LikesPage;
