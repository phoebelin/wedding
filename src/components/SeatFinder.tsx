import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock data for guest seat assignments
const guestData = [
  { name: "John Smith", table: 5, note: "Looking forward to having you join us!", image: "guest-john.jpg" },
  { name: "Emma Johnson", table: 3, note: "Can't wait to celebrate with you!", image: "guest-emma.jpg" },
  { name: "Michael Williams", table: 8, note: "We're so happy you can make it!", image: "guest-michael.jpg" },
  { name: "Sarah Brown", table: 2, note: "Thank you for being part of our special day!", image: "guest-sarah.jpg" },
  { name: "David Miller", table: 9, note: "We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :) We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :)", image: "guest-david.jpg" },
];

interface SeatFinderProps {}

interface GuestData {
  name: string;
  table: number;
  note: string;
  image: string;
}

const SeatFinder: React.FC<SeatFinderProps> = () => {
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState<GuestData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [revealed, setRevealed] = useState(0); // Percentage of scratch-off revealed
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  const handleSearch = () => {
    if (!searchName.trim()) return;
    
    // Reset states
    setNotFound(false);
    setSearchResult(null);
    setRevealed(0);
    
    // Search for guest
    const guest = guestData.find(g => 
      g.name.toLowerCase().includes(searchName.toLowerCase())
    );
    
    if (guest) {
      setSearchResult(guest);
      // Scroll down to show results below the nav bar
      setTimeout(() => {
        const currentPosition = window.scrollY || window.pageYOffset;
        const targetPosition = 40; // Position just below nav
        
        // Only scroll if we need to scroll down or if we're at the very top
        if (currentPosition < targetPosition) {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure content renders first
    } else {
      setNotFound(true);
    }
  };

  // Set up the scratch-off canvas
  useEffect(() => {
    if (!searchResult || !scratchCanvasRef.current) return;

    const canvas = scratchCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    // Fill with scratch-off color
    ctx.fillStyle = '#857E73';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some text to indicate it's scratchable
    ctx.font = '16px Montserrat';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to reveal your note!', canvas.width / 2, canvas.height / 2);
    
    // Add some decorative elements
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    
    // Draw some lines
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y + 20);
      ctx.stroke();
    }

    // Handle scratch-off events
    const handleScratch = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      
      // Get position
      let x, y;
      if (e instanceof MouseEvent) {
        x = e.offsetX;
        y = e.offsetY;
      } else {
        e.preventDefault(); // Prevent default only while scratching
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      }
      
      // "Erase" a circle where the user scratched
      if (ctx) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Calculate the percentage revealed
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        let transparentPixels = 0;
        
        for (let i = 3; i < pixelData.length; i += 4) {
          if (pixelData[i] < 50) { // Alpha channel < 50 is considered scratched
            transparentPixels++;
          }
        }
        
        const totalPixels = pixelData.length / 4;
        const newRevealed = Math.round((transparentPixels / totalPixels) * 100);
        setRevealed(newRevealed);
        
        // Auto-reveal the rest if more than 70% is scratched
        if (newRevealed > 70) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          setRevealed(100);
        }
      }
    };

    const startScratch = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      if (e instanceof TouchEvent) {
        e.preventDefault(); // Prevent default only at start of scratch
      }
    };

    const endScratch = () => {
      isDragging.current = false;
    };

    // Add event listeners
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('touchstart', startScratch, { passive: false });
    canvas.addEventListener('mousemove', handleScratch);
    canvas.addEventListener('touchmove', handleScratch, { passive: false });
    canvas.addEventListener('mouseup', endScratch);
    canvas.addEventListener('touchend', endScratch);
    
    // Clean up
    return () => {
      canvas.removeEventListener('mousedown', startScratch);
      canvas.removeEventListener('touchstart', startScratch);
      canvas.removeEventListener('mousemove', handleScratch);
      canvas.removeEventListener('touchmove', handleScratch);
      canvas.removeEventListener('mouseup', endScratch);
      canvas.removeEventListener('touchend', endScratch);
    };
  }, [searchResult]);

  return (
    <div className="w-full flex flex-col items-center pt-40" style={{ minHeight: '100vh', overflow: 'visible' }}>
      <div className="w-full px-6 mx-auto" style={{ maxWidth: '345px', overflow: 'visible' }}>
        {!searchResult ? (
          <div className="flex flex-col items-center">
            {/* Title */}
            <div className="w-full mb-6">
              <h2 className="font-alex-brush text-5xl text-white text-center">
                Table Seat
              </h2>
            </div>
            
            {/* Description */}
            <div className="text-center mb-6">
              <p className="font-montserrat font-medium text-sm text-white">
                Enter the name you RSVP'd with to find your table seat!
              </p>
            </div>
            
            {/* Search Input */}
            <div className="w-full mb-6">
              <input 
                type="text" 
                className="w-full border border-white bg-transparent rounded-xl px-4 text-white font-montserrat placeholder-white::placeholder focus:outline-none focus:border-2"
                style={{ height: '56px' }}
                placeholder=""
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            
            {/* Find Button */}
            <div 
              className="w-full bg-[#857E73] rounded-xl flex items-center justify-center cursor-pointer"
              style={{ height: '64px', maxWidth: '301px' }}
              onClick={handleSearch}
            >
              <span className="font-montserrat font-medium text-sm text-white mr-1">Find</span>
              <img 
                src={`${process.env.PUBLIC_URL}/images/chevron-right.svg`} 
                alt="Find" 
                className="w-3.5 h-3.5"
              />
            </div>
            
            {/* Error Message */}
            {notFound && (
              <p className="mt-3 text-red-500 font-montserrat text-sm">
                Guest not found. Please check the spelling or try a different name.
              </p>
            )}
          </div>
        ) : (
          <motion.div 
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Name and Table Number */}
            <div className="text-center mb-4">
              <h3 className="font-alex-brush text-[36px] text-white">
                {searchResult.name}
              </h3>
              <p className="font-montserrat font-medium text-[36px] text-white">
                Table {searchResult.table}
              </p>
            </div>
            
            {/* Flower Background Image */}
            <div 
              className="w-full h-12 relative mb-4 overflow-hidden rounded-t-lg"
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/images/flowers-bg.jpg)`,
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* No overlay */}
            </div>
            
            {/* Personalized Image - Full Viewport Width */}
            <div 
              className="relative h-48 overflow-hidden mb-8"
              style={{ width: 'calc(100vw)', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
            >
              {searchResult.image ? (
                <img 
                  src={`${process.env.PUBLIC_URL}/images/${searchResult.image}`}
                  alt={`${searchResult.name}'s personalized`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.parentElement!.className = "relative h-48 bg-[#D9D9D9] flex items-center justify-center";
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
            
            {/* Note with Flowers Background */}
            <div className="w-full relative overflow-hidden rounded-lg mb-6">
              {/* Semi-transparent Overlay */}
              <div 
                className="w-full h-full absolute top-0 left-0 bg-[#D9D9D9]"
                style={{ opacity: 0.9, display: revealed >= 100 ? 'none' : 'block' }}  
              />
              
              {/* Note Content */}
              <div className="relative p-6">
                <p 
                  className="font-montserrat font-medium text-sm text-white text-justify leading-relaxed"
                  style={{ opacity: revealed > 80 ? 1 : 0.2 }}
                >
                  {searchResult.note}
                </p>
                
                {/* Scratch-off canvas overlay */}
                <canvas 
                  ref={scratchCanvasRef}
                  className="absolute top-0 left-0 w-full h-full cursor-pointer"
                  style={{ 
                    display: revealed >= 100 ? 'none' : 'block',
                    touchAction: 'none',  // Prevents scrolling while scratching on mobile
                    pointerEvents: revealed >= 100 ? 'none' : 'auto' // Disable pointer events when revealed
                  }}
                />
              </div>
            </div>
            
            {/* Bonus Wedding Bands Section */}
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex flex-col">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/couple-1.jpg`}
                  alt="Couple" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <img 
                  src={`${process.env.PUBLIC_URL}/images/wedding-bands.jpg`}
                  alt="Wedding Bands" 
                  className="w-full h-48 object-cover rounded-b-lg"
                />
              </div>
              <p className="font-montserrat font-medium text-sm text-white text-center mt-2 mb-4">
                Bonus pic: we made our wedding bands in Bali!
              </p>
            </div>
            
            {/* Search Again Button */}
            <div 
              className="font-montserrat font-medium text-sm text-white underline cursor-pointer"
              onClick={() => {
                setSearchResult(null);
                setSearchName('');
                setRevealed(0);
              }}
            >
              Search again
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Credits */}
      <div className="mt-36 mb-12 flex flex-col gap-3 items-center text-center">
        <p className="font-montserrat font-medium text-sm text-white">
          Created by Phoebe with Cursor
        </p>
        <p className="font-montserrat font-medium text-sm text-white">
          40+ hours
        </p>
        <p className="font-montserrat font-medium text-sm text-white">
          482 prompts
        </p>
        <p className="font-montserrat font-medium text-sm text-white">
          159 restores
        </p>
      </div>
    </div>
  );
};

export default SeatFinder; 