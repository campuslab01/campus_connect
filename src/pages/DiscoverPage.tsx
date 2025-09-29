import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, MessageCircle, ChevronLeft, ChevronRight, GraduationCap, Star } from 'lucide-react';
import { mockUsers } from '../data/mockUsers';
import bgImage from "/images/login.jpeg";


const DiscoverPage: React.FC = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  // Use motion values instead of per-frame state updates to avoid lag
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [lastSwipeDirection, setLastSwipeDirection] = useState<1 | -1 | 0>(0);
  const [photoLoading, setPhotoLoading] = useState(true);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [0, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -120], [0, 1]);
  // const absX = useTransform(x, (v) => Math.abs(v));
  
  // Touch swipe states for photo navigation (removed; using full-card drag)




  const currentUser = mockUsers[currentUserIndex];
  const nextUser = useMemo(() => mockUsers[(currentUserIndex + 1) % mockUsers.length], [currentUserIndex]);
  useEffect(() => {
    const img = new Image();
    img.src = nextUser.photos[0];
  }, [nextUser]);
  // const nextUser = useMemo(() => mockUsers[(currentUserIndex + 1) % mockUsers.length], [currentUserIndex]);

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
            { label: 'Looking For', value: currentUser.lookingFor?.join(', ') },
            { label: 'Interests', value: currentUser.interests.join(', ') }
          ]
        };
      default:
        return { title: '', details: [] };
    } 
  };

  const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };
  
  const nextPhoto = () => {
    setPhotoLoading(true);
    setCurrentPhotoIndex((prev) => {
      const nextIndex = (prev + 1) % 3;
      preloadImage(currentUser.photos[(nextIndex + 1) % 3]); // preload next-next
      return nextIndex;
    });
  };
  
  const prevPhoto = () => {
    setPhotoLoading(true);
    setCurrentPhotoIndex((prev) => {
      const nextIndex = (prev - 1 + 3) % 3;
      preloadImage(currentUser.photos[(nextIndex - 1 + 3) % 3]); // preload prev-prev
      return nextIndex;
    });
  };
  

  // Touch swipe functions for photo navigation
  // const minSwipeDistance = 50;

  // Legacy photo navigation touch handlers removed from the image area
  const handleAction = (action: 'like' | 'dislike' | 'dm') => {
    if (swipeCount >= 15 && action !== 'dm') {
      setShowLimitModal(true);
      return;
    }
    
    if (action !== 'dm') {
      setSwipeCount(prev => prev + 1);
    }

   
      setCurrentUserIndex((prev) => (prev + 1) % mockUsers.length);
      setCurrentPhotoIndex(0);
  };

  const handleDragEnd = (_event: any, info: PanInfo) => {
    // More forgiving swipe with velocity support
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const offsetThreshold = 60;
    const velocityThreshold = 500;

    if (offset > offsetThreshold || velocity > velocityThreshold) {
      setLastSwipeDirection(1); // right
      handleAction('like');
    } else if (offset < -offsetThreshold || velocity < -velocityThreshold) {
      setLastSwipeDirection(-1); // left
      handleAction('dislike');
    } else {
      setLastSwipeDirection(0);
      x.set(0);
    }
  };

  
  
  

  const photoInfo = getPhotoInfo(currentPhotoIndex);

  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.7,
      rotate: direction > 0 ? 15 : -15,
      y: 50,
      filter: "blur(10px)"
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 0.8
      }
    },
    exit: (direction: number) => ({
      // 🔄 FIX: Flip directions here
      x: direction > 0 ? 500 : -500, // Right swipe goes RIGHT, left swipe goes LEFT
      opacity: 0,
      scale: 0.6,
      rotate: direction > 0 ? 25 : -25,
      y: -100,
      filter: "blur(15px)",
      transition: {
        duration: 0.25,
        ease: "easeInOut"
      }
    })
  };
  

  return (
    <div 
    className="h-screen flex items-center justify-center px-4 pb-16 bg-cover bg-center relative overflow-hidden"
    style={{ backgroundImage: `url(${bgImage})` }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>
    
   {/* Floating Particles */}
<div className="absolute inset-0 pointer-events-none">
  {[...Array(5)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white/20 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -60, 0],
        x: [0, Math.random() * 30 - 15, 0],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: Math.random() * 2 + 2,
        repeat: Infinity,
        delay: Math.random() * 1.5,
        ease: "easeInOut"
      }}
    />
  ))}
