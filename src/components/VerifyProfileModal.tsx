import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FaceVerification from './FaceVerification';

interface VerifyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifiedSuccess: () => void;
}

const VerifyProfileModal: React.FC<VerifyProfileModalProps> = ({ isOpen, onClose, onVerifiedSuccess }) => {
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
            className="bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="px-6 py-5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-b border-white/20">
              <h3 className="text-white text-lg font-bold">Verify Your Profile</h3>
              <p className="text-white/80 text-sm mt-1">Take a quick selfie to verify you’re a real person.</p>
            </div>
            <div className="px-6 py-5">
              <FaceVerification onSuccess={onVerifiedSuccess} />
              <div className="mt-3">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerifyProfileModal;