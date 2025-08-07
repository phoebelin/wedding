import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { guestDataService, Guest } from '../services/guestDataService';

// Legacy interface removed - now using Guest from service

// Custom navigation component specifically for the guest detail page
const GuestPageNavigation: React.FC = () => {
  const history = useHistory();
  
  const handleNavClick = (e: React.MouseEvent<HTMLDivElement>, sectionId: string) => {
    e.preventDefault();
    
    // First navigate to the home page
    history.push('/');
    
    // Then scroll to the appropriate section after a short delay
    setTimeout(() => {
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
        
        // Special handling for seat section
        if (sectionId === 'seat') {
          // Calculate a position that will ensure the seat section is visible
          // This is approximately 85% of the full scroll height
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
        const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition - navHeight,
          behavior: 'smooth'
        });
      }
    }, 100); // Small delay to ensure navigation completes
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-6 z-50">
      <div className="relative">
        <motion.div 
          onClick={(e) => handleNavClick(e, 'welcome')}
          className="font-montserrat font-medium text-sm text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Welcome
        </motion.div>
      </div>
      
      <div className="relative">
        <motion.div 
          onClick={(e) => handleNavClick(e, 'photos')}
          className="font-montserrat font-medium text-sm text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Photos
        </motion.div>
      </div>
      
      <div className="relative">
        <motion.div 
          onClick={(e) => handleNavClick(e, 'itinerary')}
          className="font-montserrat font-medium text-sm text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Itinerary
        </motion.div>
      </div>
      
      <div className="relative">
        <motion.div 
          onClick={(e) => handleNavClick(e, 'seat')}
          className="font-montserrat font-medium text-sm text-white font-bold cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Seat
        </motion.div>
      </div>
    </nav>
  );
};

const GuestDetailPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [guestData, setGuestData] = useState<Guest | null>(null);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Find guest data based on URL query parameters
  useEffect(() => {
    const loadGuestData = async () => {
      // Get the guest name from URL parameters
      const searchParams = new URLSearchParams(location.search);
      const guestName = searchParams.get('name');
      
      if (!guestName) {
        // If no name parameter, redirect to home
        history.replace('/');
        return;
      }

      try {
        setIsLoading(true);
        const foundGuest = await guestDataService.findGuest(guestName);
        
        if (foundGuest) {
          setGuestData(foundGuest);
        } else {
          // If guest not found, redirect to home
          console.warn(`Guest not found: ${guestName}`);
          history.replace('/');
        }
      } catch (error) {
        console.error('Error loading guest data:', error);
        history.replace('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuestData();
  }, [location.search, history]);

  // Scroll to top when guest data loads
  useEffect(() => {
    if (guestData && !isLoading) {
      window.scrollTo(0, 0);
    }
  }, [guestData, isLoading]);

  // Text generation effect
  useEffect(() => {
    if (!guestData?.note) return;
    
    let currentIndex = 0;
    const fullText = guestData.note;
    let isMounted = true;
    
    // Reset text when starting generation
    setGeneratedText('');
    setIsGenerating(true);
    
    // Function to add the next character
    const addNextChar = () => {
      if (!isMounted) return;
      
      if (currentIndex < fullText.length) {
        setGeneratedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        
        // Random delay between characters (30-70ms) to simulate variable typing speed
        const delay = Math.floor(Math.random() * 40) + 30;
        setTimeout(addNextChar, delay);
      } else {
        // Ensure final text exactly matches the full note
        setGeneratedText(fullText);
        setIsGenerating(false);
      }
    };
    
    // Start the generation with a small initial delay
    const timer = setTimeout(addNextChar, 500);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timer);
      setIsGenerating(false);
    };
  }, [guestData?.note]);

  const handleSearchAgain = () => {
    // Navigate to home page first
    history.push('/');
    
    // Then scroll to the seat section after a short delay
    setTimeout(() => {
      const section = document.getElementById('seat');
      if (section) {
        // Calculate a position that will ensure the seat section is visible
        // This is approximately 85% of the full scroll height
        const totalHeight = document.body.scrollHeight;
        const targetPosition = totalHeight * 0.85;
        
        // Scroll to this specific position
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100); // Small delay to ensure navigation completes
  };

  // If loading or no guestData, show loading state
  if (isLoading || !guestData) {
    return (
      <div className="w-full bg-[#B8B0A2] min-h-screen flex flex-col items-center justify-center">
        <p className="font-montserrat font-medium text-[15px] text-white">Loading guest information...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#B8B0A2] min-h-screen flex flex-col items-center">
      {/* Custom Navigation Bar */}
      <GuestPageNavigation />
      
      {/* Container */}
      <div className="w-full px-6 mx-auto flex flex-col items-center gap-[24px] pt-28 pb-10" 
          style={{ maxWidth: '393px' }}>
        
        {/* Guest Info Container */}
        <div className="w-full flex flex-col items-center gap-2">
          {/* Name and Table */}
          <div className="flex flex-col items-center">
            <h1 className="font-alex-brush text-[36px] text-white">{guestData.name}</h1>
            <p className="font-montserrat font-medium text-[36px] text-white">Table {guestData.table}</p>
          </div>
          
          {/* Personalized Note */}
          <div className="w-full flex flex-col items-center gap-[24px]">
            {/* Flower background */}
            <div className="w-full relative overflow-hidden" 
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/images/flowers-bg-new.jpg)`,
                  backgroundSize: '30%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  height: '120px',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px'
                }}>
            </div>
            
            {/* Personalized Guest Image */}
            <div 
              className="relative h-72 overflow-hidden -mt-6 z-10"
              style={{ 
                width: 'calc(100vw)', 
                marginLeft: 'calc(-50vw + 50%)', 
                marginRight: 'calc(-50vw + 50%)'
              }}
            >
              {guestData.image ? (
                <img 
                  src={`${process.env.PUBLIC_URL}/images/${guestData.image}`}
                  alt={`${guestData.name}'s personalized`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.parentElement!.className = "relative h-72 bg-[#D9D9D9] flex items-center justify-center";
                    e.currentTarget.outerHTML = '<p class="font-montserrat font-medium text-sm text-[#857E73]">Personalized Image</p>';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#D9D9D9] flex items-center justify-center">
                  <p className="font-montserrat font-medium text-sm text-[#857E73]">
                    Personalized
                  </p>
                </div>
              )}
            </div>
            
            {/* Note */}
            <div className="w-full relative overflow-hidden rounded-lg -mt-6 p-6">
              <p className="font-montserrat font-medium text-[15px] text-white text-justify leading-relaxed">
                {generatedText}
                {isGenerating && <span className="ml-1 inline-block w-2 h-4 bg-white animate-pulse"></span>}
              </p>
            </div>
          </div>
        </div>
        
        {/* Add Photos Button */}
        <div className="w-[301px] bg-[#857E73] rounded-xl flex items-center justify-center gap-1 py-[21px] px-6 cursor-pointer">
          <span className="font-montserrat font-medium text-[15px] text-white">Add photos to our album</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.33334V12.6667" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3.33331 8H12.6666" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Wedding Bands Section */}
        <div className="w-full flex flex-col items-center gap-2 mt-24">
          <p className="font-montserrat font-medium text-[15px] text-white text-center">
            Bonus pic: we made our wedding bands in Bali!
          </p>
          <div 
            className="relative overflow-hidden"
            style={{ 
              width: 'calc(100vw)', 
              marginLeft: 'calc(-50vw + 50%)', 
              marginRight: 'calc(-50vw + 50%)'
            }}
          >
            <img 
              src={`${process.env.PUBLIC_URL}/images/wedding-bands-new.jpg`}
              alt="Wedding Bands" 
              className="w-full object-cover"
            />
          </div>
        </div>
        
        {/* Search Again Button */}
        <div 
          className="font-montserrat font-medium text-[15px] text-white underline cursor-pointer mt-[40px]"
          onClick={handleSearchAgain}
        >
          Search again
        </div>
        
        {/* Credits Section */}
        <div className="flex flex-col items-center gap-1 mt-[40px]">
          <p className="font-montserrat font-medium text-[15px] text-white">Created by Phoebe with Cursor</p>
          <p className="font-montserrat font-medium text-[15px] text-white">40+ hours</p>
          <p className="font-montserrat font-medium text-[15px] text-white">482 prompts</p>
          <p className="font-montserrat font-medium text-[15px] text-white">159 restores</p>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailPage; 