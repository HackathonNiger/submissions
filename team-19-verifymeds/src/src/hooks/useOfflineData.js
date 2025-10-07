import { useState, useEffect } from 'react';

const useOfflineData = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(localStorage.getItem('lastDataSync'));
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    if (!isOnline || syncInProgress) return false;

    setSyncInProgress(true);
    try {
      // In a real app, this would fetch from an API
      // For now, simulate API call and update timestamp
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      const newSyncTime = new Date().toISOString();
      setLastSync(newSyncTime);
      localStorage.setItem('lastDataSync', newSyncTime);

      // Process any offline queue if exists
      processOfflineQueue();

      return true;
    } catch (error) {
      console.error('Data sync failed:', error);
      return false;
    } finally {
      setSyncInProgress(false);
    }
  };

  const processOfflineQueue = () => {
    // In a real app, process queued actions like verification attempts
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    if (queue.length > 0) {
      console.log('Processing offline queue:', queue.length, 'items');
      // Process queue items here
      localStorage.removeItem('offlineQueue');
    }
  };

  const addToOfflineQueue = (action) => {
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    queue.push({ ...action, timestamp: Date.now() });
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
  };

  return {
    isOnline,
    lastSync,
    syncInProgress,
    syncData,
    addToOfflineQueue
  };
};

export default useOfflineData;