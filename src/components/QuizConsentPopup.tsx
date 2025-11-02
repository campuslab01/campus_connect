import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Users } from 'lucide-react';

interface QuizConsentPopupProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  otherUserName?: string;
  userConsent?: boolean | null;
  otherUserConsent?: boolean | null;
  deniedBy?: 'you' | 'other' | null;
}

export const QuizConsentPopup: React.FC<QuizConsentPopupProps> = ({
  isOpen,
  onAllow,
  onDeny,
  otherUserName = 'Your match',
  userConsent,
  otherUserConsent,
  deniedBy
}) => {
  // Show who denied if someone denied
  if (deniedBy) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-red-900/90 via-pink-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-red-500/20 border border-red-500/50">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Quiz Declined
                </h2>
                <p className="text-white/80">
                  {deniedBy === 'you' 
                    ? 'You declined to take the compatibility quiz.'
                    : `${otherUserName} declined to take the compatibility quiz.`}
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Both users must agree to take the quiz together.
                </p>
              </div>
              <button
                onClick={onDeny}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Show waiting state if one user has consented but not the other
  if (userConsent !== null && otherUserConsent === null) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/50 animate-pulse">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Waiting for {otherUserName}
                </h2>
                <p className="text-white/80">
                  You've agreed to take the quiz. Waiting for {otherUserName} to respond...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Initial consent request
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Compatibility Quiz
              </h2>
              <p className="text-white/80 mb-4">
                You and {otherUserName} have reached 15 messages!
              </p>
              <p className="text-white/70 text-sm">
                Take the compatibility quiz together to discover your match percentage. Both users must agree to participate.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onDeny}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white/80 font-medium hover:bg-white/20 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={onAllow}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Accept
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

