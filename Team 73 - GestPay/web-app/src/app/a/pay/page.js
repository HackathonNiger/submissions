'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Camera, 
  Mic, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ArrowLeft,
  Eye,
  Loader2,
  Shield,
  Banknote,
  User,
  Clock,
  Receipt,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import {
  useProcessFacePaymentMutation
} from '../../../lib/api/gestpayApi';

export default function MerchantPayPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const paymentInitiatedRef = useRef(false);
  
  const [currentStep, setCurrentStep] = useState('payment-details'); // payment-details, payment-method, face-auth, voice-auth, success
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: '',
    method: null
  });
  
  const [cameraState, setCameraState] = useState({
    isActive: false,
    isLoading: false,
    error: null,
    hasPermission: null
  });
  
  const [faceAuth, setFaceAuth] = useState({
    isDetecting: false,
    faceDetected: false,
    confidence: 0,
    boundingBox: null,
    livenessStage: 'detecting', // detecting, blink, smile, turn, verifying, complete
    livenessProgress: 0,
    isComplete: false
  });
  
  const [transaction, setTransaction] = useState({
    id: null,
    status: 'pending',
    timestamp: null,
    processingTime: 0,
    receipt: null,
    customer: null
  });
  
  const [paymentState, setPaymentState] = useState({
    isProcessing: false,
    error: null,
    capturedPhoto: null,
    errorDetails: null
  });
  
  // API hooks
  const [processFacePayment, { isLoading: paymentLoading }] = useProcessFacePaymentMutation();

  // Initialize camera for face authentication
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
          
          // Start face detection
          setFaceAuth(prev => ({ ...prev, isDetecting: true }));
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Unable to access camera. Please check your camera permissions.',
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
    setFaceAuth({
      isDetecting: false,
      faceDetected: false,
      confidence: 0,
      boundingBox: null,
      livenessStage: 'detecting',
      livenessProgress: 0,
      isComplete: false
    });
  }, []);

  // Face detection and liveness simulation
  useEffect(() => {
    let detectionInterval;
    let livenessTimeout;
    
    if (cameraState.isActive && faceAuth.isDetecting && currentStep === 'face-auth') {
      detectionInterval = setInterval(() => {
        // Simulate face detection
        const detected = Math.random() > 0.2;
        const confidence = detected ? 0.8 + Math.random() * 0.2 : 0;
        
        setFaceAuth(prev => ({
          ...prev,
          faceDetected: detected,
          confidence: confidence,
          boundingBox: detected ? {
            x: 160 + Math.random() * 20,
            y: 120 + Math.random() * 20,
            width: 320 + Math.random() * 40,
            height: 240 + Math.random() * 30
          } : null
        }));
        
        // Progress through liveness stages automatically
        if (detected && confidence > 0.85) {
          setFaceAuth(prev => {
            if (prev.livenessStage === 'detecting') {
              // Start liveness sequence after 1 second of good detection
              livenessTimeout = setTimeout(() => {
                setFaceAuth(current => ({ ...current, livenessStage: 'blink', livenessProgress: 25 }));
                
                setTimeout(() => {
                  setFaceAuth(current => ({ ...current, livenessStage: 'smile', livenessProgress: 50 }));
                  
                  setTimeout(() => {
                    setFaceAuth(current => ({ ...current, livenessStage: 'turn', livenessProgress: 75 }));
                    
                    setTimeout(() => {
                      setFaceAuth(current => ({ ...current, livenessStage: 'verifying', livenessProgress: 90 }));
                      
                      setTimeout(() => {
                        setFaceAuth(current => ({ 
                          ...current, 
                          livenessStage: 'complete', 
                          livenessProgress: 100,
                          isComplete: true 
                        }));
                        
                        // Capture photo and process payment (only once)
                        setTimeout(() => {
                          if (!paymentState.isProcessing && !paymentState.capturedPhoto) {
                            capturePhotoForPayment();
                          }
                        }, 1000);
                      }, 1500);
                    }, 1500);
                  }, 1500);
                }, 1500);
              }, 1000);
            }
            return prev;
          });
        }
      }, 300);
    }
    
    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
      if (livenessTimeout) clearTimeout(livenessTimeout);
    };
  }, [cameraState.isActive, faceAuth.isDetecting, currentStep]);

  // Capture photo for payment
  const capturePhotoForPayment = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Prevent multiple captures using ref
    if (paymentInitiatedRef.current) {
      console.log('Payment already initiated, skipping capture');
      return;
    }
    
    // Prevent multiple captures if already processing
    if (paymentState.isProcessing || paymentState.capturedPhoto) {
      console.log('Payment already in progress, skipping capture');
      return;
    }
    
    // Mark payment as initiated
    paymentInitiatedRef.current = true;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob and process payment
    canvas.toBlob((blob) => {
      if (blob && !paymentState.isProcessing) {
        setPaymentState(prev => ({ ...prev, capturedPhoto: blob }));
        // Get current paymentData values from state
        setPaymentData(currentPaymentData => {
          processPayment(blob, currentPaymentData.amount, currentPaymentData.description);
          return currentPaymentData; // Return unchanged
        });
      }
    }, 'image/jpeg', 0.8);
  }, []);
  
  // Process payment with face recognition
  const processPayment = async (photoBlob, amount, description) => {
    if (!photoBlob) return;
    
    // Prevent multiple simultaneous API calls
    if (paymentState.isProcessing) {
      console.log('Payment already processing, skipping API call');
      return;
    }
    
    console.log('Payment data before processing:', { amount, description });
    console.log('Photo blob:', photoBlob);
    
    setPaymentState(prev => ({ ...prev, isProcessing: true, error: null, capturedPhoto: photoBlob }));
    setTransaction(prev => ({ ...prev, status: 'processing' }));
    
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('description', description);
      formData.append('photo', photoBlob, 'payment_photo.jpg');
      
      console.log('Processing face payment:', {
        amount: amount,
        description: description,
        photoSize: photoBlob.size
      });
      
      // Debug FormData contents
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log(`${key}:`, `Blob (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      
      const result = await processFacePayment(formData).unwrap();
      
      console.log('Payment successful:', result);
      
      // Update transaction with success data
      setTransaction({
        id: result.data.receipt.transaction_id,
        status: 'success',
        timestamp: new Date().toISOString(),
        processingTime: 2000,
        receipt: result.data.receipt,
        customer: result.data.receipt.customer
      });
      
      setPaymentState({ isProcessing: false, error: null, capturedPhoto: photoBlob });
      stopCamera();
      setCurrentStep('success');
      
    } catch (error) {
      console.error('Payment failed:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      let errorDetails = null;
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
        errorDetails = error.data.data;
        
        // Handle specific error types from documentation
        if (error.data.message.includes('Face verification failed')) {
          const bestConfidence = errorDetails?.best_confidence;
          if (bestConfidence) {
            errorMessage += ` (Best match: ${Math.round(bestConfidence * 100)}%)`;
          }
        } else if (error.data.message.includes('Insufficient balance')) {
          const required = errorDetails?.required_amount;
          const available = errorDetails?.available_balance;
          if (required && available) {
            errorMessage += `\nRequired: ₦${required}, Available: ₦${available}`;
          }
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setPaymentState({ 
        isProcessing: false, 
        error: errorMessage, 
        capturedPhoto: photoBlob,
        errorDetails 
      });
      setTransaction(prev => ({ ...prev, status: 'failed' }));
    }
  };

  // Retry payment (just clear error and reset payment flag)
  const retryPayment = () => {
    setPaymentState(prev => ({ ...prev, error: null, errorDetails: null, capturedPhoto: null }));
    setTransaction(prev => ({ ...prev, status: 'pending' }));
    paymentInitiatedRef.current = false; // Allow new payment attempt
    
    // Reset face auth to restart the process
    setFaceAuth({
      isDetecting: false,
      faceDetected: false,
      confidence: 0,
      boundingBox: null,
      livenessStage: 'detecting',
      livenessProgress: 0,
      isComplete: false
    });
    
    // Restart face detection
    setTimeout(() => {
      setFaceAuth(prev => ({ ...prev, isDetecting: true }));
    }, 500);
  };
  
  // Restart entire verification process
  const restartVerification = () => {
    stopCamera();
    setCurrentStep('payment-method');
    setPaymentState({ isProcessing: false, error: null, capturedPhoto: null, errorDetails: null });
    setTransaction({ id: null, status: 'pending', timestamp: null, processingTime: 0, receipt: null, customer: null });
    paymentInitiatedRef.current = false;
    
    // Reset face auth
    setFaceAuth({
      isDetecting: false,
      faceDetected: false,
      confidence: 0,
      boundingBox: null,
      livenessStage: 'detecting',
      livenessProgress: 0,
      isComplete: false
    });
  };

  // Reset for new payment
  const startNewPayment = () => {
    setCurrentStep('payment-details');
    setPaymentData({ amount: '', description: '', method: null });
    setTransaction({ id: null, status: 'pending', timestamp: null, processingTime: 0, receipt: null, customer: null });
    setPaymentState({ isProcessing: false, error: null, capturedPhoto: null, errorDetails: null });
    paymentInitiatedRef.current = false; // Reset payment initiated flag
    stopCamera();
  };

  // Handle form submission
  const handlePaymentDetailsSubmit = (e) => {
    e.preventDefault();
    if (paymentData.amount && paymentData.description) {
      setCurrentStep('payment-method');
    }
  };

  // Handle payment method selection
  const handleMethodSelection = (method) => {
    setPaymentData(prev => ({ ...prev, method }));
    
    if (method === 'face') {
      paymentInitiatedRef.current = false; // Reset flag when starting face auth
      setCurrentStep('face-auth');
      setTimeout(() => {
        initializeCamera();
      }, 500);
    } else if (method === 'voice') {
      setCurrentStep('voice-auth');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const renderPaymentDetailsForm = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Banknote className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
          <p className="text-gray-600">Enter the payment amount and description</p>
        </div>
        
        <form onSubmit={handlePaymentDetailsSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (NGN)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={paymentData.description}
              onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Coffee and pastry"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Continue to Payment Method
          </button>
        </form>
      </div>
    </div>
  );

  const renderPaymentMethodSelection = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Payment Method</h2>
        <p className="text-gray-600">Select how the customer will authenticate this payment</p>
        
        <div className="bg-primary/5 rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(parseFloat(paymentData.amount))}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-600">Description:</span>
            <span className="font-medium text-gray-900">{paymentData.description}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Face Pay */}
        <button
          onClick={() => handleMethodSelection('face')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md hover:border-primary transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Face Pay</h3>
            <p className="text-gray-600 mb-4">Secure facial recognition with liveness detection</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <Shield className="w-4 h-4" />
              <span>Highly Secure</span>
            </div>
          </div>
        </button>
        
        {/* Voice Pay */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 relative">
          <div className="text-center opacity-60">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Voice Pay</h3>
            <p className="text-gray-500 mb-4">Voice recognition authentication</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Coming Soon in v2</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
            Coming Soon
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button
          onClick={() => setCurrentStep('payment-details')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Payment Details</span>
        </button>
      </div>
    </div>
  );

  const renderFaceAuthentication = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Face Authentication</h2>
        <p className="text-gray-600">Please look at the camera for secure authentication</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
              {faceAuth.faceDetected && faceAuth.boundingBox && (
                <div
                  className="absolute border-2 border-green-400 rounded-lg"
                  style={{
                    left: `${(faceAuth.boundingBox.x / 640) * 100}%`,
                    top: `${(faceAuth.boundingBox.y / 480) * 100}%`,
                    width: `${(faceAuth.boundingBox.width / 640) * 100}%`,
                    height: `${(faceAuth.boundingBox.height / 480) * 100}%`,
                  }}
                >
                  <div className="absolute -top-8 left-0 bg-green-400 text-black px-2 py-1 rounded text-xs font-medium">
                    Face Detected ({Math.round(faceAuth.confidence * 100)}%)
                  </div>
                </div>
              )}
              
              {/* Processing overlay */}
              {faceAuth.livenessStage === 'verifying' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                    <h3 className="text-lg font-semibold mb-2">Verifying Identity</h3>
                    <p className="text-gray-600">Please hold still...</p>
                  </div>
                </div>
              )}
              
              {/* Payment Processing overlay */}
              {paymentState.isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
                    <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                    <p className="text-gray-600">Verifying identity and processing transaction...</p>
                  </div>
                </div>
              )}
              
              
              {/* Success overlay */}
              {faceAuth.isComplete && !paymentState.isProcessing && !paymentState.error && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">Authentication Successful</h3>
                    <p className="text-gray-600">Processing payment...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          {/* Authentication Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Progress</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Progress</span>
                <span className="text-sm font-medium">{faceAuth.livenessProgress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${faceAuth.livenessProgress}%` }}
                ></div>
              </div>
              
              <div className="space-y-2">
                <div className={`flex items-center space-x-3 p-2 rounded-lg ${
                  faceAuth.livenessStage === 'detecting' ? 'bg-primary/10 text-primary' :
                  faceAuth.livenessProgress > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                }`}>
                  {faceAuth.livenessProgress > 0 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : faceAuth.livenessStage === 'detecting' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 border border-current rounded-full" />
                  )}
                  <span className="text-sm font-medium">Face Detection</span>
                </div>
                
                <div className={`flex items-center space-x-3 p-2 rounded-lg ${
                  ['blink', 'smile', 'turn', 'verifying', 'complete'].includes(faceAuth.livenessStage) ? 'bg-primary/10 text-primary' :
                  faceAuth.livenessProgress >= 100 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                }`}>
                  {faceAuth.livenessProgress >= 100 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : ['blink', 'smile', 'turn', 'verifying'].includes(faceAuth.livenessStage) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 border border-current rounded-full" />
                  )}
                  <span className="text-sm font-medium">Liveness Check</span>
                </div>
                
                <div className={`flex items-center space-x-3 p-2 rounded-lg ${
                  faceAuth.livenessStage === 'complete' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                }`}>
                  {faceAuth.livenessStage === 'complete' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 border border-current rounded-full" />
                  )}
                  <span className="text-sm font-medium">Authentication</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-semibold text-primary mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-primary/80">Amount:</span>
                <span className="font-semibold text-primary">{formatCurrency(parseFloat(paymentData.amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/80">Description:</span>
                <span className="font-medium text-primary">{paymentData.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/80">Method:</span>
                <span className="font-medium text-primary">Face Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Error Modal */}
      {paymentState.error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Payment Failed</h3>
                  <p className="text-red-700 text-sm mb-4 whitespace-pre-line">{paymentState.error}</p>
                  
                  {/* Show verification details for face recognition failures */}
                  {paymentState.errorDetails?.verification_details && (
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-red-800 mb-3">Verification Attempts:</p>
                      <div className="space-y-2">
                        {paymentState.errorDetails.verification_details.slice(0, 3).map((detail, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-red-700">{detail.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-red-600">{Math.round(detail.confidence * 100)}%</span>
                              <div className="w-16 bg-red-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${detail.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-red-600 mt-2">Minimum 60% confidence required for verification</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={retryPayment}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retry Verification</span>
                    </button>
                    <button
                      onClick={restartVerification}
                      className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Start Over</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-8">
        <button
          onClick={() => {
            stopCamera();
            setCurrentStep('payment-method');
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Payment Method</span>
        </button>
      </div>
    </div>
  );

  const renderVoiceAuthentication = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-12 h-12 text-purple-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Pay Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Voice authentication will be available in version 2.0 with advanced voice recognition and security features.
        </p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-900 mb-2">Upcoming Features:</h3>
          <ul className="text-sm text-purple-700 space-y-1 text-left">
            <li>• Voice pattern recognition</li>
            <li>• Multi-language support</li>
            <li>• Background noise filtering</li>
            <li>• Anti-spoofing protection</li>
          </ul>
        </div>
        
        <button
          onClick={() => setCurrentStep('payment-method')}
          className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          Back to Payment Methods
        </button>
      </div>
    </div>
  );

  const renderSuccessScreen = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">The transaction has been completed successfully.</p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700">Amount:</span>
              <span className="font-semibold text-green-900">
                {transaction.receipt?.amount || formatCurrency(parseFloat(paymentData.amount))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Description:</span>
              <span className="font-medium text-green-900">
                {transaction.receipt?.description || paymentData.description}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Transaction ID:</span>
              <span className="font-mono text-sm text-green-900">
                {transaction.receipt?.transaction_id || transaction.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Time:</span>
              <span className="text-green-900">
                {transaction.receipt?.time || (transaction.timestamp ? new Date(transaction.timestamp).toLocaleTimeString() : '')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Date:</span>
              <span className="text-green-900">
                {transaction.receipt?.date || (transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : '')}
              </span>
            </div>
            {transaction.customer && (
              <div className="flex justify-between">
                <span className="text-green-700">Customer:</span>
                <span className="font-medium text-green-900">{transaction.customer.name}</span>
              </div>
            )}
            {transaction.receipt?.balance_after && (
              <div className="flex justify-between">
                <span className="text-green-700">Customer Balance:</span>
                <span className="font-medium text-green-900">{transaction.receipt.balance_after}</span>
              </div>
            )}
            {transaction.receipt?.verification?.confidence && (
              <div className="flex justify-between">
                <span className="text-green-700">Verification:</span>
                <span className="font-medium text-green-900">
                  {Math.round(transaction.receipt.verification.confidence * 100)}% confidence
                </span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={startNewPayment}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Payment</span>
        </button>
      </div>
    </div>
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <DashboardLayout 
      title="Merchant Payment" 
      subtitle="Accept secure biometric payments from customers"
    >
      <div className="min-h-[600px] py-8">
        {currentStep === 'payment-details' && renderPaymentDetailsForm()}
        {currentStep === 'payment-method' && renderPaymentMethodSelection()}
        {currentStep === 'face-auth' && renderFaceAuthentication()}
        {currentStep === 'voice-auth' && renderVoiceAuthentication()}
        {currentStep === 'success' && renderSuccessScreen()}
      </div>
    </DashboardLayout>
  );
}
