import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Mock data for guest seat assignments
const guestData = [
  { name: "John Smith", table: 5, note: "Looking forward to having you join us!", image: "guests/guest-john.jpg" },
  { name: "Emma Johnson", table: 3, note: "Can't wait to celebrate with you!", image: "guests/guest-emma.jpg" },
  { name: "Michael Williams", table: 8, note: "We're so happy you can make it!", image: "guests/guest-michael.jpg" },
  { name: "Sarah Brown", table: 2, note: "Thank you for being part of our special day!", image: "guests/guest-sarah.jpg" },
  { name: "David Miller", table: 9, note: "We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :) We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :)", image: "guests/guest-david.jpg" },
];

interface SeatFinderProps {}

const SeatFinder: React.FC<SeatFinderProps> = () => {
  const [searchName, setSearchName] = useState('');
  const [notFound, setNotFound] = useState(false);
  const history = useHistory();

  const handleSearch = () => {
    if (!searchName.trim()) return;
    
    // Reset states
    setNotFound(false);
    
    // Search for guest
    const guest = guestData.find(g => 
      g.name.toLowerCase().includes(searchName.toLowerCase())
    );
    
    if (guest) {
      // Navigate to guest detail page with the guest data
      // Use PUBLIC_URL to ensure correct path in GitHub Pages
      const basePath = process.env.PUBLIC_URL || '';
      history.push(`${basePath}/guest`, guest);
    } else {
      setNotFound(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-40" style={{ minHeight: '100vh', overflow: 'visible' }}>
      <div className="w-full px-6 mx-auto" style={{ maxWidth: '345px', overflow: 'visible' }}>
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
      </div>
      
      
    </div>
  );
};

export default SeatFinder; 