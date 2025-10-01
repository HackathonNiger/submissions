// Check if camera is available and request permissions
export const checkCameraAvailability = async () => {
  try {
    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not supported in this browser');
    }

    // Check if camera permission is already granted
    const permissionStatus = await navigator.permissions.query({ name: 'camera' });

    if (permissionStatus.state === 'denied') {
      throw new Error('Camera permission denied. Please enable camera access in browser settings.');
    }

    // Try to access camera to verify it's available
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    // Stop the stream immediately as we just needed to check availability
    stream.getTracks().forEach(track => track.stop());

    return { available: true };
  } catch (error) {
    console.error('Camera availability check failed:', error);
    return {
      available: false,
      error: error.message || 'Camera not available'
    };
  }
};

// Capture photo from camera
export const capturePhoto = async (videoElement) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(videoElement, 0, 0);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create file from blob
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          resolve(file);
        } else {
          reject(new Error('Failed to capture image'));
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      reject(error);
    }
  });
};

// Start camera stream
export const startCameraStream = async (videoElement, facingMode = 'environment') => {
  try {
    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoElement) {
      videoElement.srcObject = stream;
      await videoElement.play();
    }

    return stream;
  } catch (error) {
    console.error('Failed to start camera stream:', error);
    throw error;
  }
};

// Stop camera stream
export const stopCameraStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

// Get available camera devices
export const getCameraDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Failed to get camera devices:', error);
    return [];
  }
};