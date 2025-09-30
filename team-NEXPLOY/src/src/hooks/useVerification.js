import { useState, useRef } from 'react';
import { mockDatabase } from '../data/mockDatabase';
import jsQR from 'jsqr';
import { createWorker } from 'tesseract.js';

const useVerification = () => {
  const [verificationMethod, setVerificationMethod] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [manualInput, setManualInput] = useState({ nafdacNo: '', batchNo: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Verification function
  const verifyMedicine = (searchTerm, searchType) => {
    try {
      setIsProcessing(true);

      setTimeout(() => {
        try {
          let result = null;

          if (searchType === 'qrCode') {
            result = mockDatabase.find(item => item.qrCode === searchTerm);
          } else if (searchType === 'nafdac') {
            result = mockDatabase.find(item =>
              item.nafdacNo.toLowerCase() === searchTerm.toLowerCase()
            );
          } else if (searchType === 'batch') {
            result = mockDatabase.find(item =>
              item.batchNo.toLowerCase() === searchTerm.toLowerCase()
            );
          } else if (searchType === 'ocr') {
            // Simulate OCR extraction
            const found = mockDatabase.find(item =>
              searchTerm.includes(item.nafdacNo) || searchTerm.includes(item.batchNo)
            );
            result = found;
          }

          if (searchType === 'qrCode' && !result) {
            setVerificationResult({ status: 'qr_not_found' });
          } else {
            setVerificationResult(result || { status: 'not_found' });
          }
        } catch (error) {
          console.error('Verification error:', error);
          setVerificationResult({ status: 'verification_error' });
        } finally {
          setIsProcessing(false);
        }
      }, 1500);
    } catch (error) {
      console.error('Error starting verification:', error);
      setVerificationResult({ status: 'system_error' });
      setIsProcessing(false);
    }
  };

  // Handle QR Code scan
  const handleQRScan = async (file) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setVerificationResult({ status: 'invalid_file_type' });
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setVerificationResult({ status: 'file_too_large' });
      return;
    }

    setIsProcessing(true);

    try {
      const imageData = await loadImage(file);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        verifyMedicine(code.data, 'qrCode');
      } else {
        // No QR code found
        setVerificationResult({ status: 'qr_not_found' });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('QR scan error:', error);
      setVerificationResult({ status: 'scan_error' });
      setIsProcessing(false);
    }
  };

  // Load image file and convert to image data for jsQR
  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            resolve(imageData);
          } catch (error) {
            console.error('Image processing error:', error);
            reject(new Error('Failed to process image data'));
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Handle Image scan (OCR)
  const handleImageScan = async (file) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setVerificationResult({ status: 'invalid_file_type' });
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setVerificationResult({ status: 'file_too_large' });
      return;
    }

    setIsProcessing(true);

    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      if (text.trim()) {
        verifyMedicine(text, 'ocr');
      } else {
        setVerificationResult({ status: 'ocr_no_text' });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('OCR error:', error);
      setVerificationResult({ status: 'ocr_error' });
      setIsProcessing(false);
    }
  };

  // Handle manual verification
  const handleManualVerification = () => {
    if (manualInput.nafdacNo) {
      verifyMedicine(manualInput.nafdacNo, 'nafdac');
    } else if (manualInput.batchNo) {
      verifyMedicine(manualInput.batchNo, 'batch');
    }
  };

  // Reset verification
  const resetVerification = () => {
    setVerificationResult(null);
    setVerificationMethod(null);
    setManualInput({ nafdacNo: '', batchNo: '' });
  };

  return {
    verificationMethod,
    setVerificationMethod,
    verificationResult,
    manualInput,
    setManualInput,
    isProcessing,
    fileInputRef,
    cameraInputRef,
    handleQRScan,
    handleImageScan,
    handleManualVerification,
    resetVerification
  };
};

export default useVerification;