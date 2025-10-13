import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before calling onComplete
      setTimeout(onComplete, 500);
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 
                 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full 
                       flex items-center justify-center border-2 border-white/30 shadow-2xl"
          >
            <Heart className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Title Animation */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.5,
            duration: 0.8,
            ease: "easeOut"
          }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
        >
          Campus Connection
        </motion.h1>

        {/* Subtitle Animation */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            delay: 0.8,
            duration: 0.6,
            ease: "easeOut"
          }}
          className="text-white/80 text-lg md:text-xl font-medium"
        >
          Connecting Hearts on Campus
        </motion.p>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-8 space-x-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-white/60 rounded-full"
            />
          ))}
        </motion.div>

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                opacity: 0
              }}
              animate={{ 
                y: -100,
                opacity: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
              className="absolute text-white/30"
            >
              <Heart className="w-4 h-4" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
