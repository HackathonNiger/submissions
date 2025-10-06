// Check if camera is available and request permissions
export const checkCameraAvailability = async () => {
  try {
    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not supported in this browser');
    }

    // Check if camera permission is already granted (with fallback for browsers that don't support permissions API)
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      if (permissionStatus.state === 'denied') {
        throw new Error('Camera permission denied. Please enable camera access in browser settings.');
      }
    } catch {
      // Permissions API not supported, continue with getUserMedia check
      console.warn('Permissions API not available, proceeding with camera access check');
    }

    // Try to access camera to verify it's available (with mobile-optimized constraints)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 640, max: 1280 },
        height: { ideal: 480, max: 720 }
      }
    });

    // Stop the stream immediately as we just needed to check availability
    stream.getTracks().forEach(track => track.stop());

    return { available: true };
  } catch (error) {
    console.error('Camera availability check failed:', error);

    // Provide more specific error messages for mobile devices
    let errorMessage = error.message || 'Camera not available';

    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera permission denied. Please allow camera access and try again.';
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage = 'No camera found on this device.';
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage = 'Camera is already in use by another application.';
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      errorMessage = 'Camera does not support the requested quality settings.';
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Camera access blocked due to security restrictions.';
    } else if (error.name === 'AbortError') {
      errorMessage = 'Camera access was interrupted.';
    }

    return {
      available: false,
      error: errorMessage
    };
  }
};

// Capture photo from camera
export const capturePhoto = async (videoElement) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate video element
      if (!videoElement) {
        reject(new Error('Video element not provided'));
        return;
      }

      if (!videoElement.videoWidth || !videoElement.videoHeight) {
        reject(new Error('Video not ready for capture. Please wait for camera to load.'));
        return;
      }

      if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
        reject(new Error('Video data not ready for capture'));
        return;
      }

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

      // Convert to blob with error handling
      canvas.toBlob((blob) => {
        if (blob) {
          // Validate blob size (minimum viable image size)
          if (blob.size < 100) {
            reject(new Error('Captured image is too small. Please try again.'));
            return;
          }

          // Create file from blob
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          resolve(file);
        } else {
          reject(new Error('Failed to capture image - canvas blob creation failed'));
        }
      }, 'image/jpeg', 0.9); // Increased quality for better mobile capture
    } catch (error) {
      console.error('Photo capture error:', error);
      reject(new Error(`Failed to capture photo: ${error.message}`));
    }
  });
};

// Start camera stream
export const startCameraStream = async (videoElement, facingMode = 'environment') => {
  try {
    // Mobile-optimized constraints with fallbacks
    const constraints = {
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 640, max: 1280 },
        height: { ideal: 480, max: 720 },
        frameRate: { ideal: 30, max: 30 }
      }
    };

    // Try with ideal constraints first
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (firstError) {
      console.warn('First attempt failed, trying with basic constraints:', firstError);

      // Fallback to basic constraints for older devices
      const basicConstraints = {
        video: {
          facingMode: facingMode
        }
      };

      stream = await navigator.mediaDevices.getUserMedia(basicConstraints);
    }

    if (videoElement) {
      videoElement.srcObject = stream;

      // Wait for video to be ready before playing
      return new Promise((resolve, reject) => {
        const onLoadedMetadata = () => {
          videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          videoElement.removeEventListener('error', onError);

          videoElement.play()
            .then(() => resolve(stream))
            .catch(playError => {
              console.error('Failed to play video:', playError);
              reject(playError);
            });
        };

        const onError = (error) => {
          videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          videoElement.removeEventListener('error', onError);
          reject(error);
        };

        videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
        videoElement.addEventListener('error', onError);

        // Timeout after 5 seconds
        setTimeout(() => {
          videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          videoElement.removeEventListener('error', onError);
          reject(new Error('Video loading timeout'));
        }, 5000);
      });
    }

    return stream;
  } catch (error) {
    console.error('Failed to start camera stream:', error);

    // Provide more specific error messages for mobile devices
    if (error.name === 'NotAllowedError') {
      throw new Error('Camera permission denied. Please allow camera access and try again.');
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      throw new Error('No camera found on this device.');
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      throw new Error('Camera is already in use by another application.');
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      throw new Error('Camera does not support the requested quality settings.');
    } else if (error.name === 'SecurityError') {
      throw new Error('Camera access blocked due to security restrictions.');
    } else if (error.name === 'AbortError') {
      throw new Error('Camera access was interrupted.');
    }

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