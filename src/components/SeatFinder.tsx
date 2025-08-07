import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { guestDataService, Guest } from '../services/guestDataService';

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
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load all guests on component mount for typeahead
  useEffect(() => {
    const loadAllGuests = async () => {
      try {
        setIsLoadingGuests(true);
        const guests = await guestDataService.fetchGuests();
        setAllGuests(guests);
      } catch (error) {
        console.error('Error loading guests for typeahead:', error);
      } finally {
        setIsLoadingGuests(false);
      }
    };

    loadAllGuests();
  }, []);

  // Filter guests based on search input
  const filterGuests = (input: string): Guest[] => {
    if (!input.trim()) return [];
    
    const searchTerm = input.toLowerCase().trim();
    return allGuests
      .filter(guest => 
        guest.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  // Handle input change with typeahead
  const handleInputChange = (value: string) => {
    setSearchName(value);
    setNotFound(false);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      const filtered = filterGuests(value);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (guest: Guest) => {
    setSearchName(guest.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    // Navigate immediately when selecting from dropdown
    history.push(`/guest-detail?name=${encodeURIComponent(guest.name)}`);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          {/* Search Input with Typeahead */}
          <div className="w-full mb-6 relative">
            <input 
              ref={inputRef}
              type="text" 
              className="w-full border border-white bg-transparent rounded-xl px-4 text-white font-montserrat placeholder-white::placeholder focus:outline-none focus:border-2"
              style={{ height: '56px' }}
              placeholder=""
              value={searchName}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching || isLoadingGuests}
            />
            
            {/* Typeahead Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
                style={{ marginTop: '4px' }}
              >
                {suggestions.map((guest, index) => (
                  <div
                    key={guest.name}
                    className={`px-4 py-3 cursor-pointer font-montserrat text-sm border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex 
                        ? 'bg-[#857E73] text-white' 
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => selectSuggestion(guest)}
                  >
                    <div className="font-medium">{guest.name}</div>
                    <div className={`text-xs ${
                      index === selectedIndex ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      Table {guest.table}
                    </div>
                  </div>
                ))}
              </div>
            )}
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