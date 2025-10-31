'use client';

import { useState, useEffect, useCallback } from 'react';

type PermissionState = 'prompt' | 'granted' | 'denied';

export function useMicrophonePermission() {
  const [permission, setPermission] = useState<PermissionState>('prompt');

  const checkPermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermission(result.state);
      result.onchange = () => setPermission(result.state);
    } catch (error) {
      console.error('Error checking microphone permission:', error);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support microphone access.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      checkPermission();
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      checkPermission();
    }
  }, [checkPermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { permission, requestPermission };
}