</div>

    
      {/* Card Stack Container */}
    <div className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg max-h-[85vh] flex flex-col">
      
      {/* Background Cards Stack Effect */}
{/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
  {mockUsers
    .slice(currentUserIndex + 1, currentUserIndex + 4) // next 3 users as placeholders
    .map((user, index) => {
      const offset = index + 1; // 1, 2, 3
      return (
        <motion.div
          key={user.id}
          className="absolute w-full max-w-sm md:max-w-md lg:max-w-lg h-[520px] rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl"
          style={{ zIndex: -offset }}
          initial={{ y: 30 * offset, scale: 1 - 0.03 * offset, rotate: 2 * offset, opacity: 0.5 }}
          animate={{ y: 30 * offset, scale: 1 - 0.03 * offset, rotate: 2 * offset, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      );
    })}
</div> */}



      {/* Removed next-card preview to avoid lag */}

      {/* Main Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentUserIndex}
          className="relative bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden h-full"
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={lastSwipeDirection}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, willChange: 'transform', zIndex: 1, WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
        >
          
          {/* Photo Section */}
<div 
  className="relative h-[330px] cursor-pointer flex-shrink-0"
  onClick={(e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.photo-nav-btn')) {
      setShowProfileModal(true);
    }
  }}
>
<div className="relative h-[330px] cursor-pointer flex-shrink-0">
<AnimatePresence>
  {photoLoading && (
    <motion.div
      key="loader"
      className="absolute inset-0 flex items-center justify-center bg-black/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    </motion.div>
  )}
</AnimatePresence>

<motion.img
  key={currentPhotoIndex}
  src={currentUser.photos[currentPhotoIndex]}
  alt={`${currentUser.name} - Photo ${currentPhotoIndex + 1}`}
  className={`w-full h-[330px] object-cover ${photoLoading ? 'opacity-0' : 'opacity-100'}`}
  initial={{ opacity: 0, scale: 1.1 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.3 }}
  onLoad={() => setPhotoLoading(false)}
  style={{ willChange: 'transform, opacity', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
/>

</div>

  
  {/* Photo Navigation */}
  <div className="absolute top-4 left-4 right-4 flex justify-between">
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`h-1 w-20 rounded-full ${
            index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
          }`}
          animate={{
            backgroundColor: index === currentPhotoIndex ? '#ffffff' : 'rgba(255,255,255,0.5)'
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
    {/* {currentUser.verified && (
      <motion.div 
        className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        ✓ Verified
      </motion.div>
    )} */}
  </div>

  {/* Prev Button */}
  <motion.button
    onClick={(e) => {
      e.stopPropagation(); // prevent modal open
      prevPhoto();
    }}
    className="photo-nav-btn absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all"
    whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.6)" }}
    whileTap={{ scale: 0.9 }}
  >
    <ChevronLeft size={20} />
  </motion.button>
  
  {/* Next Button */}
  <motion.button
    onClick={(e) => {
      e.stopPropagation(); // prevent modal open
      nextPhoto();
    }}
    className="photo-nav-btn absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all"
    whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.6)" }}
    whileTap={{ scale: 0.9 }}
  >
    <ChevronRight size={20} />
  </motion.button>

  {/* Drag Indicators with icons (kept but tied to motion values) */}
  <motion.div
    className="pointer-events-none absolute inset-0 rounded-3xl flex items-center justify-center"
    style={{ opacity: likeOpacity }}
  >
    <motion.div
      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-full shadow-2xl"
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ repeat: Infinity, duration: 1.2 }}
    >
      <Heart size={42} fill="white" />
    </motion.div>
  </motion.div>
  <motion.div
    className="pointer-events-none absolute inset-0 rounded-3xl flex items-center justify-center"
    style={{ opacity: nopeOpacity }}
  >
    <motion.div
      className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-6 rounded-full shadow-2xl"
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ repeat: Infinity, duration: 1.2 }}
    >
      <X size={42} />
    </motion.div>
  </motion.div>
</div>


      {/* Info Section */}
      {!photoLoading && (
  <motion.div
    key={currentPhotoIndex}
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -30, opacity: 0 }}
    transition={{ duration: 0.35 }}
    className="relative z-20 -mt-5 rounded-b-3xl overflow-y-auto flex-1"
  >
  <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-md p-6">
    {/* Title with Verified Badge */}
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <motion.span
        className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      {photoInfo.title}

      {/* Verified badge inline with title */}
      {currentPhotoIndex === 0 && currentUser.verified && (
        <motion.span 
          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          ✓ Verified
        </motion.span>
      )}
    </h3>

    {/* Details */}
