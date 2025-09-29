import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, X, MessageCircle, ChevronLeft, ChevronRight, MapPin, GraduationCap } from 'lucide-react';
import { mockUsers } from '../data/mockUsers';

const DiscoverPage: React.FC = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentUser = mockUsers[currentUserIndex];

  const getPhotoInfo = (photoIndex: number) => {
    switch (photoIndex) {
      case 0:
        return {
          title: 'Basic Info',
          details: [
            { label: 'Name', value: currentUser.name },
            { label: 'Age', value: `${currentUser.age}` },
            { label: 'College', value: currentUser.college }
          ]
        };
      case 1:
        return {
          title: 'Academic Info',
          details: [
            { label: 'Bio', value: currentUser.bio },
            { label: 'Department', value: currentUser.department },
            { label: 'Year', value: currentUser.year }
          ]
        };
      case 2:
        return {
          title: 'Preferences',
          details: [
            { label: 'Status', value: currentUser.relationshipStatus },
            { label: 'Interests', value: currentUser.interests.join(', ') }
          ]
        };
      default:
        return { title: '', details: [] };
    }
  };

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % 3);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + 3) % 3);

  const handleAction = (action: 'like' | 'dislike' | 'dm') => {
    if (swipeCount >= 15 && action !== 'dm') {
      setShowLimitModal(true);
      return;
    }

    setIsAnimating(true);
    if (action !== 'dm') setSwipeCount((prev) => prev + 1);

    setTimeout(() => {
      setCurrentUserIndex((prev) => (prev + 1) % mockUsers.length);
      setCurrentPhotoIndex(0);
      setIsAnimating(false);
      setDragDirection(null);
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) handleAction('like');
    else if (info.offset.x < -threshold) handleAction('dislike');
  };

  const photoInfo = getPhotoInfo(currentPhotoIndex);

  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? 10 : -10
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotate: direction < 0 ? 10 : -10,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div className="max-w-lg mx-auto p-4 pt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentUserIndex}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={dragDirection === 'right' ? 1 : dragDirection === 'left' ? -1 : 0}
          drag="x"
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          whileDrag={{
            scale: 1.05,
            rotate: dragDirection === 'right' ? 5 : dragDirection === 'left' ? -5 : 0
          }}
          onDrag={(e, info) => {
            if (info.offset.x > 50) setDragDirection('right');
            else if (info.offset.x < -50) setDragDirection('left');
            else setDragDirection(null);
          }}
        >
          {/* Photo Section */}
          <div className="relative h-96 sm:h-[500px] md:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={currentUser.photos[currentPhotoIndex]}
                alt={`${currentUser.name} - Photo ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Photo Navigation & Verified */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="flex space-x-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className={`h-1 w-6 sm:w-12 rounded-full ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'}`}
                    animate={{
                      backgroundColor: index === currentPhotoIndex ? '#ffffff' : 'rgba(255,255,255,0.5)'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              {currentUser.verified && (
                <motion.div
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  ✓ Verified
                </motion.div>
              )}
            </div>

            {/* Prev/Next */}
            <motion.button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 sm:p-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 sm:p-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>

            {/* Swipe Count */}
            <div className="absolute top-4 right-4">
              <motion.div
                className="bg-black/50 text-white px-3 py-1 rounded-full text-xs"
                animate={{ scale: swipeCount >= 15 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                Swipes: {swipeCount}/15
              </motion.div>
            </div>

            {/* Drag Indicators */}
            <AnimatePresence>
              {dragDirection === 'right' && (
                <motion.div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-green-500 text-white p-4 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  >
                    <Heart size={32} />
                  </motion.div>
                </motion.div>
              )}
              {dragDirection === 'left' && (
                <motion.div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-red-500 text-white p-4 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  >
                    <X size={32} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Section */}
          <motion.div className="p-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="mb-4">
              <motion.h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2" key={photoInfo.title}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                {photoInfo.title}
              </motion.h3>
              <div className="space-y-2">
                {photoInfo.details.map((detail, index) => (
                  <motion.div key={index} className="flex justify-between text-sm sm:text-base"
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 + 0.4 }}>
                    <span className="text-gray-600 font-medium">{detail.label}:</span>
                    <span className="text-gray-800">{detail.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Distance & Match */}
            <motion.div className="flex items-center space-x-4 mb-4 text-sm text-gray-600"
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{currentUser.distance} away</span>
              </div>
              <div className="flex items-center space-x-1">
                <GraduationCap size={14} />
                <span>Same campus</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="flex justify-center space-x-6"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
              <motion.button onClick={() => handleAction('dislike')}
                className="bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full p-4 transition-all duration-300 transform hover:scale-110">
                <X size={24} />
              </motion.button>
              <motion.button onClick={() => handleAction('dm')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-4 transition-all duration-300 transform hover:scale-110">
                <MessageCircle size={24} />
              </motion.button>
              <motion.button onClick={() => handleAction('like')}
                className="bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full p-4 transition-all duration-300 transform hover:scale-110">
                <Heart size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Premium Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 max-w-sm w-full"
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <motion.h3 className="text-xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                Daily Limit Reached
              </motion.h3>
              <motion.p className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                You've reached your daily limit of 15 swipes. Upgrade to Premium for unlimited swipes!
              </motion.p>
              <div className="space-y-3">
                <motion.button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Upgrade to Premium</motion.button>
                <motion.button onClick={() => setShowLimitModal(false)}
                  className="w-full bg-gray-100 text-gray-600 font-medium py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue Tomorrow</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoverPage;
