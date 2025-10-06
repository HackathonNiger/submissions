import { useState, useRef } from 'react';
import nafdacData from '../data/nafdac.json';
import jsQR from 'jsqr';
import { createWorker } from 'tesseract.js';

const useVerification = () => {
  const [verificationMethod, setVerificationMethod] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [manualInput, setManualInput] = useState({ nafdacNo: '', batchNo: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Search function for product lookup
  const searchProducts = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const results = nafdacData.filter(item =>
      item['Product Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item['Nafdac Reg. Number'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item['Active Ingredients'] && item['Active Ingredients'].toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort by relevance (prioritize product name matches)
    const sortedResults = results.sort((a, b) => {
      const aName = a['Product Name'].toLowerCase().indexOf(searchTerm.toLowerCase());
      const bName = b['Product Name'].toLowerCase().indexOf(searchTerm.toLowerCase());

      if (aName === 0 && bName !== 0) return -1;
      if (bName === 0 && aName !== 0) return 1;

      return a['Product Name'].localeCompare(b['Product Name']);
    });

    return sortedResults.slice(0, 15); // Limit to 15 results for better UX
  };


  // Verification function
  const verifyMedicine = (searchTerm, searchType) => {
    try {
      setIsProcessing(true);

      try {
        let result = null;

        if (searchType === 'qrCode') {
          // QR codes are not available in the real data
          setVerificationResult({ status: 'qr_not_found' });
          setIsProcessing(false);
          return;
        } else if (searchType === 'nafdac') {
          result = nafdacData.find(item =>
            item['Nafdac Reg. Number'].toLowerCase() === searchTerm.toLowerCase()
          );
        } else if (searchType === 'batch') {
          // Batch numbers are not available in the real data
          setVerificationResult({ status: 'batch_not_found' });
          setIsProcessing(false);
          return;
        } else if (searchType === 'ocr') {
          // Simulate OCR extraction - search for NAFDAC number in text
          const found = nafdacData.find(item =>
            searchTerm.includes(item['Nafdac Reg. Number'])
          );
          result = found;
        }

        if (result) {
          // Since we don't have expiry dates in the real data, mark as valid
          result = {
            ...result,
            status: 'verified',
            productName: result['Product Name'],
            nafdacNo: result['Nafdac Reg. Number'],
            manufacturer: result.Manufacturer,
            activeIngredients: result['Active Ingredients'],
            approvalDate: result['Approval Date'],
            productStatus: result.Status,
            batchNo: 'N/A', // Add default batch number since not available in data
            expiryDate: 'N/A', // Add default expiry date since not available in data
            expiryStatus: { status: 'valid', daysUntilExpiry: null },
            isExpiringSoon: false,
            isExpired: false
          };
        }

        setVerificationResult(result || { status: 'not_found' });
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationResult({ status: 'verification_error' });
      } finally {
        setIsProcessing(false);
      }
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

  // Preprocess image for better OCR accuracy
  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply preprocessing: increase contrast, convert to grayscale
        ctx.filter = 'contrast(1.5) brightness(1.1)';
        ctx.drawImage(img, 0, 0);

        // Convert to grayscale for better OCR
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      };
      img.src = URL.createObjectURL(file);
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
      const processedFile = await preprocessImage(file);
      const worker = await createWorker('eng');
      const { data: { text, confidence } } = await worker.recognize(processedFile);
      await worker.terminate();

      if (text.trim() && confidence > 60) {
        // High confidence: proceed with verification
        verifyMedicine(text, 'ocr');
      } else if (text.trim() && confidence > 30) {
        // Medium confidence: show result with warning
        setVerificationResult({
          status: 'ocr_low_confidence',
          extractedText: text.trim(),
          message: 'OCR result may be inaccurate. Please verify the extracted text and try manual verification if needed.'
        });
        setIsProcessing(false);
      } else {
        // Low confidence: suggest manual input
        setVerificationResult({
          status: 'ocr_failed',
          message: 'Could not read text clearly from the image. Please try taking a clearer photo or use manual input.'
        });
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

  // Handle search input change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      const results = searchProducts(term);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Select a product from search results
  const selectProduct = (product) => {
    setVerificationResult({
      status: 'verified',
      // Map field names to match expected format
      productName: product['Product Name'],
      nafdacNo: product['Nafdac Reg. Number'],
      manufacturer: product.Manufacturer,
      activeIngredients: product['Active Ingredients'],
      approvalDate: product['Approval Date'],
      productStatus: product.Status,
      batchNo: 'N/A', // Add default batch number since not available in data
      expiryDate: 'N/A' // Add default expiry date since not available in data
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  // Reset verification
  const resetVerification = () => {
    setVerificationResult(null);
    setVerificationMethod(null);
    setManualInput({ nafdacNo: '', batchNo: '' });
    setSearchTerm('');
    setSearchResults([]);
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
    resetVerification,
    searchTerm,
    searchResults,
    handleSearchChange,
    selectProduct
  };
};

export default useVerification;