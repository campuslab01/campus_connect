import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Eye, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';

interface ConfessionMessageCardProps {
  confessionId: string | number;
  isOwn: boolean;
  time: string;
  text: string; // Preview text from message
  confession?: any; // Pre-populated confession data from message
}

const ConfessionMessageCard: React.FC<ConfessionMessageCardProps> = ({
  confessionId,
  isOwn,
  time,
  confession: initialConfession
}) => {
  const [confession, setConfession] = useState<any>(initialConfession || null);
  const [loading, setLoading] = useState(!initialConfession);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch if not already provided
    if (initialConfession) {
      setConfession(initialConfession);
      setLoading(false);
      return;
    }

    const fetchConfession = async () => {
      try {
        const response = await api.get(`/confessions/${confessionId}`);
        if (response.data.status === 'success') {
          setConfession(response.data.data.confession);
        }
      } catch (error) {
        console.error('Error fetching confession:', error);
      } finally {
        setLoading(false);
      }
    };

    if (confessionId) {
      fetchConfession();
    }
  }, [confessionId, initialConfession]);

  const handleViewConfession = () => {
    navigate('/confessions', { state: { confessionId } });
  };

  if (loading) {
    return (
      <motion.div 
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md border ${isOwn ? "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-pink-400/30 shadow-lg shadow-pink-500/20" : "bg-white/10 text-white border-white/10"}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  if (!confession) {
    return (
      <motion.div 
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md border ${isOwn ? "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-pink-400/30" : "bg-white/10 text-white border-white/10"}`}
      >
        <p className="text-sm opacity-70">Confession not available</p>
        <p className={`text-xs mt-1 ${isOwn ? "text-pink-100" : "text-white/50"}`}>{time}</p>
      </motion.div>
    );
  }

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

  const confessionTime = confession.createdAt ? formatTime(confession.createdAt) : 'Recently';
  const likeCount = Array.isArray(confession.likes) ? confession.likes.length : 0;
  const commentCount = Array.isArray(confession.comments) ? confession.comments.length : 0;

  return (
    <motion.div
      className={`max-w-xs lg:max-w-md rounded-2xl backdrop-blur-md border overflow-hidden ${isOwn ? "bg-gradient-to-r from-purple-500/80 to-pink-500/80 border-pink-400/30 shadow-lg shadow-pink-500/20" : "bg-white/10 border-white/10"}`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        {confession.isAnonymous ? (
          <EyeOff size={16} className={isOwn ? "text-pink-100" : "text-white/70"} />
        ) : (
          <Eye size={16} className={isOwn ? "text-pink-100" : "text-white/70"} />
        )}
        <span className={`text-xs font-medium ${isOwn ? "text-pink-100" : "text-white/70"}`}>
          {confession.isAnonymous ? 'Anonymous' : confession.author?.name || 'User'}
        </span>
        <span className={`text-xs ${isOwn ? "text-pink-200" : "text-white/50"}`}>• {confessionTime}</span>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className={`text-sm ${isOwn ? "text-white" : "text-white"} line-clamp-3`}>
          {confession.content || confession.text}
        </p>
      </div>

      {/* Stats */}
      <div className="px-4 pb-2 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Heart size={12} className={isOwn ? "text-pink-100" : "text-white/60"} />
          <span className={`text-xs ${isOwn ? "text-pink-100" : "text-white/60"}`}>{likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={12} className={isOwn ? "text-pink-100" : "text-white/60"} />
          <span className={`text-xs ${isOwn ? "text-pink-100" : "text-white/60"}`}>{commentCount}</span>
        </div>
      </div>

      {/* View Button */}
      <motion.button
        onClick={handleViewConfession}
        className={`w-full px-4 py-2 border-t ${isOwn ? "border-pink-400/30 bg-pink-500/20 hover:bg-pink-500/30" : "border-white/10 bg-white/5 hover:bg-white/10"} transition-colors flex items-center justify-center gap-2`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ExternalLink size={14} className={isOwn ? "text-pink-100" : "text-white/70"} />
        <span className={`text-xs font-medium ${isOwn ? "text-pink-100" : "text-white/70"}`}>
          View Full Confession
        </span>
      </motion.button>

      {/* Message Time */}
      <div className="px-4 pb-2">
        <p className={`text-xs text-center ${isOwn ? "text-pink-100/70" : "text-white/40"}`}>{time}</p>
      </div>
    </motion.div>
  );
};

export default ConfessionMessageCard;

