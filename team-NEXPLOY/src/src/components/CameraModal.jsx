import { useState, useRef, useEffect } from 'react';
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

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      // Clean up when modal closes
      if (stream) {
        stopCameraStream(stream);
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stopCameraStream(stream);
      }
    };
  }, [isOpen, facingMode]);

  const initializeCamera = async () => {
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
      setError(err.message || 'Failed to access camera');
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;

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
      setError('Failed to capture photo');
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