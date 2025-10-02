import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, ChevronLeft, ChevronRight, GraduationCap, MapPin } from 'lucide-react';
import { mockUsers } from '../data/mockUsers';
import bgImage from "/images/login.jpeg";

const DiscoverPage: React.FC = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [exitDirection, setExitDirection] = useState<1 | -1 | 0>(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showNextCard, setShowNextCard] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [0, 20, 100], [0, 0.5, 1]);
const nopeOpacity = useTransform(x, [0, -20, -100], [0, 0.5, 1]);



  const currentUser = mockUsers[currentUserIndex];
  const nextUser = useMemo(() => mockUsers[(currentUserIndex + 1) % mockUsers.length], [currentUserIndex]);
  const upcomingUser = useMemo(() => mockUsers[(currentUserIndex + 2) % mockUsers.length], [currentUserIndex]);

  useEffect(() => {
    const preloadImages = [...nextUser.photos, ...upcomingUser.photos];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.loading = 'eager';
    });
  }, [nextUser, upcomingUser]);

  const toggleLike = (id: string) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev + 1) % currentUser.photos.length);
  }, [currentUser]);

  const prevPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev - 1 + currentUser.photos.length) % currentUser.photos.length);
  }, [currentUser]);

  const handleAction = useCallback((action: 'like' | 'dislike') => {
    setSwipeCount(prev => {
      const newCount = prev + 1;
      if (newCount > 15) {
        setShowLimitModal(true);
        return prev;
      }
  
      setExitDirection(action === 'like' ? 1 : -1);
      setIsSwiping(true);
      setPhotoLoading(false);
      setCurrentPhotoIndex(0);
  
      // Delay showing next card until exit animation completes (0.4s)
      setShowNextCard(false);
      setTimeout(() => setShowNextCard(true), 400);
  
      return newCount;
    });
  }, []);
  const handleDragEnd = useCallback((_event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 100;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0) handleAction('like');
      else handleAction('dislike');
    } else {
      x.set(0);
    }
  }, [handleAction, x]);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>

      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence
          initial={false}
          onExitComplete={() => {
            setCurrentUserIndex((prev) => (prev + 1) % mockUsers.length);
            setExitDirection(0);
            setCurrentPhotoIndex(0);
            setIsSwiping(false);
          }}
        >
          {!isSwiping && (
            <motion.div
              key={currentUser.id}
              className="absolute inset-0 bg-black/20 flex flex-col cursor-grab"
              style={{ x, rotate, willChange: 'transform', zIndex: 3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 250, damping: 25, mass: 0.5 } }}
              exit={{ x: exitDirection * 1200, opacity: 0, rotate: exitDirection * 25, scale: 0.9, transition: { duration: 0.4 } }}
            >
                  {/* Like Overlay (Green Flame + Animated Heart) */}
<motion.div
  className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
  style={{ opacity: likeOpacity , pointerEvents: "none" }}
>
  {/* Animated green flame layers */}
  <motion.div
    className="absolute w-56 h-56 rounded-full bg-green-400/30 blur-2xl"
    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0], opacity: [0.6, 0.4, 0.6] }}
    transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  />
  <motion.div
    className="absolute w-48 h-48 rounded-full bg-green-500/20 blur-xl"
    animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0], opacity: [0.5, 0.3, 0.5] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  />

  {/* Heart icon with scaling and rotation */}
  <motion.div
    animate={{ scale: [1, 1.3, 1.1, 1], rotate: [0, 15, -10, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  >
    <Heart size={100} className="text-green-400 z-10" fill="currentColor" />
  </motion.div>
</motion.div>

{/* Dislike Overlay (Red Flame + Animated X) */}
<motion.div
  className="absolute inset-0 flex z-20 items-center justify-center pointer-events-none"
  style={{ opacity: nopeOpacity }}
>
  {/* Animated red flame layers */}
  <motion.div
    className="absolute w-56 h-56 rounded-full bg-red-400/30 blur-2xl"
    animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0], opacity: [0.6, 0.4, 0.6] }}
    transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  />
  <motion.div
    className="absolute w-48 h-48 rounded-full bg-red-500/20 blur-xl"
    animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0], opacity: [0.5, 0.3, 0.5] }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  />

  {/* X icon with scaling and rotation */}
  <motion.div
    animate={{ scale: [1, 1.3, 1.1, 1], rotate: [0, -15, 10, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
  >
    <X size={100} className="text-red-400 z-10" />
  </motion.div>
</motion.div>


              {/* Fullscreen photo */}
<div className="relative w-full h-[93vh]">
  <img src={currentUser.photos[currentPhotoIndex]} alt={currentUser.name} className="w-full h-full object-cover" />

  {/* Carousel Progress Line */}
  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2/3 h-1 flex items-center justify-between z-20">
    {currentUser.photos.map((_, index) => (
      <div
        key={index}
        className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
          index === currentPhotoIndex
            ? "flex-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-lg"
            : "flex-1 bg-white/20"
        }`}
      />
    ))}
  </div>

  {/* Photo Carousel Buttons */}
  <button
    onClick={prevPhoto}
    className="absolute z-50  left-4 top-10 -translate-y-1/2 bg-black/10 p-2 rounded-full text-white hover:bg-black/30"
  >
    <ChevronLeft size={24} />
  </button>
  <button
    onClick={nextPhoto}
    className="absolute z-50 right-4 top-10 -translate-y-1/2 bg-black/10 p-2 rounded-full text-white hover:bg-black/30"
  >
    <ChevronRight size={24} />
  </button>
</div>


              {/* Info Overlay */}
{!photoLoading && (
  <div 
    className="  absolute pt-2 inset-x-0 bottom-0 pb-32 text-white space-y-3 z-40"
    style={{
      background: 'rgba(0,0,0,0.2)',  // dark translucent overlay
      backdropFilter: 'blur(2px)',
      borderRadius: '2rem',   // stronger blur
    }}
  >
    {currentPhotoIndex === 0 && (
      <>
        <div className="flex justify-between items-center px-6 pt-4">
          <h3 className="text-2xl font-bold">{currentUser.name}, {currentUser.age}</h3>
          {currentUser.verified && <span className="bg-neon-cyan text-black px-2 py-1 text-xs rounded-full">Verified</span>}
          <button onClick={() => toggleLike(String(currentUser.id))} className={`${liked[String(currentUser.id)] ? "text-rose-400" : "text-white/70 hover:text-white"}`}>
            <Heart size={22} fill={liked[String(currentUser.id)] ? "#fb7185" : "none"} />
          </button>
        </div>
        <div className="flex items-center gap-2 px-6">
          <GraduationCap size={16} className="text-cyan-300" />
          <span>{currentUser.department} • {currentUser.year}</span>
        </div>
        <div className="flex items-center gap-2 px-6 pb-4">
          <MapPin size={16} className="text-rose-300" />
          <span>{currentUser.college}</span>
        </div>
      </>
    )}
    {currentPhotoIndex === 1 && (
      <div className="px-6">
        <h3 className="text-2xl font-bold">Bio</h3>
        <div className="text-white/90 font-medium">{currentUser.bio}</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {currentUser.interests.map((i, idx) => (
            <span key={idx} className="bg-neon-blue/30 text-blue-200 text-xs px-2 py-1 rounded-full">{i}</span>
          ))}
        </div>
      </div>
    )}
    {currentPhotoIndex === 2 && (
      <div className="px-6">
        <h3 className="text-2xl font-bold">Preferences</h3>
        <div className="mt-2"><strong>Looking For:</strong> {currentUser.lookingFor.join(", ")}</div>
        <div className="mt-1"><strong>Relationship Status:</strong> {currentUser.relationshipStatus}</div>
      </div>
    )}

    {/* Action buttons */}
<div className="flex justify-center gap-6 mt-6 mb-safe-area z-50 relative px-6">
  {/* Dislike */}
  <motion.button
    onClick={() => handleAction("dislike")}
    className="relative flex items-center justify-center rounded-full w-20 h-20"
  >
    {/* Glassy blurred circle */}
    <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl"></span>
    <X size={40} className="text-red-500 drop-shadow-lg z-10" />
  </motion.button>

  {/* Profile */}
  <motion.button
    onClick={() => alert("Open Profile Details")}
    className="relative flex  items-center justify-center rounded-full w-16 h-16"
  >
    <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl"></span>
    <span className="text-white text-3xl drop-shadow-lg z-10">👤</span>
  </motion.button>

  {/* Like */}
  <motion.button
    onClick={() => handleAction("like")}
    className="relative flex items-center justify-center rounded-full w-20 h-20"
  >
    <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl"></span>
    <Heart size={40} className="text-green-400 drop-shadow-lg z-10" fill="currentColor" />
  </motion.button>
</div>

  </div>
)}

            </motion.div>
          )}

{showNextCard && (
  <motion.div 
    key={nextUser.id} 
    className="absolute inset-0" 
    initial={{ scale: 0.9, opacity: 0.7 }} 
    animate={{ scale: 0.95, opacity: 0.85 }} 
    transition={{ duration: 0.3 }} 
    style={{ zIndex: 2 }}
  >
    <img src={nextUser.photos[0]} alt={nextUser.name} className="w-full h-full object-cover blur-sm" />
  </motion.div>
)}
        </AnimatePresence>
      </div>

      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Heart size={40} className="text-white" fill="white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Daily Limit Reached</h3>
            <p className="text-white/80 mb-8">You've swiped through 15 profiles today! Come back tomorrow to discover more amazing people. ✨</p>
            <button onClick={() => setShowLimitModal(false)} className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95">Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
