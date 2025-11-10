import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, User, MessageCircle } from 'lucide-react';
import { useChats } from '../hooks/useChatQuery';
import { useSendMessage } from '../hooks/useChatQuery';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { useE2EE } from '../hooks/useE2EE';

interface ShareConfessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  confessionId: string | number;
  confessionContent: string;
}

const ShareConfessionModal: React.FC<ShareConfessionModalProps> = ({
  isOpen,
  onClose,
  confessionId,
  confessionContent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { data: chatsData, isLoading } = useChats(1, 50);
  const { user } = useAuth();
  const { showToast } = useToast();
  const sendMessageMutation = useSendMessage();
  const navigate = useNavigate();
  const { getPublicKeyForUser } = useE2EE();

  const chats = (chatsData as any)?.chats || [];

  // Transform chats to show other participant
  const transformedChats = chats.map((chat: any) => {
    const userIdStr = ((user as any)?.id || (user as any)?._id)?.toString();
    const otherParticipant = chat.participants?.find((p: any) => {
      const pIdStr = (p._id || p.id)?.toString();
      return pIdStr !== userIdStr;
    });

    return {
      id: chat._id || chat.id,
      chatId: chat._id || chat.id,
      name: otherParticipant?.name || 'Unknown',
      avatar: otherParticipant?.profileImage || '/images/login.jpeg',
      lastMessage: chat.lastMessage || 'No messages yet',
      otherParticipantId: otherParticipant?._id || otherParticipant?.id || null
    };
  });

  // Filter chats based on search
  const filteredChats = transformedChats.filter((chat: any) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = async (chatId: string, otherUserId?: string | null) => {
    if (!chatId) return;

    setSelectedChatId(chatId);
    
    try {
      // Resolve recipient user ID and their public key for encryption/socket
      let targetUserId: string | null = null;
      if (otherUserId) {
        targetUserId = otherUserId?.toString() || null;
      } else {
        const chat = transformedChats.find((c: any) => (c.chatId || c.id)?.toString() === chatId?.toString());
        targetUserId = chat?.otherParticipantId ? chat.otherParticipantId.toString() : null;
      }

      const theirPublicKey = targetUserId ? await getPublicKeyForUser(targetUserId) : null;

      await sendMessageMutation.mutateAsync({
        chatId,
        content: `Shared a confession: "${confessionContent.substring(0, 50)}${confessionContent.length > 50 ? '...' : ''}"`,
        type: 'confession',
        confessionId: confessionId.toString(),
        theirPublicKey: theirPublicKey || ''
      });

      showToast({
        type: 'success',
        message: 'Confession shared successfully!',
        duration: 3000
      });

      // Navigate to chat with the selected user for immediate context
      if (otherUserId) {
        navigate('/chat', { state: { userId: otherUserId } });
      } else {
        navigate('/chat');
      }

      onClose();
    } catch (error: any) {
      console.error('Error sharing confession:', error);
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to share confession',
        duration: 4000
      });
    } finally {
      setSelectedChatId(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedChatId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-bold flex items-center gap-2">
              <MessageCircle size={20} />
              Share Confession
            </h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Confession Preview */}
          <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10">
            <p className="text-white/80 text-sm line-clamp-2">{confessionContent}</p>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {isLoading ? (
              <div className="text-center py-8 text-white/60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                <p className="text-sm">Loading chats...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <User size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats found</p>
              </div>
            ) : (
              filteredChats.map((chat: any) => (
                <motion.button
                  key={chat.id}
                  onClick={() => handleShare(chat.chatId, chat.otherParticipantId)}
                  disabled={sendMessageMutation.isPending}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/login.jpeg';
                    }}
                  />
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{chat.name}</p>
                    <p className="text-white/60 text-xs truncate">{chat.lastMessage}</p>
                  </div>
                  {sendMessageMutation.isPending && selectedChatId === chat.chatId && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                  )}
                </motion.button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-white/40 text-xs">
            Select a chat to share this confession
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareConfessionModal;

