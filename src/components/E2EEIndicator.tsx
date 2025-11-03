import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface E2EEIndicatorProps {
  isActive?: boolean;
}

export const E2EEIndicator: React.FC<E2EEIndicatorProps> = ({ isActive = true }) => {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 border border-green-400/30 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Lock size={12} className="text-green-400" />
      <span className="text-xs text-green-400 font-medium">
        End-to-end encrypted
      </span>
    </motion.div>
  );
};

