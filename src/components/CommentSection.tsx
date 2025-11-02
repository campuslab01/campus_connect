import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, Eye, EyeOff, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
  isAnonymous: boolean;
  replies: Reply[];
  commentIndex?: number; // For API calls
}

interface Reply {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
  isAnonymous: boolean;
  commentIndex?: number; // For API calls
  replyIndex?: number; // For API calls
}

interface CommentSectionProps {
  confessionId: number;
  comments: Comment[];
  onAddComment: (text: string, isAnonymous: boolean) => void;
  onAddReply: (commentId: string, text: string, isAnonymous: boolean) => void;
  onLikeComment: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onAddReply,
  onLikeComment,
  onLikeReply
}) => {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAnonymous, setReplyAnonymous] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(newComment.trim(), isAnonymous);
    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo) return;
    
    onAddReply(replyingTo, replyText.trim(), replyAnonymous);
    setReplyText('');
    setReplyingTo(null);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const displayComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
      {/* Comments Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">
            Comments ({comments.length})
          </h3>
          {comments.length > 3 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-pink-400 text-sm hover:text-pink-300 transition-colors"
            >
              {showAllComments ? 'Show Less' : `View All ${comments.length} Comments`}
            </button>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {displayComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              {/* Main Comment */}
              <div className="flex gap-3">
                {/* Commenter Avatar */}
                <div className="flex-shrink-0">
                  {comment.isAnonymous ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <EyeOff size={14} className="text-white" />
                    </div>
                  ) : (
                    <img
                      src={(() => {
                        const img = comment.authorAvatar;
                        if (!img) return '/images/login.jpeg';
                        if (img.startsWith('http://') || img.startsWith('https://')) return img;
                        if (img.startsWith('/uploads')) {
                          const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
                          return `${apiUrl.replace('/api', '')}${img}`;
                        }
                        return img;
                      })()}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">
                      {comment.isAnonymous ? 'Anonymous' : comment.author}
                    </span>
                    <span className="text-white/60 text-xs">
                      {formatTime(comment.time)}
                    </span>
                    {comment.isAnonymous && (
                      <span className="text-pink-400 text-xs">👤</span>
                    )}
                  </div>
                  
                  <p className="text-white/90 text-sm leading-relaxed mb-2">
                    {comment.text}
                  </p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        comment.isLiked 
                          ? 'text-pink-400' 
                          : 'text-white/60 hover:text-pink-400'
                      }`}
                    >
                      <Heart size={12} className={comment.isLiked ? 'fill-current' : ''} />
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                    
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1 text-white/60 hover:text-pink-400 text-xs transition-colors"
                    >
                      <Reply size={12} />
                      Reply
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 ml-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3"
                        >
                          {/* Reply Avatar */}
                          <div className="flex-shrink-0">
                            {reply.isAnonymous ? (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <EyeOff size={10} className="text-white" />
                              </div>
                            ) : (
                              <img
                                src={(() => {
                                  const img = reply.authorAvatar;
                                  if (!img) return '/images/login.jpeg';
                                  if (img.startsWith('http://') || img.startsWith('https://')) return img;
                                  if (img.startsWith('/uploads')) {
                                    const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
                                    return `${apiUrl.replace('/api', '')}${img}`;
                                  }
                                  return img;
                                })()}
                                alt={reply.author}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                          </div>

                          {/* Reply Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-xs">
                                {reply.isAnonymous ? 'Anonymous' : reply.author}
                              </span>
                              <span className="text-white/60 text-xs">
                                {formatTime(reply.time)}
                              </span>
                              {reply.isAnonymous && (
                                <span className="text-pink-400 text-xs">👤</span>
                              )}
                            </div>
                            
                            <p className="text-white/90 text-xs leading-relaxed mb-1">
                              {reply.text}
                            </p>

                            {/* Reply Actions */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => onLikeReply(comment.id, reply.id)}
                                className={`flex items-center gap-1 text-xs transition-colors ${
                                  reply.isLiked 
                                    ? 'text-pink-400' 
                                    : 'text-white/60 hover:text-pink-400'
                                }`}
                              >
                                <Heart size={10} className={reply.isLiked ? 'fill-current' : ''} />
                                {reply.likes > 0 && <span>{reply.likes}</span>}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSubmitReply}
                      className="mt-3 ml-4"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text-white text-sm placeholder-white/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setReplyAnonymous(!replyAnonymous)}
                          className={`p-2 rounded-full transition-colors ${
                            replyAnonymous 
                              ? 'bg-pink-500/20 text-pink-400' 
                              : 'bg-white/10 text-white'
                          }`}
                          title={replyAnonymous ? 'Anonymous Reply' : 'Show Identity'}
                        >
                          {replyAnonymous ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          type="submit"
                          disabled={!replyText.trim()}
                          className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Comment Form */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`p-2 rounded-full transition-colors ${
                isAnonymous 
                  ? 'bg-pink-500/20 text-pink-400' 
                  : 'bg-white/10 text-white'
              }`}
              title={isAnonymous ? 'Comment Anonymously' : 'Show Your Identity'}
            >
              {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        
        {/* Anonymous Toggle Info */}
        <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
          <EyeOff size={12} />
          <span>
            {isAnonymous 
              ? 'Your comment will be posted anonymously' 
              : 'Your comment will show your identity'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
