import React, { useState, useEffect } from 'react';
import WarningAlert from './WarningAlert';

interface LockoutMessageProps {
  lockoutTime: number;
  lockoutDuration: number;
}

const LockoutMessage: React.FC<LockoutMessageProps> = ({ lockoutTime, lockoutDuration }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  
  useEffect(() => {
    const calculateRemaining = () => {
      const now = Date.now();
      const elapsed = now - lockoutTime;
      const remaining = Math.max(0, lockoutDuration - elapsed);
      setRemainingTime(remaining);
      
      if (remaining > 0) {
        const timer = setTimeout(calculateRemaining, 1000);
        return () => clearTimeout(timer);
      }
    };
    
    if (lockoutTime > 0) {
      calculateRemaining();
    }
  }, [lockoutTime, lockoutDuration]);
  
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);
  
  return (
    <WarningAlert 
      message={`Too many attempts. Please try again in ${minutes}:${seconds.toString().padStart(2, '0')}`}
    />
  );
};

export default LockoutMessage;