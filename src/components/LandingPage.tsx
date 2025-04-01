import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from './Navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LandingPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation states for story text
  const [storyVisible, setStoryVisible] = useState(false);
  
  // Parallax scroll effect with enhanced values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end start"]
  });
  
  // Transform values for more dramatic parallax zoom effects
  const foregroundScale = useTransform(scrollYProgress, [0, 0.3], [1, 2.5]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.8]);
  
  // Transform values for text opacity transitions - adjusted for better visibility
  const welcomeTextOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const storyTextOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
  
  // Scroll lock transform - prevents actual page scrolling until threshold
  const scrollLockY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.3, 0.5, 1],
    ["0vh", "0vh", "-20vh", "-100vh", "-200vh"]
  );
  
  // Content section visibility
  const contentOpacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  
  // Update story visibility based on scroll position
  useEffect(() => {
    const unsubscribe = storyTextOpacity.onChange(value => {
      setStoryVisible(value > 0.5);
    });
    
    return () => unsubscribe();
  }, [storyTextOpacity]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen bg-dark text-light overflow-hidden"
    >
      {/* Fixed height container to track scroll position */}
      <div className="w-full h-[300vh]">
        {/* Main Container with scroll lock */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-screen"
          style={{ 
            y: scrollLockY
          }}
        >
          {/* Background Image - Different for Mobile vs Desktop */}
          <motion.div className="absolute inset-0 z-0">
            <motion.img 
              src={isMobile ? `${process.env.PUBLIC_URL}/images/background.png` : `${process.env.PUBLIC_URL}/images/background-large.jpg`}
              alt="Wedding Background" 
              className="w-full h-full object-cover bg-image"
              style={{ 
                scale: backgroundScale,
                transformOrigin: "center center"
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
              }}
            />
          </motion.div>
          
          {/* Foreground Image with Enhanced Parallax Zoom Effect */}
          <motion.div 
            className="absolute inset-0 z-10 overflow-hidden"
            style={{ 
              scale: foregroundScale,
              originY: 0.5
            }}
          >
            <img 
              src={`${process.env.PUBLIC_URL}/images/foreground.png`}
              alt="Foreground" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // If foreground image fails to load, make this div transparent
                e.currentTarget.parentElement?.classList.add('opacity-0');
              }}
            />
          </motion.div>
          
          {/* Navigation - Fixed at the top */}
          <Navigation />
          
          {/* Welcome Text - Fades out on scroll */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-[80%] max-w-[317px] z-20"
            style={{ opacity: welcomeTextOpacity }}
          >
            <motion.h2 
              className="font-alex-brush text-3xl mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to
            </motion.h2>
            
            <motion.h1 
              className="font-playfair font-bold text-5xl mb-4 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Phoebe<br/>& David's
            </motion.h1>
            
            <motion.h2 
              className="font-alex-brush text-3xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              wedding
            </motion.h2>
          </motion.div>
          
          {/* Story Text - Fades in on scroll */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-[80%] max-w-[317px] z-20"
            style={{ opacity: storyTextOpacity }}
          >
            <motion.h2 
              className="font-alex-brush text-4xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: storyVisible ? 1 : 0, y: storyVisible ? 0 : 20 }}
              transition={{ duration: 0.6 }}
            >
              Our story
            </motion.h2>
            
            <motion.p 
              className="font-montserrat font-medium text-sm leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: storyVisible ? 1 : 0, y: storyVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A girl who grew up playing badminton in suburb-y California and a boy who grew up breakdancing in rural Michigan meet 30 years later. Midway driving across the country, he spends a first date walking the streets of Chicago on the phone with her, talking about each other's lives for three hours.
            </motion.p>
          </motion.div>
          
          {/* Scroll Animation at bottom - Centered on page */}
          <motion.div 
            className="absolute left-0 right-0 bottom-20 flex justify-center items-center z-20"
            style={{ opacity: welcomeTextOpacity }}
          >
            <motion.div 
              className="w-24 h-24 md:w-32 md:h-32"
              animate={{ 
                y: [0, -15, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.5,
                ease: "easeInOut"
              }}
            >
              <div className="white-animation">
                <DotLottieReact
                  src="https://lottie.host/1ec1155f-57d0-4466-bc51-cb012516b4ca/6XHoxKqpA8.lottie"
                  loop
                  autoplay
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Content section that appears after the transition */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-30"
          style={{ 
            opacity: contentOpacity,
            y: useTransform(scrollYProgress, [0.35, 0.5], ["100vh", "0vh"])
          }}
        >
          <div className="bg-dark text-white p-8 rounded-lg max-w-lg text-center">
            <h2 className="font-alex-brush text-4xl mb-4">Join Us</h2>
            <p className="font-montserrat">
              We are excited to celebrate our special day with you.
            </p>
            <button className="mt-6 bg-white text-dark px-6 py-2 rounded-full font-montserrat font-medium hover:bg-opacity-90 transition">
              RSVP
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage; 