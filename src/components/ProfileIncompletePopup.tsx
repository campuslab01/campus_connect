import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileIncompletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
}

const ProfileIncompletePopup: React.FC<ProfileIncompletePopupProps> = ({ isOpen, onClose, onCompleteProfile }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="px-6 py-5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-b border-white/20">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <span className="text-white text-2xl">✨</span>
                </div>
                <h3 className="text-white text-lg font-bold">Profile Incomplete</h3>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-white/80 text-sm text-center">
                Please complete your profile to start discovering matches.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                >
                  Close
                </button>
                <button
                  onClick={onCompleteProfile}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition shadow-lg"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileIncompletePopup;