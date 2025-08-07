import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from './Navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SeatFinder from './SeatFinder';
import { useLocation } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("welcome");
  
  // Animation states for story text
  const [storyVisible, setStoryVisible] = useState(false);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, caption: string} | null>(null);
  
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
  
  // Background color transition (from transparent to #B8B0A2) - made faster
  const backgroundOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  
  // Line should only appear when background is at least 75% opaque
  const lineVisibility = useTransform(
    scrollYProgress,
    value => value >= 0.3125 && value <= 0.45 ? 1 : 0
  );
  const lineScale = useTransform(scrollYProgress, [0.3125, 0.45], [1, 0]);
  
  // Background image fade out - make it fade out completely before gallery appears
  const backgroundImageOpacity = useTransform(scrollYProgress, [0.35, 0.39], [1, 0]);
  
  // Main container opacity - fade out after story text disappears
  const mainContainerOpacity = useTransform(scrollYProgress, [0.39, 0.42], [1, 0]);
  
  // Scroll lock transform - changed to keep main container fixed until story fully fades
  const scrollLockY = useTransform(
    scrollYProgress,
    [0, 0.39, 0.45, 0.58, 0.78, 0.93, 1],
    ["0vh", "0vh", "-10vh", "-100vh", "-200vh", "-300vh", "-400vh"]
  );
  
  // Gallery scroll transform - makes gallery scroll up from below
  const galleryY = useTransform(
    scrollYProgress,
    [0.37, 0.45, 0.47],
    ["100vh", "0vh", "0vh"]
  );
  
  // Subtle rotation effects for itinerary images
  const firstImageRotate = useTransform(
    scrollYProgress,
    [0.5, 0.7],
    [-10, 10] // Subtle clockwise rotation (in degrees)
  );
  
  // Change second image from rotation to sliding
  const secondImageSlide = useTransform(
    scrollYProgress,
    [0.5, 0.7],
    ['10%', '-10%'] // Slide left and right
  );
  
  // Sparkle animations
  const sparkleFloat1 = useTransform(
    scrollYProgress,
    [0.55, 0.8],
    [0, -40] // Float upward as user scrolls down
  );
  
  const sparkleFloat2 = useTransform(
    scrollYProgress,
    [0.55, 0.8],
    [0, -60] // Float upward faster
  );
  
  const sparkleFloat3 = useTransform(
    scrollYProgress,
    [0.6, 0.85],
    [0, -50] // Float upward with different timing
  );
  
  const sparkleFloat4 = useTransform(
    scrollYProgress,
    [0.58, 0.83],
    [0, -70] // Float upward even faster
  );
  
  const sparkleFloat5 = useTransform(
    scrollYProgress,
    [0.63, 0.88],
    [0, -45] // Different timing
  );
  
  // Update section visibility based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      if (value < 0.12) {
        setActiveSection("welcome");
      } else if (value < 0.40) {
        setActiveSection("story");
      } else if (value < 0.5) {
        setActiveSection("photos");
      } else if (value < 0.75) {
        setActiveSection("itinerary");
      } else {
        setActiveSection("seat");
      }
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);
  
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

  // Handle initial scroll based on URL parameters
  useEffect(() => {
    // Parse the section parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get('section');
    
    if (section) {
      // Find the section element
      const sectionElement = document.getElementById(section);
      
      if (sectionElement) {
        // Get the navigation bar height
        const navHeight = 60; // Approximate height of nav bar
        
        // Special handling for different sections
        if (section === 'photos') {
          // Calculate a position that will ensure the photos section is visible
          const totalHeight = document.body.scrollHeight;
          const targetPosition = totalHeight * 0.437;
          
          // Scroll to this specific position
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          return;
        }
        
        if (section === 'seat') {
          // Calculate a position that will ensure the seat section is visible
          const totalHeight = document.body.scrollHeight;
          const targetPosition = totalHeight * 0.85;
          
          // Scroll to this specific position
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          return;
        }
        
        // Normal handling for other sections
        const sectionPosition = sectionElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition - navHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [location]);

  // Lightbox functions
  const openLightbox = (src: string, alt: string, caption: string) => {
    setSelectedImage({ src, alt, caption });
    setLightboxOpen(true);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    // Restore body scroll
    document.body.style.overflow = 'auto';
  };

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [lightboxOpen]);

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen bg-[#B8B0A2] text-light overflow-hidden"
    >
      {/* Fixed height container to track scroll position */}
      <div className="w-full h-[610vh]">
        {/* Persistent Navigation - Fixed at the top and always visible */}
        <Navigation activeSection={activeSection} />
        
        {/* First section - Landing with parallax */}
        <div className="h-[250vh] relative" id="welcome">
          {/* Main Container with scroll lock */}
          <motion.div 
            className="fixed top-0 left-0 w-full h-screen"
            style={{ 
              y: scrollLockY,
              opacity: mainContainerOpacity // Use dedicated variable for main container opacity
            }}
          >
            {/* Background Image - Different for Mobile vs Desktop */}
            <motion.div 
              className="absolute inset-0 z-0"
              style={{
                opacity: backgroundImageOpacity // Use the updated opacity timing
              }}
            >
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
              {/* Background color overlay that fades in */}
              <motion.div 
                className="absolute inset-0 bg-[#B8B0A2]" 
                style={{ 
                  opacity: backgroundOpacity,
                  // Ensure the background color stays visible after transition
                  display: useTransform(
                    scrollYProgress, 
                    value => value > 0.35 ? 'block' : 'block'
                  )
                }}
              />
            </motion.div>
            
            {/* Foreground Image with Enhanced Parallax Zoom Effect */}
            <motion.div 
              className="absolute inset-0 z-10 overflow-hidden"
              style={{ 
                scale: foregroundScale,
                originY: 0.5,
                opacity: useTransform(scrollYProgress, [0.3, 0.37], [1, 0])
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
            
            {/* Story Text - Fades in on initial scroll, then out after background change */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-[80%] max-w-[317px] z-20"
              style={{ 
                opacity: useTransform(
                  scrollYProgress, 
                  [0.08, 0.2, 0.35, 0.39], 
                  [0, 1, 1, 0]
                )
              }}
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
            
            {/* Vertical white line that decreases in length */}
            <motion.div 
              className="fixed left-1/2 bottom-0 transform -translate-x-1/2 bg-white w-[1px] h-[150px] z-20"
              style={{ 
                scaleY: lineScale,
                opacity: lineVisibility,
                transformOrigin: 'bottom',
                originY: 1
              }}
            />
            
            {/* Scroll Animation at bottom - Centered on page */}
            <motion.div 
              className="absolute left-0 right-0 bottom-20 flex justify-center items-center z-20"
              style={{ 
                opacity: useTransform(scrollYProgress, [0, 0.15, 0.3, 0.35], [1, 1, 0.5, 0])
              }}
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
        </div>
        
        {/* Gallery section - integrated into main scroll */}
        <motion.div 
          className="relative min-h-screen bg-[#B8B0A2] pt-16 pb-24" 
          id="photos"
          style={{
            y: galleryY // Only slide up from below, no fading
          }}
        >
          {/* Photo Gallery Section */}
          <div className="w-full flex flex-col">
            {/* Photo Card 1 */}
            <div className="w-full relative cursor-pointer" onClick={() => openLightbox(`${process.env.PUBLIC_URL}/images/gallery-1.png`, "David 3 years old", "David 3 years old")}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-1.png`}
                alt="David 3 years old"
                className="w-screen object-contain"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  David<br/>3 years old
                </p>
              </div>
            </div>
            
            {/* Photo Card 2 */}
            <div className="w-full relative cursor-pointer" onClick={() => openLightbox(`${process.env.PUBLIC_URL}/images/gallery-2.png`, "Phoebe 3 years old", "Phoebe 3 years old")}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-2.png`}
                alt="Phoebe 3 years old"
                className="w-screen object-contain"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  Phoebe<br/>3 years old
                </p>
              </div>
            </div>
            
            {/* Photo Card 3 */}
            <div className="w-full relative cursor-pointer" onClick={() => openLightbox(`${process.env.PUBLIC_URL}/images/gallery-3.png`, "David 17 years old", "David 17 years old")}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-3.png`}
                alt="David 17 years old"
                className="w-screen object-contain"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  David<br/>17 years old
                </p>
              </div>
            </div>
            
            {/* Photo Card 4 */}
            <div className="w-full relative cursor-pointer" onClick={() => openLightbox(`${process.env.PUBLIC_URL}/images/gallery-4.png`, "Phoebe 17 years old", "Phoebe 17 years old")}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-4.png`}
                alt="Phoebe 17 years old"
                className="w-screen object-contain"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  Phoebe<br/>17 years old
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Itinerary section */}
        <div className="relative min-h-screen bg-[#B8B0A2] pt-0 pb-24" id="itinerary">
          <div className="w-full flex flex-col items-center">
            {/* First Image */}
            <motion.div 
              className="w-full max-w-screen-md mx-auto px-4 relative"
              style={{
                rotate: firstImageRotate
              }}
            >
              {/* Sparkle 1 - Top Left */}
              <motion.div 
                className="absolute -top-8 -left-4 text-white z-10"
                style={{ y: sparkleFloat1 }}
                animate={{ 
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                  rotate: [0, 45, 0]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut" 
                }}
              >
                ⭐
              </motion.div>
              
              {/* Sparkle 2 - Top Right */}
              <motion.div 
                className="absolute -top-4 -right-4 text-white z-10"
                style={{ y: sparkleFloat2 }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, -30, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                ⭐
              </motion.div>
              
              {/* New Sparkle - Left Center */}
              <motion.div 
                className="absolute top-1/3 -left-10 text-white z-10 text-lg"
                style={{ y: sparkleFloat5 }}
                animate={{ 
                  scale: [0.7, 1.1, 0.7],
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, 20, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3.7,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              >
                ⭐
              </motion.div>
              
              {/* New Sparkle - Right Center */}
              <motion.div 
                className="absolute top-2/3 -right-12 text-white z-10 text-xl"
                style={{ y: sparkleFloat4 }}
                animate={{ 
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0.4, 0.9, 0.4],
                  rotate: [0, -40, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 4.2,
                  ease: "easeInOut",
                  delay: 1.1
                }}
              >
                ⭐
              </motion.div>
              
              <img 
                src={`${process.env.PUBLIC_URL}/images/itinerary-image-1.jpg`}
                alt="Decorative flowers" 
                className="w-full object-contain"
                loading="lazy"
              />
              
              {/* Sparkle 3 - Bottom Right */}
              <motion.div 
                className="absolute -bottom-8 -right-8 text-white z-10"
                style={{ y: sparkleFloat3 }}
                animate={{ 
                  scale: [0.9, 1.3, 0.9],
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, 60, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut" 
                }}
              >
                ⭐
              </motion.div>
              
              {/* New Sparkle - Bottom Left */}
              <motion.div 
                className="absolute -bottom-10 -left-6 text-white z-10 text-lg"
                style={{ y: sparkleFloat2 }}
                animate={{ 
                  scale: [0.6, 1.2, 0.6],
                  opacity: [0.5, 0.8, 0.5],
                  rotate: [0, 35, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3.8,
                  ease: "easeInOut",
                  delay: 0.7
                }}
              >
                ⭐
              </motion.div>
            </motion.div>
            
            {/* Title */}
            <div className="py-8 relative">
              {/* Sparkle around title - Top */}
              <motion.div 
                className="absolute -top-6 -right-8 text-white z-10 text-sm"
                style={{ y: sparkleFloat1 }}
                animate={{ 
                  scale: [0.7, 1.2, 0.7],
                  opacity: [0.5, 0.9, 0.5],
                  rotate: [0, 30, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.8,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              >
                ⭐
              </motion.div>
              
              {/* Sparkle around title - Left */}
              <motion.div 
                className="absolute top-1/2 -left-12 text-white z-10 text-lg"
                style={{ y: sparkleFloat3 }}
                animate={{ 
                  scale: [0.9, 1.4, 0.9],
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, -25, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3.3,
                  ease: "easeInOut",
                  delay: 0.9
                }}
              >
                ⭐
              </motion.div>
              
              <h2 className="font-alex-brush text-5xl text-white">
                Itinerary
              </h2>
              
              {/* Sparkle around title - Bottom */}
              <motion.div 
                className="absolute -bottom-6 -left-6 text-white z-10 text-xs"
                style={{ y: sparkleFloat2 }}
                animate={{ 
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 45, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.6,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                ⭐
              </motion.div>
            </div>
            
            {/* Second Image */}
            <motion.div 
              className="w-full max-w-xs mx-auto mb-10 px-4 relative"
              style={{
                x: secondImageSlide // Using x for horizontal movement instead of rotate
              }}
            >
              
              
              {/* Sparkle 5 - Bottom Left */}
              <motion.div 
                className="absolute -bottom-4 -left-4 text-white z-10"
                style={{ y: sparkleFloat1 }}
                animate={{ 
                  scale: [0.8, 1.4, 0.8],
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, 30, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              >
                ⭐
              </motion.div>
              
              {/* New Sparkle - Top Right */}
              <motion.div 
                className="absolute -top-8 -right-4 text-white z-10 text-lg"
                style={{ y: sparkleFloat4 }}
                animate={{ 
                  scale: [0.6, 1.0, 0.6],
                  opacity: [0.5, 0.9, 0.5],
                  rotate: [0, 25, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.9,
                  ease: "easeInOut",
                  delay: 1.2
                }}
              >
                ⭐
              </motion.div>
              
              {/* New Sparkle - Left Center */}
              <motion.div 
                className="absolute top-1/3 -left-10 text-white z-10 text-xs"
                style={{ y: sparkleFloat5 }}
                animate={{ 
                  scale: [0.9, 1.5, 0.9],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, -15, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3.3,
                  ease: "easeInOut",
                  delay: 0.8
                }}
              >
                ⭐
              </motion.div>
              
              <img 
                src={`${process.env.PUBLIC_URL}/images/itinerary-image-2.jpg`}
                alt="Decorative table setting" 
                className="w-full object-contain max-h-[50vh]"
                loading="lazy"
              />
              
              {/* Sparkle 6 - Right Center */}
              <motion.div 
                className="absolute top-1/2 -right-8 text-white z-10"
                style={{ y: sparkleFloat3 }}
                animate={{ 
                  scale: [1, 1.6, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 60, 0]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.7,
                  ease: "easeInOut" 
                }}
              >
                ⭐
              </motion.div>
              
              {/* New Sparkle - Bottom Right */}
              <motion.div 
                className="absolute -bottom-6 -right-6 text-white z-10 text-sm"
                style={{ y: sparkleFloat1 }}
                animate={{ 
                  scale: [0.7, 1.2, 0.7],
                  opacity: [0.5, 0.9, 0.5],
                  rotate: [0, -40, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3.6,
                  ease: "easeInOut",
                  delay: 0.4
                }}
              >
                ⭐
              </motion.div>
            </motion.div>
            
            {/* Schedule */}
            <div className="w-full px-6 relative">
              {/* Schedule sparkle 1 */}
              <motion.div 
                className="absolute -top-4 right-10 text-white z-10 text-sm"
                style={{ y: sparkleFloat2 }}
                animate={{ 
                  scale: [0.6, 1.0, 0.6],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 30, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.9,
                  ease: "easeInOut",
                  delay: 0.9
                }}
              >
                ⭐
              </motion.div>
              
              {/* Schedule sparkle 2 */}
              <motion.div 
                className="absolute -bottom-10 left-10 text-white z-10 text-sm"
                style={{ y: sparkleFloat3 }}
                animate={{ 
                  scale: [0.7, 1.1, 0.7],
                  opacity: [0.5, 0.9, 0.5],
                  rotate: [0, -35, 0] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3.4,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                ⭐
              </motion.div>
              
              <div className="w-full max-w-md mx-auto">
                {/* Schedule Item 1 */}
                <div>
                  <div className="grid grid-cols-2 gap-4 py-4 px-4 border-t border-white place-content-center">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      3:30 - 4:00 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      Ceremony
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 2 */}
                <div>
                  <div className="grid grid-cols-2 gap-4 py-4 px-4 border-t border-white place-content-center">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      4:00 - 5:30 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      Cocktail hour
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 3 */}
                <div>
                  <div className="grid grid-cols-2 gap-4 py-4 px-4 border-t border-white place-content-center">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      5:30 - 7:00 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      Dinner
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 4 */}
                <div>
                  <div className="grid grid-cols-2 gap-4 py-4 px-4 border-t border-white place-content-center">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      7:00 - 9:15 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      Reception
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 5 */}
                <div>
                  <div className="grid grid-cols-2 gap-4 py-4 px-4 border-t border-white border-b place-content-center">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      9:30 - 9:30 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white text-left pl-6">
                      Shuttles leave
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seat section */}
        <div className="relative min-h-screen bg-[#B8B0A2] pt-0 pb-24" id="seat">
          <SeatFinder />
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <motion.div
            className="relative max-w-4xl max-h-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white text-2xl font-bold hover:text-gray-300 transition-colors z-10"
              aria-label="Close lightbox"
            >
              ×
            </button>
            
            {/* Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            {/* Caption */}
            <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.8)] px-3 py-2 rounded-lg">
              <p className="font-montserrat font-medium text-sm text-white">
                {selectedImage.caption}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage; 