// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Clock } from 'lucide-react';

// interface TimerProps {
//   totalSeconds: number;
//   onTimeUp: () => void;
// }

// export default function Timer({ totalSeconds, onTimeUp }: TimerProps) {
//   const [timeLeft, setTimeLeft] = useState(totalSeconds);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeUp();
//       return;
//     }
//     const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timeLeft, onTimeUp]);

//   const formatTime = (sec: number) => {
//     const h = Math.floor(sec / 3600).toString().padStart(2, '0');
//     const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
//     const s = (sec % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   return (
//     <motion.span
//     className='flex'
//       animate={{ color: timeLeft < 60 ? '#ef4444' : '#3b82f6' }}
//       transition={{ duration: 0.5 }}
//     >
//       <Clock className="mr-2" />
//       {formatTime(timeLeft)}
//     </motion.span>
//   );
// }


'use client';

import { useEffect, useState } from 'react';

import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  onTick?: (elapsed: number) => void; // added
}

export default function Timer({ totalSeconds, onTimeUp, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (onTick) {
          onTick(totalSeconds - next); // elapsed time
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp, onTick, totalSeconds]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <motion.span
      className="flex"
      animate={{ color: timeLeft < 60 ? '#ef4444' : '#3b82f6' }}
      transition={{ duration: 0.5 }}
    >
      <Clock className="mr-2" />
      {formatTime(timeLeft)}
    </motion.span>
  );
}
