import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Mock data for guest seat assignments
const guestData = [
  { name: "John Smith", table: 5, note: "Looking forward to having you join us!" },
  { name: "Emma Johnson", table: 3, note: "Can't wait to celebrate with you!" },
  { name: "Michael Williams", table: 8, note: "We're so happy you can make it!" },
  { name: "Sarah Brown", table: 2, note: "Thank you for being part of our special day!" },
  { name: "David Miller", table: 1, note: "Your presence means the world to us!" },
];

interface SeatFinderProps {}

const SeatFinder: React.FC<SeatFinderProps> = () => {
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState<{ name: string; table: number; note: string } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!searchName.trim()) return;
    
    // Reset states
    setNotFound(false);
    setSearchResult(null);
    
    // Search for guest
    const guest = guestData.find(g => 
      g.name.toLowerCase().includes(searchName.toLowerCase())
    );
    
    if (guest) {
      setSearchResult(guest);
    } else {
      setNotFound(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-40">
      <div className="w-full px-6 mx-auto" style={{ maxWidth: '345px' }}>
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
                name not found
              </p>
            )}
          </div>
        ) : (
          <motion.div 
            className="flex flex-col gap-8 items-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h3 className="font-montserrat font-medium text-xl text-white mb-2">
                {searchResult.name}
              </h3>
              <p className="font-montserrat font-medium text-3xl text-white">
                Table {searchResult.table}
              </p>
            </div>
            
            <div className="w-full border-2 border-white rounded-xl p-6 text-center">
              <p className="font-montserrat font-medium text-sm text-white">
                {searchResult.note}
              </p>
            </div>
            
            <div 
              className="mt-4 font-montserrat font-medium text-sm text-white underline cursor-pointer"
              onClick={() => {
                setSearchResult(null);
                setSearchName('');
              }}
            >
              Search again
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Credits */}
      <div className="mt-36 flex flex-col gap-3 items-center text-center">
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