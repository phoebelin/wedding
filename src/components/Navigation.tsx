import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  activeSection: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  // Create refs for each navigation item
  const welcomeRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const seatRef = useRef<HTMLDivElement>(null);
  
  // State to track dot position
  const [dotPosition, setDotPosition] = useState({ left: 0, width: 0 });
  
  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    const section = document.getElementById(sectionId);
    if (section) {
      // Get the navigation bar height
      const navHeight = 60; // Approximate height of nav bar
      
      // Special handling for photos section
      if (sectionId === 'photos') {
        // Calculate a position that will ensure the photos section is visible
        // This is approximately 45% of the full scroll height
        const totalHeight = document.body.scrollHeight;
        const targetPosition = totalHeight * 0.437;
        
        // Scroll to this specific position
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        return;
      }
      
      // Special handling for seat section - use normal positioning for better centering
      if (sectionId === 'seat') {
        // Use normal section positioning for better centering
        const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition - navHeight,
          behavior: 'smooth'
        });
        return;
      }
      
      // Normal handling for other sections
      const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionPosition - navHeight,
        behavior: 'smooth'
      });
    }
  };
  
  // Update dot position based on active section
  useEffect(() => {
    let targetRef;
    switch(activeSection) {
      case 'welcome':
        targetRef = welcomeRef;
        break;
      case 'photos':
        targetRef = photosRef;
        break;
      case 'itinerary':
        targetRef = itineraryRef;
        break;
      case 'seat':
        targetRef = seatRef;
        break;
      default:
        targetRef = welcomeRef;
    }
    
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const navRect = targetRef.current.parentElement?.getBoundingClientRect();
      
      if (navRect) {
        // Calculate center position relative to nav
        const centerX = rect.left + (rect.width / 2) - navRect.left;
        setDotPosition({ 
          left: centerX,
          width: rect.width
        });
      }
    }
  }, [activeSection]);

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-6 z-50">
      <div ref={welcomeRef} className="relative">
        <motion.a 
          href="#welcome"
          onClick={(e) => handleNavClick(e, 'welcome')}
          className={`font-montserrat font-medium text-sm ${activeSection === "welcome" ? "font-bold" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Welcome
        </motion.a>
      </div>
      
      <div ref={photosRef} className="relative">
        <motion.a 
          href="#photos"
          onClick={(e) => handleNavClick(e, 'photos')}
          className={`font-montserrat font-medium text-sm ${activeSection === "photos" ? "font-bold" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Photos
        </motion.a>
      </div>
      
      <div ref={itineraryRef} className="relative">
        <motion.a 
          href="#itinerary"
          onClick={(e) => handleNavClick(e, 'itinerary')}
          className={`font-montserrat font-medium text-sm ${activeSection === "itinerary" ? "font-bold" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Itinerary
        </motion.a>
      </div>
      
      <div ref={seatRef} className="relative">
        <motion.a 
          href="#seat"
          onClick={(e) => handleNavClick(e, 'seat')}
          className={`font-montserrat font-medium text-sm ${activeSection === "seat" ? "font-bold" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Seat
        </motion.a>
      </div>

      {/* Single animated navigation dot */}
      <motion.div 
        className="absolute h-1.5 w-1.5 bg-white rounded-full"
        initial={false}
        animate={{
          left: `${dotPosition.left}px`,
          top: 'calc(100% - 23px)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      />
    </nav>
  );
};

export default Navigation; 