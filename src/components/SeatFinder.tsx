import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { guestDataService } from '../services/guestDataService';

// Legacy export for backward compatibility
export const guestData = [
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
  const [isSearching, setIsSearching] = useState(false);
  const history = useHistory();

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    
    // Reset states and show loading
    setNotFound(false);
    setIsSearching(true);
    
    try {
      // Search for guest using the service
      const guest = await guestDataService.findGuest(searchName);
      
      if (guest) {
        // Use query parameters instead of state
        history.push(`/guest-detail?name=${encodeURIComponent(guest.name)}`);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error searching for guest:', error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isSearching}
            />
          </div>
          
          {/* Find Button */}
          <div 
            className={`w-full rounded-xl flex items-center justify-center ${
              isSearching 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#857E73] cursor-pointer'
            }`}
            style={{ height: '64px', maxWidth: '301px' }}
            onClick={!isSearching ? handleSearch : undefined}
          >
            {isSearching ? (
              <span className="font-montserrat font-medium text-sm text-white">Searching...</span>
            ) : (
              <>
                <span className="font-montserrat font-medium text-sm text-white mr-1">Find</span>
                <img 
                  src={`${process.env.PUBLIC_URL}/images/chevron-right.svg`} 
                  alt="Find" 
                  className="w-3.5 h-3.5"
                />
              </>
            )}
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