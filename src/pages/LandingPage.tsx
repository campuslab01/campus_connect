import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Heart, Users, MessageCircle, Shield, ArrowRight } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import landingScreenOne from "/images/landingDate.jpeg";
import landingScreenTwo from "/images/screenone.jpeg";
import landingScreenThree from "/images/screentwo.jpeg";
import landingScreenFour from "/images/screenthree.jpeg";


interface LandingPageProps {
  onGetStarted: () => void;
}



const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [screen3Triggered, setScreen3Triggered] = useState(false);

  // Debug function to reset app state
  const resetAppState = () => {
    localStorage.removeItem('hasLaunchedBefore');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    window.location.reload();
  };

  const goToNextSlide = (slideIndex: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(slideIndex, 1200); // 1200ms smooth transition

   }
  };
  
  

  const featureThree = [
    {
      icon: Heart,
      title: "Matchmaking ",
      description:
        "Find new date in your campus facilitates opportunities for students to meet and connect within their campus community through organized events or platforms, promoting meaningful and safe social interactions."
    }
  ];
  

  const featuresTwo = [
    {
      icon: Users,
      title: "Anonymous Confessions",
      description:
        "Share your deepest thoughts anonymously and discover others with similar experiences. Build connections through vulnerability and authenticity",
    },
    {
      icon: Heart,
      title: "Smart Matchings ",
      description:
        "AI-powered matching connects you with compatible students from your college and nearby campuses based on interests, academic goals, and personality",
  }
    
  ];

 const features = [
    {
      icon: MessageCircle,
      title: " Find Friend",
      description:
"Connect with new friends, like-minded people, and potential co-founders on your campus."    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description:
        "Mandatory college email verification and optional photo verification ensure you're connecting with real students, not fake profiles",
    },
  ];

 const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "tween", duration: 0.4, ease: "easeOut" },
    },
};

  const itemNoTranslateVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "linear" }, // NO y movement, NO easeOut
  },
};


  const floatingVariants = {
    animate: {
      y: [-8, 8, -8],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
 },
  };

  const ScreenWrapper: React.FC<{
    bg: string;
    children: React.ReactNode;
    scrollable?: boolean;
    index?: number;
  }> = ({ bg, children, scrollable, index }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scrollable && activeIndex === index) {
        if (index === 2 && !screen3Triggered) {
          setScreen3Triggered(true);
        }

        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let start: number | null = null;
        const duration = 5000;

        const animateScroll = (timestamp: number) => {
          if (start === null) start = timestamp;
          const progress = (timestamp - start) / duration;
          scrollContainer.scrollTop =
            progress *
            (scrollContainer.scrollHeight - scrollContainer.clientHeight);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            swiperRef.current?.slideNext();
          }
        };

        scrollContainer.scrollTop = 0;
        requestAnimationFrame(animateScroll);
      } else {
        if (index === 2) {
          setScreen3Triggered(false);
        }
      }
    }, [scrollable, index]);

    return (
      <div className="relative w-full min-h-screen flex flex-col" style={{ willChange: 'transform', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${bg})`,
            willChange: 'transform',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)'
          }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
        <div
          ref={scrollRef}
          className={`relative z-10 w-full flex flex-col ${
            scrollable ? "overflow-y-auto h-screen" : "h-screen"
          }`}
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="min-h-screen overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Debug Button - Only show in development */}
      {import.meta.env.DEV && (
        <button
          onClick={resetAppState}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-1 rounded text-xs
                   hover:bg-red-600 transition-colors"
          title="Reset App State (Dev Only)"
        >
          Reset App
        </button>
      )}
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        slidesPerView={1}
        speed={800}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Pagination, Navigation]}
        style={{ minHeight: "100vh" }}
        className="relative group"
        allowTouchMove={false}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        watchOverflow={true}
        resistance={true}
        resistanceRatio={0}
      >
        {/* Navigation Buttons */}
        <div className="swiper-button-next absolute right-8 top-1/2 -translate-y-1/2 z-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div
            className="p-4 rounded-full flex items-center justify-center 
               bg-black/40 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 
               hover:shadow-lg hover:scale-110 transition-all duration-300"
          >
            <ArrowRight size={15} className="text-white" />
          </div>
        </div>

        <div className="swiper-button-prev absolute left-8 top-1/2 -translate-y-1/2 z-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div
            className="p-4 rounded-full flex items-center justify-center 
               bg-black/40 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 
               hover:shadow-lg hover:scale-110 transition-all duration-300 rotate-180"
          >
            <ArrowRight size={15} className="text-white" />
          </div>
        </div>

        {/* Screen 1: Hero */}
        <SwiperSlide>
          <ScreenWrapper bg={landingScreenOne}>
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
              <motion.div className="text-center" variants={itemVariants}>
                <motion.div
                  className="flex justify-center items-center mb-2"
                  variants={floatingVariants}
                  animate="animate"
                >
                <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-4 shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </motion.div>
                </motion.div>
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 leading-tight"
                  variants={itemVariants}
                >
                  Campus
                  <motion.span
                    className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
               animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {" "}
                    Connection
                  </motion.span>
                </motion.h1>

                {/* Typing animation */}
                <TypeAnimation
                  sequence={[
                    "Make new friends",
                    1500,
                    "Explore your campus",
                    2000,
                    "Find your date",
                    2500,
                    "Find your business partner",
                    3000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  className="block text-center mb-3
             text-xl sm:text-2xl md:text-2xl lg:text-2sxl
             font-extrabold tracking-wide
             text-white"
                />
                <motion.p
                  className="text-center 
             text-sm sm:text-base md:text-lg lg:text-xl 
             leading-relaxed sm:leading-loose 
             text-white/90 font-medium tracking-wide 
             mb-8 max-w-3xl mx-auto px-4"
                  variants={itemVariants}
               >
                  More than just dating – Find friends, partners, and even your
                  future co-founder. A space where college connections turn into
                  lifelong bonds.
                </motion.p>

                <motion.button
  onClick={() => goToNextSlide(1)} // Navigate from Screen 1 to Screen 2
  className="bg-white text-purple-600 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
>
  Get Started
  <motion.div
    animate={{ x: [0, 5, 0] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <ArrowRight size={20} />
  </motion.div>
</motion.button>


              </motion.div>
           </div>
          </ScreenWrapper>
        </SwiperSlide>

        {/* Screen 2: Features Grid */}
        <SwiperSlide>
          <ScreenWrapper bg={landingScreenTwo}>
            <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
              <motion.div
                className="w-full flex justify-center"
                variants={containerVariants}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
 className="relative bg-white/20 backdrop-blur-sm border border-white/20 
             rounded-2xl p-6 text-white shadow-2xl 
             hover:scale-105 transition-transform duration-300 cursor-pointer w-full max-w-xs"
                      variants={itemNoTranslateVariants}
                      style={{ transform: 'none', willChange: 'auto' }}
                    >
                      {/* Icon */}
                      <div className="bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full p-4 w-fit mx-auto mb-4 shadow-lg">
                        <motion.div
                          animate={{ rotate: [-15, 15, -15] }} // swing like pendulum
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{ transformOrigin: "bottom center" }} // pivot point
                        >
                          <feature.icon className="h-6 w-6 text-white" />
                        </motion.div>
                      </div>

                      {/* Title */}
                      <motion.h3
                        className="text-xl font-extrabold mb-3 text-center
             bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
             bg-clip-text text-transparent tracking-wide drop-shadow-sm"
                        variants={itemNoTranslateVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.title}
                      </motion.h3>

                      {/* Description */}
                      <p className="text-white/80 text-sm sm:text-base text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </ScreenWrapper>
        </SwiperSlide>
       {/* Screen 3: Features Grid Two */}
        <SwiperSlide>
          <ScreenWrapper bg={landingScreenThree}>
            <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
             <motion.div
                className="w-full flex justify-center"
                variants={containerVariants}
             >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
                  {featuresTwo.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="relative bg-white/20 backdrop-blur-sm border border-white/20 
             rounded-2xl p-6 text-white shadow-2xl 
             hover:scale-105 transition-transform duration-300 cursor-pointer w-full max-w-xs"
                      variants={itemNoTranslateVariants}
                       style={{ transform: 'none', willChange: 'auto' }}
                    >
                      {/* Icon */}
                      <div className="bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full p-4 w-fit mx-auto mb-4 shadow-lg">
                        <motion.div
                          animate={{ rotate: [-15, 15, -15] }} // pendulum swing
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{ transformOrigin: "bottom center" }}
                        >
                          <feature.icon className="h-6 w-6 text-white" />
                        </motion.div>
                      </div>

                      {/* Title */}
                      <motion.h3
                        className="text-xl font-extrabold mb-3 text-center
                           bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
                           bg-clip-text text-transparent tracking-wide drop-shadow-sm"
                        variants={itemNoTranslateVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.title}
                      </motion.h3>

                      {/* Description */}
                      <p className="text-white/80 text-sm sm:text-base text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </ScreenWrapper>
        </SwiperSlide>

 {/* Screen 4: Feature Three */}
<SwiperSlide>
  <ScreenWrapper bg={landingScreenFour}>
    <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
      <motion.div className="w-full flex justify-center" variants={containerVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-8 justify-items-center max-w-md w-full mx-auto">
          {featureThree.map((feature, index) => (
            <motion.div
              key={index}
              className="relative bg-white/20 backdrop-blur-sm border border-white/20 
             rounded-2xl p-6 text-white shadow-2xl 
             hover:scale-105 transition-transform duration-300 cursor-pointer w-full max-w-xs"
              variants={itemNoTranslateVariants}
              style={{ transform: 'none', willChange: 'auto' }}
            >
              {/* Icon - now matches Screen 3 */}
              <div className="bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full p-4 w-fit mx-auto mb-4 shadow-lg">
                <motion.div
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "bottom center" }}
           >
                  <feature.icon className="h-6 w-6 text-white" />
               </motion.div>
              </div>
           {/* Title */}
              <motion.h3
                className="text-xl font-extrabold mb-3 text-center
                           bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
                           bg-clip-text text-transparent tracking-wide drop-shadow-sm"
                variants={itemNoTranslateVariants}
                whileHover={{ scale: 1.05 }}
              >
                {feature.title}
                </motion.h3>
            {/* Description */}
              <p className="text-white/100 text-sm sm:text-base text-center leading-relaxed">
                {feature.description}
              </p>
          </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </ScreenWrapper>
</SwiperSlide>



        {/* Screen 5: CTA */}
        <SwiperSlide>
          <ScreenWrapper bg={landingScreenFour}>
            <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center text-center">
              <motion.h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Find Your Connection?
              </motion.h2>
              <motion.p
  className="text-white/80 mb-8 
             text-sm sm:text-base md:text-lg lg:text-xl 
             leading-relaxed sm:leading-loose 
             max-w-2xl mx-auto px-6
             relative z-30"
>
  Turn your college life from boring to exciting – Discover new connections,
  opportunities, and experiences with Campus Connection.
</motion.p>

              <motion.button
  onClick={onGetStarted}
  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full text-base sm:text-lg shadow-xl mb-8"
  initial={{ scale: 1 }}
  animate={{
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 10px rgba(255, 165, 0, 0.4)",
      "0 0 20px rgba(255, 165, 0, 0.6)",
      "0 0 10px rgba(255, 165, 0, 0.4)",
    ],
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  Start Connecting Today
</motion.button>

            {/* Footer Links */}
            <div className="flex flex-col items-center gap-4 relative z-30">
                <p className="text-white/60 text-sm font-semibold tracking-wider">
                  STRICTLY 18+ • VERIFIED STUDENTS ONLY
                </p>
                <div className="flex gap-6 text-white/70 text-xs sm:text-sm">
                  <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                  <a href="/rules" className="hover:text-white transition-colors">Rules</a>
                  <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                </div>
                <p className="text-white/40 text-[10px] mt-2">
                  &copy; {new Date().getFullYear()} Campus Connection. All rights reserved.
                </p>
            </div>

            </div>
          </ScreenWrapper>
        </SwiperSlide>
      </Swiper>
    </motion.div>
);
};

export default LandingPage;
