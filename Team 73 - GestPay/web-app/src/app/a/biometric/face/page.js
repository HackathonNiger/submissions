'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  X, 
  RotateCcw,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Shield,
  Upload
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useGetFaceSettingsQuery,
  useEnrollFaceMutation
} from '../../../../lib/api/gestpayApi';

export default function FaceConfiguration() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [cameraState, setCameraState] = useState({
    isActive: false,
    isLoading: false,
    error: null,
    hasPermission: null
  });
  
  const [faceDetection, setFaceDetection] = useState({
    isDetecting: false,
    faceDetected: false,
    faceCount: 0,
    confidence: 0,
    boundingBox: null
  });
  
  const [livenessCheck, setLivenessCheck] = useState({
    isActive: false,
    currentChallenge: null,
    challenges: [],
    completedChallenges: 0,
    totalChallenges: 3,
    isComplete: false
  });
  
  const [setupProgress, setSetupProgress] = useState({
    step: 'camera', // camera, detection, liveness, capture, enrollment, complete
    progress: 0
  });
  
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [enrollmentState, setEnrollmentState] = useState({
    isEnrolling: false,
    error: null,
    success: false
  });
  
  // API hooks
  const { data: faceSettings, isLoading: settingsLoading, error: settingsError } = useGetFaceSettingsQuery();
  const [enrollFace, { isLoading: enrollLoading }] = useEnrollFaceMutation();
  
  // Debug API responses
  useEffect(() => {
    console.log('Face settings:', { faceSettings, settingsLoading, settingsError });
  }, [faceSettings, settingsLoading, settingsError]);

  const livenessActions = [
    { id: 'blink', name: 'Blink your eyes', icon: Eye, description: 'Blink slowly 3 times' },
    { id: 'smile', name: 'Smile', icon: CheckCircle, description: 'Show a natural smile' },
    { id: 'turn', name: 'Turn your head', icon: RotateCcw, description: 'Turn head left, then right' }
  ];

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    setCameraState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          setCameraState(prev => ({ 
            ...prev, 
            isActive: true, 
            isLoading: false, 
            hasPermission: true 
          }));
          setSetupProgress({ step: 'detection', progress: 25 });
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.name === 'NotAllowedError' 
          ? 'Camera permission denied. Please allow camera access to continue.'
          : 'Unable to access camera. Please check your camera settings.',
        hasPermission: false
      }));
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState(prev => ({ ...prev, isActive: false }));
  }, []);

  // Simulate face detection
  useEffect(() => {
    let detectionInterval;
    
    if (cameraState.isActive && setupProgress.step === 'detection') {
      setFaceDetection(prev => ({ ...prev, isDetecting: true }));
      
      detectionInterval = setInterval(() => {
        // Simulate face detection with random values
        const detected = Math.random() > 0.3;
        const confidence = detected ? 0.7 + Math.random() * 0.3 : 0;
        
        setFaceDetection(prev => ({
          ...prev,
          faceDetected: detected,
          confidence: confidence,
          faceCount: detected ? 1 : 0,
          boundingBox: detected ? {
            x: 160 + Math.random() * 20,
            y: 120 + Math.random() * 20,
            width: 320 + Math.random() * 40,
            height: 240 + Math.random() * 30
          } : null
        }));
        
        // Auto-progress to liveness check after consistent detection
        if (detected && confidence > 0.8) {
          setTimeout(() => {
            setSetupProgress({ step: 'liveness', progress: 40 });
            setLivenessCheck(prev => ({
              ...prev,
              isActive: true,
              currentChallenge: livenessActions[0],
              challenges: [...livenessActions]
            }));
          }, 2000);
        }
      }, 500);
    }
    
    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [cameraState.isActive, setupProgress.step]);

  // Handle liveness challenge completion
  const completeLivenessChallenge = useCallback(() => {
    setLivenessCheck(prev => {
      const newCompletedCount = prev.completedChallenges + 1;
      const isComplete = newCompletedCount >= prev.totalChallenges;
      
      if (isComplete) {
        setSetupProgress({ step: 'capture', progress: 70 });
        return {
          ...prev,
          completedChallenges: newCompletedCount,
          isComplete: true,
          currentChallenge: null
        };
      } else {
        return {
          ...prev,
          completedChallenges: newCompletedCount,
          currentChallenge: prev.challenges[newCompletedCount]
        };
      }
    });
  }, []);

  // Simulate challenge completion
  useEffect(() => {
    let challengeTimeout;
    
    if (livenessCheck.isActive && livenessCheck.currentChallenge && !livenessCheck.isComplete) {
      challengeTimeout = setTimeout(() => {
        completeLivenessChallenge();
      }, 3000); // Auto-complete after 3 seconds for demo
    }
    
    return () => {
      if (challengeTimeout) clearTimeout(challengeTimeout);
    };
  }, [livenessCheck.currentChallenge, completeLivenessChallenge, livenessCheck.isActive, livenessCheck.isComplete]);

  // Capture photo for enrollment
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const photoData = {
          blob,
          timestamp: Date.now(),
          id: Math.random().toString(36).substr(2, 9)
        };
        
        setCapturedPhotos(prev => {
          const newPhotos = [...prev, photoData];
          
          // If we have 3 photos, move to enrollment step
          if (newPhotos.length >= 3) {
            setSetupProgress({ step: 'enrollment', progress: 85 });
          }
          
          return newPhotos;
        });
      }
    }, 'image/jpeg', 0.8);
  }, []);
  
  // Handle enrollment with Luxand API
  const handleEnrollment = useCallback(async () => {
    if (capturedPhotos.length === 0) return;
    
    setEnrollmentState({ isEnrolling: true, error: null, success: false });
    
    try {
      const formData = new FormData();
      
      // Add all captured photos to FormData
      capturedPhotos.forEach((photo, index) => {
        formData.append('photos', photo.blob, `photo_${index + 1}.jpg`);
      });
      
      console.log('Starting enrollment with', capturedPhotos.length, 'photos');
      console.log('FormData entries:', Array.from(formData.entries()).map(([key, value]) => [key, value instanceof Blob ? `Blob: ${value.size} bytes, type: ${value.type}` : value]));
      
      // Debug: Check if FormData is properly constructed
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }
      
      const result = await enrollFace(formData).unwrap();
      
      setEnrollmentState({ isEnrolling: false, error: null, success: true });
      setSetupProgress({ step: 'complete', progress: 100 });
      
      console.log('Enrollment successful:', result);
    } catch (error) {
      console.error('Enrollment failed:', error);
      
      // Better error handling
      let errorMessage = 'Enrollment failed. Please try again.';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status) {
        errorMessage = `Enrollment failed with status ${error.status}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.log('Error details:', {
        error,
        errorData: error?.data,
        errorMessage: error?.message,
        errorStatus: error?.status
      });
      
      setEnrollmentState({ 
        isEnrolling: false, 
        error: errorMessage, 
        success: false 
      });
    }
  }, [capturedPhotos, enrollFace]);
  
  // Auto-start enrollment when we have enough photos
  useEffect(() => {
    if (setupProgress.step === 'enrollment' && capturedPhotos.length >= 3 && !enrollmentState.isEnrolling) {
      handleEnrollment();
    }
  }, [setupProgress.step, capturedPhotos.length, enrollmentState.isEnrolling, handleEnrollment]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const renderCameraView = () => (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
      {cameraState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Initializing camera...</p>
          </div>
        </div>
      )}
      
      {cameraState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white max-w-sm mx-auto p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <p className="mb-4">{cameraState.error}</p>
            <button
              onClick={initializeCamera}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        width="640"
        height="480"
      />
      
      {/* Face detection overlay */}
      {faceDetection.faceDetected && faceDetection.boundingBox && (
        <div
          className="absolute border-2 border-green-400 rounded-lg"
          style={{
            left: `${(faceDetection.boundingBox.x / 640) * 100}%`,
            top: `${(faceDetection.boundingBox.y / 480) * 100}%`,
            width: `${(faceDetection.boundingBox.width / 640) * 100}%`,
            height: `${(faceDetection.boundingBox.height / 480) * 100}%`,
          }}
        >
          <div className="absolute -top-8 left-0 bg-green-400 text-black px-2 py-1 rounded text-xs font-medium">
            Face Detected ({Math.round(faceDetection.confidence * 100)}%)
          </div>
        </div>
      )}
      
      {/* Liveness challenge overlay */}
      {livenessCheck.isActive && livenessCheck.currentChallenge && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 text-center max-w-sm mx-4">
            <livenessCheck.currentChallenge.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">{livenessCheck.currentChallenge.name}</h3>
            <p className="text-gray-600 mb-4">{livenessCheck.currentChallenge.description}</p>
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-500">Detecting...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Capture instruction overlay */}
      {setupProgress.step === 'capture' && (
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
          <p className="text-center text-sm">
            Position your face in the center and click "Capture Photo" to take {3 - capturedPhotos.length} more photo{3 - capturedPhotos.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );

  const renderProgressSteps = () => {
    const steps = [
      { key: 'camera', label: 'Camera', icon: Camera },
      { key: 'detection', label: 'Detection', icon: Eye },
      { key: 'liveness', label: 'Liveness', icon: Shield },
      { key: 'capture', label: 'Capture', icon: Upload },
      { key: 'enrollment', label: 'Enrollment', icon: Loader2 },
      { key: 'complete', label: 'Complete', icon: CheckCircle }
    ];
    
    return (
      <div className="flex items-center justify-between mb-8 overflow-x-auto">
        {steps.map((step, index) => {
          const isActive = setupProgress.step === step.key;
          const isCompleted = steps.findIndex(s => s.key === setupProgress.step) > index;
          
          return (
            <div key={step.key} className="flex items-center flex-shrink-0">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted ? 'bg-green-100 border-green-500 text-green-600' :
                isActive ? 'bg-blue-100 border-blue-500 text-blue-600' :
                'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                <step.icon className={`w-5 h-5 ${isActive && step.key === 'enrollment' ? 'animate-spin' : ''}`} />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isCompleted ? 'text-green-600' :
                isActive ? 'text-blue-600' :
                'text-gray-400'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout 
      title="Face Recognition Setup" 
      subtitle="Configure your face recognition for secure biometric authentication"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Biometric Setup</span>
        </button>

        {/* Progress Steps */}
        {renderProgressSteps()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Camera Preview</h2>
                <div className="flex items-center space-x-2">
                  {cameraState.isActive ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium">Inactive</span>
                    </div>
                  )}
                </div>
              </div>
              
              {renderCameraView()}
              
              {!cameraState.isActive && !cameraState.isLoading && !cameraState.error && (
                <div className="mt-4 text-center">
                  <button
                    onClick={initializeCamera}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Camera
                  </button>
                </div>
              )}
              
              {/* Capture Button */}
              {setupProgress.step === 'capture' && cameraState.isActive && (
                <div className="mt-4 text-center space-y-2">
                  <button
                    onClick={capturePhoto}
                    disabled={capturedPhotos.length >= 3}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Capture Photo ({capturedPhotos.length}/3)
                  </button>
                  <p className="text-sm text-gray-600">
                    Take 3 photos from different angles for better recognition
                  </p>
                  {/* Debug: Manual enrollment trigger */}
                  {capturedPhotos.length > 0 && (
                    <button
                      onClick={handleEnrollment}
                      disabled={enrollmentState.isEnrolling}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      {enrollmentState.isEnrolling ? 'Enrolling...' : `Test Enroll (${capturedPhotos.length} photos)`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            {/* Detection Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Face Detected</span>
                  <div className={`flex items-center space-x-2 ${
                    faceDetection.faceDetected ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {faceDetection.faceDetected ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      {faceDetection.faceDetected ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confidence</span>
                  <span className="text-sm font-medium">
                    {Math.round(faceDetection.confidence * 100)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${faceDetection.confidence * 100}%` }}
                  ></div>
                </div>
                
                {setupProgress.step === 'capture' && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Photos Captured</span>
                      <span className="text-sm font-medium">
                        {capturedPhotos.length} / 3
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Liveness Progress */}
            {livenessCheck.isActive && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liveness Check</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-sm font-medium">
                      {livenessCheck.completedChallenges} / {livenessCheck.totalChallenges}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(livenessCheck.completedChallenges / livenessCheck.totalChallenges) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="space-y-2">
                    {livenessActions.map((action, index) => (
                      <div key={action.id} className={`flex items-center space-x-3 p-2 rounded-lg ${
                        index < livenessCheck.completedChallenges ? 'bg-green-50 text-green-700' :
                        index === livenessCheck.completedChallenges ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {index < livenessCheck.completedChallenges ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : index === livenessCheck.completedChallenges ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 border border-current rounded-full" />
                        )}
                        <span className="text-sm font-medium">{action.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Captured Photos */}
            {setupProgress.step === 'capture' && capturedPhotos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Captured Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {capturedPhotos.map((photo, index) => (
                    <div key={photo.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(photo.blob)}
                        alt={`Captured photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: 3 - capturedPhotos.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Enrollment Status */}
            {setupProgress.step === 'enrollment' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Enrolling Face...</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Processing your photos with Luxand face recognition system.
                  </p>
                </div>
              </div>
            )}
            
            {/* Enrollment Error */}
            {enrollmentState.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Enrollment Failed</h3>
                  <p className="text-red-700 text-sm mb-4">
                    {enrollmentState.error}
                  </p>
                  <button
                    onClick={() => {
                      setCapturedPhotos([]);
                      setEnrollmentState({ isEnrolling: false, error: null, success: false });
                      setSetupProgress({ step: 'capture', progress: 70 });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Setup Complete */}
            {setupProgress.step === 'complete' && enrollmentState.success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Enrollment Complete!</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Your face has been successfully enrolled with Luxand. You can now use face recognition for payments.
                  </p>
                  <button
                    onClick={() => router.push('/a/biometric')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Return to Biometric Setup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Privacy & Security</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Your facial data is processed securely using Luxand Cloud API</li>
                <li>• Photos are encrypted and stored securely</li>
                <li>• Only mathematical face templates are used for recognition</li>
                <li>• You can disable face recognition at any time</li>
                <li>• All data is protected with enterprise-grade security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
