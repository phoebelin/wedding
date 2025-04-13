import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface GuestData {
  name: string;
  table: number;
  note: string;
  image: string;
}

// Default guest data in case state is lost on refresh
const defaultGuest = {
  name: "David Miller",
  table: 9,
  note: "We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :) We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :)",
  image: "guests/guest-david.jpg"
};

// Custom navigation component specifically for the guest detail page
const GuestPageNavigation: React.FC = () => {
  const handleNavClick = (section: string) => {
    // Use absolute paths with PUBLIC_URL to ensure correct navigation in GitHub Pages
    const basePath = process.env.PUBLIC_URL || '';
    window.location.href = `${basePath}/?section=${section}`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-6 z-50">
      <div className="relative">
        <motion.div 
          onClick={() => handleNavClick('welcome')}
          className="font-montserrat font-medium text-sm text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Welcome
        </motion.div>
      </div>
      
      <div className="relative">
        <motion.div 
          onClick={() => handleNavClick('photos')}
          className="font-montserrat font-medium text-sm text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Photos
        </motion.div>
      </div>
      
      <div className="relative">
        <motion.div 
          onClick={() => handleNavClick('itinerary')}
          className="font-montserrat font-medium text-sm text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Itinerary
        </motion.div>
      </div>
      
      <div className="relative">
        <motion.div 
          onClick={() => handleNavClick('seat')}
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
  const location = useLocation();
  const [guest, setGuest] = useState<GuestData>(defaultGuest);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  // Set guest data from URL parameters or use default if not available
  useEffect(() => {
    // Try to get guest data from URL parameters first
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const tableStr = params.get('table');
    const note = params.get('note');
    const image = params.get('image');
    
    // If we have URL parameters, use them
    if (name && tableStr && note && image) {
      const table = parseInt(tableStr, 10);
      setGuest({ name, table, note, image });
    }
    // Otherwise fall back to location state if available
    else if (location.state) {
      setGuest(location.state as GuestData);
    }
    // If neither is available, we'll use the default guest
  }, [location]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Text generation effect
  useEffect(() => {
    if (!guest?.note) return;
    
    let currentIndex = 0;
    const fullText = guest.note;
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
  }, [guest?.note]);

  const handleSearchAgain = () => {
    // Use absolute path with PUBLIC_URL to ensure correct navigation in GitHub Pages
    const basePath = process.env.PUBLIC_URL || '';
    window.location.href = `${basePath}/`;
  };

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
            <h1 className="font-alex-brush text-[36px] text-white">{guest.name}</h1>
            <p className="font-montserrat font-medium text-[36px] text-white">Table {guest.table}</p>
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
              {guest.image ? (
                <img 
                  src={`${process.env.PUBLIC_URL}/images/${guest.image}`}
                  alt={`${guest.name}'s personalized`}
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