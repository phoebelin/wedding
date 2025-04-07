import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navigation from './Navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SeatFinder from './SeatFinder';

const LandingPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("welcome");
  
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
  
  // Scroll lock transform - begins scrolling right after story text fade completes
  const scrollLockY = useTransform(
    scrollYProgress,
    [0, 0.39, 0.41, 0.55, 0.75, 0.9, 1],
    ["0vh", "0vh", "-10vh", "-100vh", "-200vh", "-300vh", "-400vh"]
  );
  
  // Update section visibility based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      if (value < 0.12) {
        setActiveSection("welcome");
      } else if (value < 0.35) {
        setActiveSection("story");
      } else if (value < 0.5) {
        setActiveSection("photos");
      } else if (value < 0.7) {
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

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen bg-[#B8B0A2] text-light overflow-hidden"
    >
      {/* Fixed height container to track scroll position */}
      <div className="w-full h-[600vh]">
        {/* Persistent Navigation - Fixed at the top and always visible */}
        <Navigation activeSection={activeSection} />
        
        {/* First section - Landing with parallax */}
        <div className="h-[250vh] relative" id="welcome">
          {/* Main Container with scroll lock */}
          <motion.div 
            className="fixed top-0 left-0 w-full h-screen"
            style={{ 
              y: scrollLockY,
              opacity: useTransform(scrollYProgress, [0.39, 0.43], [1, 0]) // Fade out main container right after story text
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
        <div className="relative min-h-screen bg-[#B8B0A2] pt-0 pb-24" id="photos">
          {/* Photo Gallery Section */}
          <div className="w-full flex flex-col">
            {/* Photo Card 1 */}
            <div className="w-full relative">
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-1.png`}
                alt="David 3 years old"
                className="w-screen h-60 object-cover"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  David<br/>3 years old
                </p>
              </div>
            </div>
            
            {/* Photo Card 2 */}
            <div className="w-full relative">
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-2.png`}
                alt="Phoebe 3 years old"
                className="w-screen h-60 object-cover"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  Phoebe<br/>3 years old
                </p>
              </div>
            </div>
            
            {/* Photo Card 3 */}
            <div className="w-full relative">
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-3.png`}
                alt="David 17 years old"
                className="w-screen h-60 object-cover"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  David<br/>17 years old
                </p>
              </div>
            </div>
            
            {/* Photo Card 4 */}
            <div className="w-full relative">
              <img 
                src={`${process.env.PUBLIC_URL}/images/gallery-4.png`}
                alt="Phoebe 17 years old"
                className="w-screen h-60 object-cover"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 bg-[rgba(8,8,7,0.6)] px-3 py-2 rounded-lg">
                <p className="font-montserrat font-medium text-sm leading-tight text-white">
                  Phoebe<br/>17 years old
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Itinerary section */}
        <div className="relative min-h-screen bg-[#B8B0A2] pt-6 pb-24" id="itinerary">
          <div className="w-full flex flex-col items-center">
            {/* First Image */}
            <div className="w-full relative">
              <img 
                src={`${process.env.PUBLIC_URL}/images/itinerary-image-1.jpg`}
                alt="Decorative flowers" 
                className="w-full h-60 object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Title */}
            <div className="py-8">
              <h2 className="font-alex-brush text-5xl text-white">
                Itinerary
              </h2>
            </div>
            
            {/* Second Image */}
            <div className="w-full relative mb-10">
              <img 
                src={`${process.env.PUBLIC_URL}/images/itinerary-image-2.jpg`}
                alt="Decorative table setting" 
                className="w-full h-60 object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Schedule */}
            <div className="w-full px-6">
              <div className="w-full max-w-md mx-auto">
                {/* Schedule Item 1 */}
                <div>
                  <div className="flex justify-between py-4 px-4 border-t border-white">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      3:30 - 4:00 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      Ceremony
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 2 */}
                <div>
                  <div className="flex justify-between py-4 px-4 border-t border-white">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      4:00 - 5:30 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      Cocktail hour
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 3 */}
                <div>
                  <div className="flex justify-between py-4 px-4 border-t border-white">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      5:30 - 7:00 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      Dinner
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 4 */}
                <div>
                  <div className="flex justify-between py-4 px-4 border-t border-white">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      7:00 - 9:15 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      Reception
                    </div>
                  </div>
                </div>
                
                {/* Schedule Item 5 */}
                <div>
                  <div className="flex justify-between py-4 px-4 border-t border-white border-b">
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      9:30 - 9:30 pm
                    </div>
                    <div className="font-montserrat font-medium text-sm md:text-base text-white">
                      Shuttles leave
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seat section */}
        <div className="relative min-h-screen bg-[#B8B0A2] pt-6 pb-24" id="seat">
          <SeatFinder />
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 