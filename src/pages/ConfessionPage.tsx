import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, EyeOff, MessageCircle, Share2 } from 'lucide-react';
import { Comment, Reply } from '../data/mockConfessions'; // Types kept for API integration
import CommentSection from '../components/CommentSection';
import ShareConfessionModal from '../components/ShareConfessionModal';
import bgImage from '/images/login.jpeg';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useConfessions, useCreateConfession } from '../hooks/useConfessionsQuery';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { InfiniteScroll } from '../components/InfiniteScroll';
import api from '../config/axios';

const ConfessionPage: React.FC = () => {
  const [showNewConfession, setShowNewConfession] = useState(false);
  const [confessionText, setConfessionText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedConfession, setSelectedConfession] = useState<number | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [confessionToShare, setConfessionToShare] = useState<{ id: string | number; content: string } | null>(null);
  const navigate = useNavigate();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [membership, setMembership] = useState<{ active: boolean; membershipLevel?: string; meta?: any } | null>(null);

  // Helper function to format time - MUST be defined before it's used
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Fetch confessions with infinite scroll using React Query
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading: loading, 
    isFetchingNextPage,
    error: queryError 
  } = useConfessions();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/payment/premium-status');
        if (mounted) setMembership(res.data);
      } catch {
        if (mounted) setMembership(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Create confession mutation
  const createConfessionMutation = useCreateConfession();

  // Flatten paginated confessions
  const confessionsData = React.useMemo(() => data?.pages.flatMap(page => page.confessions) || [], [data]);
  const locked = Boolean(data?.pages?.some((p: any) => p?.meta?.locked));

  // Transform API response to match Confession structure
  const confessions = React.useMemo(() => confessionsData.map((confession: any) => {
    // Ensure comments is always an array
    const commentsArray = Array.isArray(confession.comments) ? confession.comments : [];

    // Check if current user liked this confession
    const userId = (user as any)?._id || (user as any)?.id;
    const userIdStr = userId?.toString();
    const isLiked = Array.isArray(confession.likes) && confession.likes.some((likeId: any) => {
      const likeIdStr = (likeId._id || likeId)?.toString();
      return likeIdStr === userIdStr;
    });

    return {
    id: confession._id || confession.id,
    author: confession.isAnonymous ? undefined : confession.author?.name,
    avatar: confession.isAnonymous ? undefined : (() => {
      const img = confession.author?.profileImage || confession.author?.photos?.[0];
      if (!img) return undefined;
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      if (img.startsWith('/uploads')) {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
        return `${apiUrl.replace('/api', '')}${img}`;
      }
      return img;
    })(),
    text: confession.content || confession.text,
    time: confession.createdAt ? formatTime(confession.createdAt) : 'Just now',
      likes: Array.isArray(confession.likes) ? confession.likes.length : (typeof confession.likes === 'number' ? confession.likes : 0),
      comments: commentsArray.length,
      shares: 0, // Share count not implemented yet
      isLiked: isLiked,
    isAnonymous: confession.isAnonymous !== false,
    college: confession.author?.college || confession.college || '',
      tags: Array.isArray(confession.tags) ? confession.tags : [],
      commentsList: commentsArray.map((comment: any, commentIndex: number) => {
        const userId = (user as any)?._id || (user as any)?.id;
        const userIdStr = userId?.toString();

        // Check if user liked this comment - likes array contains user IDs
        const commentIsLiked = Array.isArray(comment.likes) && comment.likes.some((likeId: any) => {
          const likeIdStr = (likeId._id || likeId)?.toString();
          return likeIdStr === userIdStr;
        });

        return {
      id: comment._id || comment.id,
      author: comment.isAnonymous ? 'Anonymous' : comment.author?.name || 'Unknown',
      authorAvatar: comment.isAnonymous ? undefined : comment.author?.profileImage,
      text: comment.content || comment.text,
      time: comment.createdAt ? formatTime(comment.createdAt) : 'Just now',
          likes: Array.isArray(comment.likes) ? comment.likes.length : 0,
          isLiked: commentIsLiked,
      isAnonymous: comment.isAnonymous !== false,
          commentIndex, // Store MongoDB array index for API calls
          replies: Array.isArray(comment.replies) ? comment.replies.map((reply: any, replyIndex: number) => {
            // Check if user liked this reply
            const replyIsLiked = Array.isArray(reply.likes) && reply.likes.some((likeId: any) => {
              const likeIdStr = (likeId._id || likeId)?.toString();
              return likeIdStr === userIdStr;
            });

            return {
        id: reply._id || reply.id,
        author: reply.isAnonymous ? 'Anonymous' : reply.author?.name || 'Unknown',
        authorAvatar: reply.isAnonymous ? undefined : reply.author?.profileImage,
        text: reply.content || reply.text,
        time: reply.createdAt ? formatTime(reply.createdAt) : 'Just now',
              likes: Array.isArray(reply.likes) ? reply.likes.length : 0,
              isLiked: replyIsLiked,
              isAnonymous: reply.isAnonymous !== false,
              commentIndex, // Store for API calls
              replyIndex // Store MongoDB array index for API calls
            } as Reply;
          }) : []
        } as Comment;
      })
    };
  }), [confessionsData, user]);

  const error = queryError ? ((queryError as any)?.response?.data?.message || 'Failed to load confessions') : null;
  const confLimit = Number(membership?.meta?.confessionLimit) || 30;
  const isPrimeActive = Boolean(membership?.active || membership?.membershipLevel === 'prime');

  // Real-time confession updates
  useEffect(() => {
    if (!socket.isConnected) return;

    const handleNewConfession = (_data: any) => {
      // Invalidate React Query cache to refetch
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    };

    socket.onConfessionNew(handleNewConfession);

    return () => {
      socket.offConfessionNew(handleNewConfession);
    };
  }, [socket, queryClient]);

  const handleSubmitConfession = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = confessionText.trim();

    // Validate content length (backend requires 10-1000 characters)
    if (!trimmedContent) {
      alert('Please enter a confession');
      return;
    }

    if (trimmedContent.length < 10) {
      alert('Confession must be at least 10 characters long');
      return;
    }

    if (trimmedContent.length > 1000) {
      alert('Confession cannot be more than 1000 characters');
      return;
    }

    createConfessionMutation.mutate(
      {
        content: trimmedContent,
        isAnonymous: Boolean(isAnonymous) // Ensure it's a boolean
      },
      {
        onSuccess: () => {
          setConfessionText('');
          setShowNewConfession(false);

          // Broadcast via Socket.io
          if (socket.isConnected) {
            // The socket will emit from backend after saving
          }
        },
        onError: (err: any) => {
          console.error('Error creating confession:', err);
          const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to post confession';
          alert(errorMessage);
        }
      }
    );
  };

  const handleLike = async (confessionId: number | string) => {
    try {
      const confession = confessions.find((c: any) => c.id === confessionId);
      if (!confession) return;

      const isCurrentlyLiked = confession.isLiked;

      // Call API
      if (isCurrentlyLiked) {
        await api.delete(`/confessions/${confessionId}/like`);
      } else {
        await api.post(`/confessions/${confessionId}/like`);
      }

      // Invalidate queries to refetch updated confession
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    } catch (err: any) {
      console.error('Error toggling like:', err);
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    }
  };

  const handleAddComment = async (confessionId: number, text: string, isAnonymous: boolean) => {
    try {
      const response = await api.post(`/confessions/${confessionId}/comments`, {
        content: text.trim(),
        isAnonymous: isAnonymous
      });

      if (response.data.status === 'success') {
        // Invalidate queries to refetch updated confession with new comment
        queryClient.invalidateQueries({ queryKey: ['confessions'] });
      }
    } catch (err: any) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleAddReply = async (confessionId: number, commentId: string, text: string, isAnonymous: boolean) => {
    try {
      // Find the comment index from the confessions data
      const confession = confessions.find((c: any) => c.id === confessionId);
      if (!confession) {
        alert('Confession not found');
        return;
      }

      const comment = confession.commentsList?.find((c: any) => c.id === commentId);
      if (!comment || comment.commentIndex === undefined) {
        alert('Comment not found');
        return;
      }

      const response = await api.post(`/confessions/${confessionId}/comments/${comment.commentIndex}/replies`, {
        content: text.trim(),
        isAnonymous: Boolean(isAnonymous)
      });

      if (response.data.status === 'success') {
        // Invalidate queries to refetch updated confession with new reply
        queryClient.invalidateQueries({ queryKey: ['confessions'] });
      }
    } catch (err: any) {
      console.error('Error adding reply:', err);
      alert(err.response?.data?.message || 'Failed to add reply');
    }
  };

  const handleLikeComment = async (confessionId: number, commentId: string) => {
    try {
      // Find the comment index from the confessions data
      const confession = confessions.find((c: any) => c.id === confessionId);
      if (!confession) {
        return;
      }

      const comment = confession.commentsList?.find((c: any) => c.id === commentId);
      if (!comment || comment.commentIndex === undefined) {
        return;
      }

      await api.post(`/confessions/${confessionId}/comments/${comment.commentIndex}/like`);

      // Invalidate queries to refetch updated confession
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    } catch (err: any) {
      console.error('Error liking comment:', err);
      alert(err.response?.data?.message || 'Failed to like comment');
    }
  };

  const handleLikeReply = async (confessionId: number, commentId: string, replyId: string) => {
    try {
      // Find the comment and reply indices from the confessions data
      const confession = confessions.find((c: any) => c.id === confessionId);
      if (!confession) {
        return;
      }

      const comment = confession.commentsList?.find((c: any) => c.id === commentId);
      if (!comment || comment.commentIndex === undefined) {
        return;
      }

      const reply = comment.replies?.find((r: any) => r.id === replyId);
      if (!reply || reply.replyIndex === undefined) {
        return;
      }

      await api.post(`/confessions/${confessionId}/comments/${comment.commentIndex}/replies/${reply.replyIndex}/like`);

      // Invalidate queries to refetch updated confession
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    } catch (err: any) {
      console.error('Error liking reply:', err);
      alert(err.response?.data?.message || 'Failed to like reply');
    }
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
      className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/30 shadow-md cursor-pointer"
    >
      <img
        src={user?.profileImage || user?.photos?.[0] || '/images/login.jpeg'}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/login.jpeg';
        }}
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
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs ${isPrimeActive ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white'}`}>
              {isPrimeActive ? 'Prime' : 'Free'}
            </span>
            {!isPrimeActive && (
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white">
                {`Confessions ${confessionsData.length}/${confLimit}`}
              </span>
            )}
          </div>
          {loading && !data && (
            <div className="text-center py-8 text-white/70">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
              <p className="text-sm">Loading confessions...</p>
            </div>
          )}
          {error && !loading && (
            <div className="text-center py-8 text-red-400">
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <InfiniteScroll 
              fetchNext={fetchNextPage} 
              hasMore={(hasNextPage && !locked) || false} 
              isLoading={isFetchingNextPage}
            >
              <motion.div className="space-y-4" variants={containerVariants}>
                {confessions.map((confession, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ y: -2, scale: 1.01 }}
                    layout
                  >
                    {/* Header Section */}
                    <div className="p-4 pb-2">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/30 shadow-md"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {confession.avatar ? (
                            <img 
                              src={confession.avatar} 
                              alt={confession.author || 'Anonymous'} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/login.jpeg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {confession.author ? confession.author.charAt(0).toUpperCase() : 'A'}
                              </span>
                            </div>
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <div className="font-medium text-white">
                            {confession.author || 'Anonymous'}
                          </div>
                          <div className="text-xs text-white/60">
                            {confession.time}
                          </div>
                        </div>
                        {confession.college && (
                          <div className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">
                            {confession.college}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-4 py-2">
                      <div className="text-white/90 text-sm leading-relaxed">
                        {confession.text}
                      </div>

                      {/* Tags */}
                      {Array.isArray(confession.tags) && confession.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {confession.tags.map((tag: string, tagIndex: number) => (
                            <motion.span
                              key={tagIndex}
                              className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 px-2 py-1 rounded-full"
                              whileHover={{ scale: 1.05 }}
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar - Instagram Style */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/20">
                      <div className="flex items-center space-x-6">
                        <motion.button
                          onClick={() => handleLike(confession.id)}
                          className={`flex items-center space-x-2 transition-all ${
                            confession.isLiked 
                              ? 'text-pink-500' 
                              : 'text-white/70 hover:text-pink-500'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart size={20} className={confession.isLiked ? 'fill-current' : ''} />
                          {confession.likes > 0 && <span className="text-sm font-medium">{confession.likes}</span>}
                        </motion.button>

                        <motion.button
                          onClick={() => setSelectedConfession(confession.id as number)}
                          className="flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MessageCircle size={20} />
                          {confession.comments > 0 && <span className="text-sm font-medium">{confession.comments}</span>}
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            setConfessionToShare({
                              id: confession.id,
                              content: confession.text
                            });
                            setShareModalOpen(true);
                          }}
                          className="flex items-center space-x-2 text-white/70 hover:text-green-400 transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Share2 size={20} />
                          {confession.shares > 0 && <span className="text-sm font-medium">{confession.shares}</span>}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </InfiniteScroll>
          )}
          {locked && (
            <div className="mt-2 p-6 text-center bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border-2 border-white/30 rounded-3xl">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <Heart size={28} className="text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">Confession Limit Reached</h3>
              <p className="text-white/80 mb-4">Unlock unlimited confessions with Prime.</p>
              <button
                onClick={() => navigate('/likes')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg shadow-pink-500/30 hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Upgrade
              </button>
            </div>
          )}
        </div>

        {!loading && !error && confessions.length === 0 && (
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

      {/* Share Confession Modal */}
      {confessionToShare && (
        <ShareConfessionModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setConfessionToShare(null);
          }}
          confessionId={confessionToShare.id}
          confessionContent={confessionToShare.content}
        />
      )}
    </motion.div>
  );
};

export default ConfessionPage;
