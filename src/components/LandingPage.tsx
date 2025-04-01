import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LandingPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    <div className="w-full h-screen bg-dark text-light overflow-hidden">
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
        
        {/* Navigation */}
        <Navigation />
        
        {/* Wedding Images - Using Framer Motion for floating animation */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div 
            className="absolute top-[5%] left-[10%] w-32 h-48 rounded-lg overflow-hidden shadow-lg"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "easeInOut"
            }}
          >
            <img 
              src="/images/flowers-1.png" 
              alt="Wedding" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1529636798458-92914513de8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80';
              }}
            />
          </motion.div>
          
          <motion.div 
            className="absolute top-[15%] right-[15%] w-36 h-52 rounded-lg overflow-hidden shadow-lg"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <img 
              src="/images/flowers-2.png" 
              alt="Wedding" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=369&q=80';
              }}
            />
          </motion.div>
        </div>
        
        {/* Event Information */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-[80%] max-w-[317px]">
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
        <div className="absolute left-0 right-0 bottom-20 flex justify-center items-center">
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
    </div>
  );
};

export default LandingPage; 