<div className="space-y-4">
  {photoInfo.details.map((item, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
    >
      <span className="block text-white/80 font-semibold mb-1">{item.label}:</span>

      {item.label === 'Interests' ? (
        <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2">
          {currentUser.interests.map((interest: string, index: number) => (
            <span
              key={index}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white text-xs px-3 py-1 rounded-full border border-white/20 shadow-sm hover:scale-105 transition-transform duration-200"
            >
              {interest}
            </span>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 text-white/90 font-medium shadow-sm hover:bg-white/20 transition-colors">
          {item.value}
        </div>
      )}
    </motion.div>
  ))}
</div>

  </div>
</motion.div>
)}






        </motion.div>
      </AnimatePresence>

      {/* Premium Limit Modal */}
       <AnimatePresence>
        {showLimitModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.h3 
                className="text-xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Daily Limit Reached
              </motion.h3>
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                You've reached your daily limit of 15 swipes. Upgrade to Premium for unlimited swipes!
              </motion.p>
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upgrade to Premium
                </motion.button>
                <motion.button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full bg-gray-100 text-gray-600 font-medium py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Tomorrow
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Profile Details Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-3xl p-6 max-w-md w-full max-h-[75vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <img
                    src={currentUser.photos[currentPhotoIndex]}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white/50 shadow-lg"
                  />
                  {currentUser.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                      <Star size={12} />
                    </div>
                  )}
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-white mb-1 drop-shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentUser.name}, {currentUser.age}
                </motion.h2>
                <motion.p 
                  className="text-white/80 text-sm drop-shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentUser.college} • {currentUser.department}
                </motion.p>
              </div>

              {/* Profile Details */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Bio */}
                <div className="mt-[1.2rem]">
  <span className="text-white/80 font-medium drop-shadow-sm block mb-1">Bio:</span>
  <div className="bg-white/10 rounded-lg p-2">
    <p className="text-white drop-shadow-sm">
      Love coding, hiking, and good coffee. Always up for exploring new places around campus!
    </p>
  </div>
</div>
                {/* Academic Info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <GraduationCap size={16} className="mr-2 text-purple-400" />
                    Academic Info
                  </h3>
                  <div className="space-y-2">
                  <div className="flex justify-between mt-[1.2rem]">
  <span className="text-white/80 font-medium drop-shadow-sm">Department:</span>
  <span className="text-white drop-shadow-sm">Computer Science</span>
</div>
<div className="flex justify-between mt-[1.2rem]">
      <span className="text-white/80 font-medium drop-shadow-sm">Year:</span>
      <span className="text-white drop-shadow-sm">{currentUser.year}</span>
    </div>
                  </div>
                </div>

                {/* Relationship & Interests */}
<div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
  <h3 className="text-white font-semibold mb-3 flex items-center">
    <Heart size={16} className="mr-2 text-pink-400" />
    Preferences
  </h3>

  {/* Relationship Status */}
  <div className="flex justify-between items-center mb-3">
    <span className="text-white/80 text-sm font-medium">Status:</span>
    <span className="text-white text-sm font-semibold bg-purple-700/30 px-3 py-1 rounded-full drop-shadow-sm">
      {currentUser.relationshipStatus}
    </span>
  </div>

  {/* Looking For */}
<div className="flex justify-between items-center mb-3">
  <span className="text-white/80 text-sm font-medium">Looking For:</span>
  <span className="text-white text-sm font-semibold bg-purple-700/30 px-3 py-1 rounded-full drop-shadow-sm">
    {currentUser.lookingFor?.join(', ')}
  </span>
</div>

  {/* Interests */}
  <div>
    <span className="text-white/80 text-sm font-medium block mb-2">Interests:</span>
    <div className="flex flex-wrap gap-2">
      {currentUser.interests.map((interest: string, index: number) => (
        <span
          key={index}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white text-xs px-3 py-1 rounded-full border border-white/20 shadow-sm hover:scale-105 transition-transform duration-200"
        >
          {interest}
        </span>
      ))}
    </div>
  </div>
</div>


                
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex space-x-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={() => {
                    setShowProfileModal(false);
                    handleAction('like');
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={16} className="inline mr-2" />
                  Like
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowProfileModal(false);
                    handleAction('dm');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={16} className="inline mr-2" />
                  Message
                </motion.button>
              </motion.div>

              {/* Close Button */}
              <motion.button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default DiscoverPage;