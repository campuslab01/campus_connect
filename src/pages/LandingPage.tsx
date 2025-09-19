import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Heart, Users, MessageCircle, Shield, ArrowRight } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import landingDateImage from '/images/landingDate.jpeg';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [screen3Triggered, setScreen3Triggered] = useState(false); // New flag

  const features = [
    { icon: Heart, title: 'Smart Matching', description: 'AI-powered matching connects you with compatible students from your college and nearby campuses based on interests, academic goals, and personality' },
    { icon: Users, title: 'Anonymous Confessions', description: 'Share your deepest thoughts anonymously and discover others with similar experiences. Build connections through vulnerability and authenticity' },
    { icon: MessageCircle, title: 'Secure Chat', description: 'End-to-end encrypted messaging with built-in compatibility quizzes that unlock after meaningful conversations to ensure genuine connections' },
    { icon: Shield, title: 'Verified Profiles', description: 'Mandatory college email verification and optional photo verification ensure you\'re connecting with real students, not fake profiles' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const ScreenWrapper: React.FC<{ bg: string; children: React.ReactNode; scrollable?: boolean; index?: number }> = ({ bg, children, scrollable, index }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Only trigger if scrollable and activeIndex matches AND not already triggered (prevents running on init)
      if (scrollable && activeIndex === index) {
        // Reset trigger flag if returning to this screen
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
          scrollContainer.scrollTop = progress * (scrollContainer.scrollHeight - scrollContainer.clientHeight);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            swiperRef.current?.slideNext();
          }
        };

        scrollContainer.scrollTop = 0;
        requestAnimationFrame(animateScroll);
      } else {
        // Reset Screen 3 trigger if leaving the screen
        if (index === 2) {
          setScreen3Triggered(false);
        }
      }
    }, [activeIndex, scrollable, index]);

    return (
      <div className="relative w-full min-h-screen flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        <div
          ref={scrollRef}
          className={`relative z-10 w-full flex flex-col ${scrollable ? 'overflow-y-auto max-h-screen' : ''}`}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <motion.div className="min-h-screen overflow-x-hidden" initial="hidden" animate="visible" variants={containerVariants}>
      <Swiper
        ref={swiperRef}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[Pagination, Navigation, Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        style={{ minHeight: "100vh" }}
        className="relative group"
        onTouchStart={() => swiperRef.current?.autoplay.stop()}
        onTouchEnd={() => swiperRef.current?.autoplay.start()}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {/* Navigation Buttons */}
        <div className="swiper-button-next absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            onMouseEnter={() => swiperRef.current?.autoplay.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay.start()}
            className="p-3 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 hover:shadow-lg hover:scale-110 transition-all duration-300"
          >
            <ArrowRight size={10} className="text-white" />
          </div>
        </div>
        <div className="swiper-button-prev absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            onMouseEnter={() => swiperRef.current?.autoplay.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay.start()}
            className="p-3 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-400 hover:shadow-lg hover:scale-110 transition-all duration-300 rotate-180"
          >
            <ArrowRight size={10} className="text-white" />
          </div>
        </div>

        {/* Screen 1: Hero */}
        <SwiperSlide>
          <ScreenWrapper bg={landingDateImage}>
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
              <motion.div className="text-center" variants={itemVariants}>
                <motion.div className="flex justify-center items-center mb-6" variants={floatingVariants} animate="animate">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-4 shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </motion.div>
                </motion.div>
                <motion.h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" variants={itemVariants}>
                  Campus
                  <motion.span
                    className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {' '}Connection
                  </motion.span>
                </motion.h1>
                <TypeAnimation
                  sequence={['Make new friends', 1000, 'Explore your campus', 2000]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  className="block text-lg sm:text-xl md:text-2xl text-white"
                />
                <motion.p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto px-2" variants={itemVariants}>
                  The premier dating platform for college students. Discover, connect, and build meaningful relationships with fellow students.
                </motion.p>
                <motion.button
  onClick={() => swiperRef.current?.slideNext()}
  className="bg-white text-purple-600 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
  variants={itemVariants}
>
  Get Started
  <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
    <ArrowRight size={20} />
  </motion.div>
</motion.button>

              </motion.div>
            </div>
          </ScreenWrapper>
        </SwiperSlide>

        {/* Screen 2: Features (Scrollable) */}
        <SwiperSlide>
          <ScreenWrapper bg={landingDateImage} scrollable>
            <div className="container mx-auto px-4 py-12">
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" variants={containerVariants}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6 rounded-3xl text-white shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    variants={itemVariants}
                  >
                    <motion.div className="bg-gradient-to-tr from-yellow-400 to-red-400 rounded-full p-4 w-fit mx-auto mb-4 shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.h3 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</motion.h3>
                    <p className="text-white/90 text-sm sm:text-base">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl p-8 shadow-2xl text-white" variants={itemVariants}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold mb-2">10K+</div>
                    <div className="text-white/80 text-sm sm:text-base">Active Students</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
                    <div className="text-white/80 text-sm sm:text-base">Partner Colleges</div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold mb-2">50K+</div>
                    <div className="text-white/80 text-sm sm:text-base">Successful Matches</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScreenWrapper>
        </SwiperSlide>

        {/* Screen 3: Testimonials */}
        <SwiperSlide>
          <ScreenWrapper bg={landingDateImage} >
            <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
              <motion.div className="text-center w-full" variants={itemVariants}>
                <motion.h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">What Students Say</motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[{ text: `"Campus Connection helped me find my perfect study partner who became my best friend!"`, name: "Sarah, NYU" },
                    { text: `"The verification system makes me feel safe. Great platform for genuine connections."`, name: "Mike, Stanford" }].map((testimonial, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-3xl shadow-xl text-white hover:scale-105 transition-transform duration-300"
                      variants={itemVariants}
                    >
                      <p className="text-white/90 mb-4 italic">{testimonial.text}</p>
                      <p className="font-semibold">{testimonial.name}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </ScreenWrapper>
        </SwiperSlide>

        {/* Screen 4: CTA */}
        <SwiperSlide>
          <ScreenWrapper bg={landingDateImage}>
            <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center text-center">
              <motion.h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Find Your Connection?</motion.h2>
              <motion.p className="text-white/80 mb-8 text-sm sm:text-base">Join thousands of students finding meaningful relationships</motion.p>
              <motion.button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                variants={itemVariants}
              >
                Start Connecting Today
              </motion.button>
            </div>
          </ScreenWrapper>
        </SwiperSlide>
      </Swiper>
    </motion.div>
  );
};

export default LandingPage;
