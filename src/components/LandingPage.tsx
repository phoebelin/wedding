import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from './Navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LandingPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end start"]
  });
  
  // Transform values for parallax zoom effect
  const foregroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  
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
      {/* Main Container */}
      <div className="w-full h-screen relative">
        {/* Background Image - Different for Mobile vs Desktop */}
        <div className="absolute inset-0 z-0">
          <img 
            src={isMobile ? "/images/background.png" : "/images/background-large.jpg"}
            alt="Wedding Background" 
            className="w-full h-full object-cover bg-image"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
            }}
          />
        </div>
        
        {/* Foreground Image with Parallax Zoom Effect */}
        <motion.div 
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ 
            scale: foregroundScale,
            originY: 0.5
          }}
        >
          <img 
            src="/images/foreground.png" 
            alt="Foreground" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // If foreground image fails to load, make this div transparent
              e.currentTarget.parentElement?.classList.add('opacity-0');
            }}
          />
        </motion.div>
        
        {/* Navigation - Now fixed at the top */}
        <Navigation />
        
        {/* Event Information */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-[80%] max-w-[317px] z-20">
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
        </div>
        
        {/* Scroll Animation at bottom - Centered on page */}
        <div className="absolute left-0 right-0 bottom-20 flex justify-center items-center z-20">
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
        </div>
      </div>
      
      {/* Additional content to enable scrolling */}
      <div className="w-full h-screen bg-dark"></div>
    </div>
  );
};

export default LandingPage; 