import React from 'react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-6 z-30">
      <motion.a 
        href="#story"
        className="font-montserrat font-medium text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Story
      </motion.a>
      
      <motion.a 
        href="#photos"
        className="font-montserrat font-medium text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Photos
      </motion.a>
      
      <motion.a 
        href="#itinerary"
        className="font-montserrat font-medium text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Itinerary
      </motion.a>
      
      <motion.a 
        href="#seat"
        className="font-montserrat font-medium text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Seat
      </motion.a>
    </nav>
  );
};

export default Navigation; 