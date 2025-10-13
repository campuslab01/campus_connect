// DiscoverPage.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  GraduationCap,
  MapPin,
  Star,
  Sparkles
} from "lucide-react";
import { User, mockUsers } from "../data/mockUsers";
import bgImage from "/images/login.jpeg";
import { useNavigate } from "react-router-dom";



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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
  const navigate = useNavigate();
  // 
  const [showProfileModal, setShowProfileModal] = useState(false);

  const openChat = (userId: number) => {
    navigate("/chat", { state: { userId } });
  };


  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [0, 20, 100], [0, 0.5, 1]);
  const nopeOpacity = useTransform(x, [0, -20, -100], [0, 0.5, 1]);

  const currentUser = mockUsers[currentUserIndex];
  const nextUser = useMemo(
    () => mockUsers[(currentUserIndex + 1) % mockUsers.length],
    [currentUserIndex]
  );
  const upcomingUser = useMemo(
    () => mockUsers[(currentUserIndex + 2) % mockUsers.length],
    [currentUserIndex]
  );

  useEffect(() => {
    const preloadImages = [...nextUser.photos, ...upcomingUser.photos];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.loading = "eager";
    });
  }, [nextUser, upcomingUser]);

  const toggleLike = (id: string) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev + 1) % currentUser.photos.length);
  }, [currentUser]);

  const prevPhoto = useCallback(() => {
    setCurrentPhotoIndex(
      (prev) =>
        (prev - 1 + currentUser.photos.length) % currentUser.photos.length
    );
  }, [currentUser]);

  const handleAction = useCallback((action: "like" | "dislike") => {
    setSwipeCount((prev) => {
      const newCount = prev + 1;
      if (newCount > 15) {
        setShowLimitModal(true);
        return prev;
      }

      setExitDirection(action === "like" ? 1 : -1);
      setIsSwiping(true);
      setPhotoLoading(false);
      setCurrentPhotoIndex(0);

      // Delay showing next card until exit animation completes (0.4s)
      setShowNextCard(false);
      setTimeout(() => setShowNextCard(true), 400);

      return newCount;
    });
  }, []);
  const handleDragEnd = useCallback(
    (_event: any, info: PanInfo) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;
      const threshold = 100;

      if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
        if (offset > 0) handleAction("like");
        else handleAction("dislike");
      } else {
        x.set(0);
      }
    },
    [handleAction, x]
  );

  return (
    <>
    
    {/* Header Section */}
    <header className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 py-3 px-5">
  <div className="flex items-center justify-left">
    <motion.h1
      className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
      bg-clip-text text-transparent drop-shadow-md"
      style={{
        fontFamily: "'Billabong W00 Regular', sans-serif",
        letterSpacing: '1px',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      Campus Connection
    </motion.h1>
  </div>
</header>

<div
  className="relative w-full h-screen overflow-hidden bg-cover bg-center pt-[3.2rem]"
  style={{ backgroundImage: `url(${bgImage})` }}
>

      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1.3px]"></div>

      <div
  className="relative w-full" // add padding top & bottom
  style={{ height: "calc(100vh - 110px)", overflow: "hidden" }} // subtract header + nav
>

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
              style={{ x, rotate, willChange: "transform", zIndex: 3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                  mass: 0.5,
                },
              }}
              exit={{
                x: exitDirection * 1200,
                opacity: 0,
                rotate: exitDirection * 25,
                scale: 0.9,
                transition: { duration: 0.4 },
              }}
            >
              {/* Like Overlay (Green Flame + Animated Heart) */}
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                style={{ opacity: likeOpacity, pointerEvents: "none" }}
              >
                {/* Animated green flame layers */}
                <motion.div
                  className="absolute w-56 h-56 rounded-full bg-green-400/30 blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.6, 0.4, 0.6],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute w-48 h-48 rounded-full bg-green-500/20 blur-xl"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, -8, 8, 0],
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />

                {/* Heart icon with scaling and rotation */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1.1, 1], rotate: [0, 15, -10, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                >
                  <Heart
                    size={100}
                    className="text-green-400 z-10"
                    fill="currentColor"
                  />
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
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0],
                    opacity: [0.6, 0.4, 0.6],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute w-48 h-48 rounded-full bg-red-500/20 blur-xl"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0],
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />

                {/* X icon with scaling and rotation */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1.1, 1], rotate: [0, -15, 10, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                >
                  <X size={100} className="text-red-400 z-10" />
                </motion.div>
              </motion.div>

              {/* Fullscreen photo */}
              <div className="relative w-full h-[70vh]" style={{ borderRadius:'30%'}}>
                <img
                  src={currentUser.photos[currentPhotoIndex]}
                  alt={currentUser.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    console.log("Opening profile modal for:", currentUser.name);
                    setShowProfileModal(true);
                  }}
                />

                {/* Carousel Progress Line */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2/3 h-1 flex items-center justify-between z-20">
                  {currentUser.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                        index === currentPhotoIndex
                          ? "flex-1 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                          : "flex-1 bg-white/20"
                      }`}
                    />
                  ))}
                </div>

                {/* Photo Carousel Buttons */}
                <button
                  onClick={prevPhoto}
                  className="absolute z-50  left-4 top-1/2 -translate-y-1/2 bg-black/10 p-2 rounded-full text-white hover:bg-black/30"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute z-50 right-4 top-1/2 -translate-y-1/2 bg-black/10 p-2 rounded-full text-white hover:bg-black/30"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Info Overlay */}
              {!photoLoading && (
                <div
                className="absolute inset-x-0 bottom-0 z-40 flex flex-col justify-end pb-[calc(3rem+env(safe-area-inset-bottom))]"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)",
                  backdropFilter: "blur(12px)",
                  borderTopLeftRadius: "2rem",
                  borderTopRightRadius: "2rem",
                  maxHeight: "45vh",
                }}
              >
              
                  <div className="px-6 pt-5 space-y-3 text-white">
                    {currentPhotoIndex === 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-bold">
                            {currentUser.name}, {currentUser.age}
                          </h3>
                          {currentUser.verified && (
                            <span className="bg-neon-cyan text-black px-2 py-1 text-xs rounded-full">
                              Verified
                            </span>
                          )}
                          <button
                            onClick={() => toggleLike(String(currentUser.id))}
                            className={`${
                              liked[String(currentUser.id)]
                                ? "text-rose-400"
                                : "text-white/70 hover:text-white"
                            }`}
                          >
                            <Heart
                              size={22}
                              fill={
                                liked[String(currentUser.id)]
                                  ? "#fb7185"
                                  : "none"
                              }
                            />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={16} className="text-cyan-300" />
                          <span>
                            {currentUser.department} • {currentUser.year}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pb-4">
                          <MapPin size={16} className="text-rose-300" />
                          <span>{currentUser.college}</span>
                        </div>
                      </>
                    )}

                    {currentPhotoIndex === 1 && (
                      <div>
                        <h3 className="text-2xl font-bold">Bio</h3>
                        <p className="text-white/90 font-medium">
                          {currentUser.bio}
                        </p>
                        <div className="flex flex-nowrap gap-2 mt-2">
                          {currentUser.interests.map((i, idx) => (
                            <span
                              key={idx}
                              className="bg-neon-blue/30 text-blue-200 text-xs px-2 py-1 rounded-full"
                            >
                              {i}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentPhotoIndex === 2 && (
                      <div>
                        <h3 className="text-2xl font-bold">Preferences</h3>
                        <div className="mt-2">
                          <strong>Looking For:</strong>{" "}
                          {currentUser.lookingFor.join(", ")}
                        </div>
                        <div className="mt-1">
                          <strong>Relationship Status:</strong>{" "}
                          {currentUser.relationshipStatus}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
<div className="flex justify-center gap-6 mt-4 relative">
  <motion.button
    onClick={() => handleAction("dislike")}
    className="relative flex items-center justify-center rounded-full w-[clamp(3rem,10vw,5rem)] h-[clamp(3rem,10vw,5rem)]"
  >
    <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl"></span>
    <X
      size={40}
      className="text-red-500 drop-shadow-lg z-10"
      style={{ width: "clamp(1.5rem,6vw,2.5rem)", height: "clamp(1.5rem,6vw,2.5rem)" }}
    />
  </motion.button>

  {/* Chat button */}
  <motion.button
  onClick={() => openChat(currentUser.id)}
  className="relative flex items-center justify-center rounded-full w-[clamp(2.5rem,8vw,4rem)] h-[clamp(2.5rem,8vw,4rem)]"
>
  <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl"></span>
  <span className="text-white drop-shadow-lg z-10 text-[clamp(1rem,5vw,1.5rem)]">💬</span>

  {/* Label outside and centered below */}
  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-sm font-semibold text-white drop-shadow-lg">
    DM
  </span>
</motion.button>


  <motion.button
    onClick={() => handleAction("like")}
    className="relative flex items-center justify-center rounded-full w-[clamp(3rem,10vw,5rem)] h-[clamp(3rem,10vw,5rem)]"
  >
    <span className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-2xl"></span>
    <Heart
      size={40}
      className="text-green-400 drop-shadow-lg z-10"
      fill="currentColor"
      style={{ width: "clamp(1.5rem,6vw,2.5rem)", height: "clamp(1.5rem,6vw,2.5rem)" }}
    />
  </motion.button>
</div>

                  </div>
                </div>
              )}
            </motion.div>
          )}

{showNextCard && (
  <motion.div
    key={nextUser.id}
    className="absolute inset-0 flex items-center justify-center"
    initial={{ scale: 0.9, opacity: 0.7 }}
    animate={{ scale: 0.95, opacity: 0.85 }}
    transition={{ duration: 0.3 }}
    style={{ zIndex: 2 }}
  >
    <div className="w-full h-[80vh] rounded-2xl overflow-hidden relative">
      {/* Next User Photo */}
      <img
        src={nextUser.photos[0]}
        alt={nextUser.name}
        className="w-full h-full object-cover blur-sm"
      />

      {/* Placeholder Info Overlay */}
      <div
        className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl"
      >
        <div className="space-y-1">
          <h3 className="text-white text-lg font-bold">
            {nextUser.name}, {nextUser.age}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <GraduationCap size={14} />
            <span>{nextUser.department} • {nextUser.year}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin size={14} />
            <span>{nextUser.college}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)}

        </AnimatePresence>
      </div>

      {/* New */}
       {/* Profile Details Modal */}
       <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div 
  className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-3xl p-6 w-full max-w-md max-h-[85vh] sm:max-h-[80vh] overflow-y-auto overflow-x-hidden relative"
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
                    className="w-full h-full rounded-full object-cover border-2 border-pink-400 shadow-lg"
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
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mt-[1.2rem]">
  <h3 className="text-white font-semibold mb-3 flex items-center">
    <Sparkles size={16} className="mr-2 text-pink-400" />
    Bio
  </h3>
  <div className="text-white/80 drop-shadow-sm leading-relaxed">
    Love coding, hiking, and good coffee. Always up for exploring new places around campus!
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
  <span className="text-white drop-shadow-sm">{currentUser.department}</span>
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
  <div className="space-y-2">
                  <div className="flex justify-between mt-[1.2rem]">
  <span className="text-white/80 font-medium drop-shadow-sm">Looking For:</span>
  <span className="text-white drop-shadow-sm">{currentUser.lookingFor}</span>
</div>
<div className="space-y-2">
                  <div className="flex justify-between mt-[1.2rem]">
  <span className="text-white/80 font-medium drop-shadow-sm">RelationShip Status:</span>
  <span className="text-white drop-shadow-sm">{currentUser.relationshipStatus}</span>
</div>
</div>
</div>
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

      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Heart size={40} className="text-white" fill="white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">
              Daily Limit Reached
            </h3>
            <p className="text-white/80 mb-8">
              You've swiped through 15 profiles today! Come back tomorrow to
              discover more amazing people. ✨
            </p>
            <button
              onClick={() => setShowLimitModal(false)}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
    </>

  );
};

export default DiscoverPage;
