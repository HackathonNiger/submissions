import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, Check, SwitchCamera } from 'lucide-react';
import {
  startCameraStream,
  stopCameraStream,
  capturePhoto,
  checkCameraAvailability
} from '../utils/cameraUtils';

const CameraModal = ({ isOpen, onClose, onCapture, title = "Take Photo" }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [hasPermission, setHasPermission] = useState(null);

  // Initialize camera when modal opens or facing mode changes
  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    }

    return () => {
      if (stream) {
        stopCameraStream(stream);
        setStream(null);
      }
    };
  }, [isOpen, facingMode]);

  const initializeCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check camera availability first
      const availability = await checkCameraAvailability();

      if (!availability.available) {
        setError(availability.error || 'Camera not available');
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      // Start camera stream
      const cameraStream = await startCameraStream(videoRef.current, facingMode);
      setStream(cameraStream);
      setHasPermission(true);
    } catch (err) {
      console.error('Camera initialization error:', err);

      // Provide more user-friendly error messages
      let userFriendlyError = err.message || 'Failed to access camera';

      if (err.message.includes('permission') || err.message.includes('denied')) {
        userFriendlyError = 'Camera permission required. Please allow camera access in your browser settings and try again.';
      } else if (err.message.includes('not found') || err.message.includes('No camera')) {
        userFriendlyError = 'No camera detected on this device.';
      } else if (err.message.includes('in use') || err.message.includes('already')) {
        userFriendlyError = 'Camera is being used by another app. Please close other camera apps and try again.';
      } else if (err.message.includes('timeout')) {
        userFriendlyError = 'Camera is taking too long to load. Please check your camera and try again.';
      }

      setError(userFriendlyError);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  const handleCapture = async () => {
    if (!videoRef.current) {
      setError('Camera not ready. Please wait and try again.');
      return;
    }

    try {
      setIsLoading(true);
      const photoFile = await capturePhoto(videoRef.current);

      // Stop camera stream after capture
      if (stream) {
        stopCameraStream(stream);
        setStream(null);
      }

      onCapture(photoFile);
      onClose();
    } catch (err) {
      console.error('Capture error:', err);

      // Provide more specific error messages for capture failures
      let captureError = 'Failed to capture photo';

      if (err.message.includes('not ready') || err.message.includes('Video not ready')) {
        captureError = 'Camera not ready. Please wait a moment and try again.';
      } else if (err.message.includes('too small')) {
        captureError = 'Image captured is too small. Please ensure good lighting and try again.';
      } else if (err.message.includes('data not ready')) {
        captureError = 'Camera not fully loaded. Please wait and try again.';
      } else if (err.message.includes('Canvas')) {
        captureError = 'Unable to process image. Please check your camera settings.';
      }

      setError(captureError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleRetry = () => {
    initializeCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Camera area */}
        <div className="relative bg-black aspect-square">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                <p>Initializing camera...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-center p-6">
                <div className="text-red-400 mb-4">
                  <Camera size={48} />
                </div>
                <p className="mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {hasPermission && !error && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Camera controls overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
                <button
                  onClick={handleSwitchCamera}
                  className="bg-white bg-opacity-20 text-black p-3 rounded-full hover:bg-opacity-30 transition-all"
                  title="Switch Camera"
                >
                  <SwitchCamera size={24} />
                </button>

                <button
                  onClick={handleCapture}
                  disabled={isLoading}
                  className="bg-white text-black p-4 rounded-full hover:bg-gray-100 transition-all disabled:opacity-50"
                  title="Take Photo"
                >
                  <Camera size={24} />
                </button>

                <div className="w-12" /> {/* Spacer for centering */}
              </div>
            </>
          )}
        </div>

        {/* Footer instructions */}
        {!error && hasPermission && (
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              Position the QR code or text within the frame and tap the camera button
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
