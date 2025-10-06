import React from 'react'
import people from '../assets/people.png'; 
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const ExpandProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);

  // Close box when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-center ">
      
       <button 
         onClick={() => setIsOpen(true)}
         className="bg-orange-500 hover:bg-orange-600 px-3 py-3 cursor-pointer rounded-full flex items-center space-x-2 transition-colors duration-200"
        >
              <img className='w-8 h-8' src={people} alt="" />
       </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={boxRef}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 300, height: 200, opacity: 1 }}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-45 z-50  -translate-x-1/2 -translate-y-1/3 bg-green-500 border-2 border-orange-500 shadow-lg rounded-lg p-4 overflow-hidden"
          >
            <h2 className="text-xl text-black font-bold">Omilabu Elizabeth</h2>
            <p className="mt-2 text-lg text-black">
            <span className='font-semibold'>  🎓 Course Selected : </span>Computer science
            </p>
            <button className='mt-2 rounded-3xl cursor-pointer border-2 bg-black border-orange-500 hover:bg-orange-500 hover:text-white text-orange-500 font-bold transition transform w-full px-6 py-4'>Log out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
 

