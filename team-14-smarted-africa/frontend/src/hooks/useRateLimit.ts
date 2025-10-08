import { useState, useCallback } from 'react';

const useRateLimit = (maxAttempts = 5, lockoutDuration = 300000) => {
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    
    if (now - lastAttempt > lockoutDuration) {
      setAttempts(0);
      setIsLocked(false);
      setLockoutTime(0);
    }
    
    if (isLocked) {
      if (now - lockoutTime < lockoutDuration) {
        return false;
      } else {
        setIsLocked(false);
        setAttempts(0);
        return true;
      }
    }
    
    if (attempts >= maxAttempts - 1) {
      setIsLocked(true);
      setLockoutTime(now);
      return false;
    }
    
    setAttempts(prev => prev + 1);
    setLastAttempt(now);
    return true;
  }, [attempts, isLocked, lockoutTime, lastAttempt, maxAttempts, lockoutDuration]);

  const resetRateLimit = useCallback(() => {
    setAttempts(0);
    setIsLocked(false);
    setLockoutTime(0);
    setLastAttempt(0);
  }, []);

  return { checkRateLimit, resetRateLimit, isLocked, attempts, lockoutTime, lockoutDuration };
};

export default useRateLimit;