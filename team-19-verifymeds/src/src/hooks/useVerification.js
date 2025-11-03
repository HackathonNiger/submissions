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
      (item['Product Name'] && item['Product Name'].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.Manufacturer && item.Manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item['Nafdac Reg. Number'] && item['Nafdac Reg. Number'].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item['Active Ingredients'] && item['Active Ingredients'].toLowerCase().includes(searchTerm.toLowerCase()))
    ).filter(item => item); // Additional safety filter to remove any undefined items

    // Sort by relevance (prioritize product name matches)
    const sortedResults = results.sort((a, b) => {
      const aName = a['Product Name'] ? a['Product Name'].toLowerCase().indexOf(searchTerm.toLowerCase()) : -1;
      const bName = b['Product Name'] ? b['Product Name'].toLowerCase().indexOf(searchTerm.toLowerCase()) : -1;

      if (aName === 0 && bName !== 0) return -1;
      if (bName === 0 && aName !== 0) return 1;

      const aProductName = a['Product Name'] || '';
      const bProductName = b['Product Name'] || '';
      return aProductName.localeCompare(bProductName);
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
            item['Nafdac Reg. Number'] &&
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
            item['Nafdac Reg. Number'] && searchTerm.includes(item['Nafdac Reg. Number'])
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


  // Simplified preprocessing for better OCR accuracy
   const preprocessImageForNAFDAC = (file) => {
     return new Promise((resolve) => {
       const img = new Image();
       img.onload = () => {
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');

         // Set optimal dimensions for OCR (smaller for better performance)
         const maxWidth = 800;
         const maxHeight = 600;
         const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
         canvas.width = img.width * ratio;
         canvas.height = img.height * ratio;

         // Draw original image
         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

         // Apply minimal preprocessing for clear images
         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
         const data = imageData.data;

         // Convert to grayscale with optimized weights
         for (let i = 0; i < data.length; i += 4) {
           const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
           data[i] = data[i + 1] = data[i + 2] = gray;
         }

         // Apply slight contrast enhancement
         const contrast = 1.2;
         const brightness = 10;
         for (let i = 0; i < data.length; i += 4) {
           data[i] = Math.max(0, Math.min(255, (data[i] - 128) * contrast + 128 + brightness));
           data[i + 1] = data[i + 2] = data[i];
         }

         ctx.putImageData(imageData, 0, 0);

         canvas.toBlob(resolve, 'image/jpeg', 0.9);
       };
       img.src = URL.createObjectURL(file);
     });
   };



  // Text cleanup and normalization
  const cleanupText = (text) => {
    return text
      // Remove common OCR artifacts
      .replace(/[|lI!]/g, '1')
      .replace(/[0OQ]/g, '0')
      .replace(/[5S]/g, '5')
      .replace(/[8B]/g, '8')
      .replace(/[2Z]/g, '2')
      .replace(/[6G]/g, '6')
      .replace(/[9g]/g, '9')
      // Remove extra spaces and normalize
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Enhanced NAFDAC pattern recognition for garbled text
  const extractNAFDACNumber = (ocrText) => {
    const cleanedText = cleanupText(ocrText);
    console.log('Cleaned text:', cleanedText);

    // Common NAFDAC patterns (comprehensive for garbled text)
    const patterns = [
      // Standard patterns with various formats
      /(?:NAFDAC\s*REG\s*\.?\s*NO\s*:?\s*)?([A-Z]\d{1,2}-\d{4,})/i,
      /([A-Z]\d{1,2}-\d{4,})/g,
      /(?:REG\s*NO|REGISTRATION\s*NO|REG\.?\s*NO)\s*:?\s*([A-Z]\d{1,2}-\d{4,})/i,
      /(?:Nafdac|NAFDAC)\s*:?\s*([A-Z]\d{1,2}-\d{4,})/i,

      // Patterns for garbled OCR text - more flexible
      /([A-Z][4４４]\d{0,2}[-\s]*\d{3,4})/i,
      /([A-Z]\d{1,2}[-\s]*\d{3,})/g,
      /([A-Z][4４４5５]\d{0,2}[-\s]*\d{2,4})/gi,

      // Look for common NAFDAC prefixes followed by numbers (with OCR errors)
      /([A-Z][4４４]\s*\d{1,2}\s*[-:]*\s*\d{3,})/gi,
      /([A-Z]\d\s*[-:]*\s*\d{4,})/gi,

      // Fragmented patterns - look for letter + number combinations
      /([A-Z]\d{2,4})/g,
      /(\d{4,})/g,

      // Very loose patterns for severely garbled text
      /([A-Z][\d\s-]{4,})/gi,
      /([\d-]{5,})/g
    ];

    const candidates = [];

    for (const pattern of patterns) {
      const matches = cleanedText.match(pattern);
      if (matches) {
        console.log('Pattern matches:', matches);

        // Filter and clean matches for most likely NAFDAC format
        const validMatches = matches
          .map(match => {
            // Apply OCR error corrections
            let cleaned = match
              .replace(/[|lI!]/g, '1')
              .replace(/[0OQ]/g, '0')
              .replace(/[5S]/g, '5')
              .replace(/[8B]/g, '8')
              .replace(/[2Z]/g, '2')
              .replace(/[6G]/g, '6')
              .replace(/[9g]/g, '9')
              .replace(/\s+/g, '') // Remove spaces for processing
              .trim();

            // Check if it looks like a NAFDAC number
            if (/^[A-Z]\d{1,2}-\d{3,}$/.test(cleaned) || /^[A-Z]\d{3,}$/.test(cleaned)) {
              return cleaned;
            }

            return null;
          })
          .filter(match => match !== null);

        candidates.push(...validMatches);
      }
    }

    if (candidates.length > 0) {
      // Return the most likely candidate (prefer standard format)
      const standardFormat = candidates.find(c => /^[A-Z]\d{1,2}-\d{4,}$/.test(c));
      if (standardFormat) {
        return standardFormat;
      }

      // Otherwise return the first valid candidate
      return candidates[0];
    }

    // Try fuzzy matching for very garbled text
    return fuzzyMatchNAFDAC(cleanedText);
  };

  // Fuzzy matching for very garbled NAFDAC numbers
  const fuzzyMatchNAFDAC = (text) => {
    const upperText = text.toUpperCase();

    // Look for common NAFDAC starting patterns (including OCR errors)
    const commonStarts = [
      'A4', 'A5', 'B4', 'B5', 'C4', 'C5', 'D4', 'D5',
      // OCR error variations
      '44', '45', 'A+', 'A-', 'B+', 'B-', 'C+', 'C-'
    ];

    for (const start of commonStarts) {
      const index = upperText.indexOf(start.replace(/[+-]/g, ''));
      if (index !== -1) {
        // Extract potential number around this pattern (wider range for garbled text)
        const aroundPattern = text.substring(Math.max(0, index - 3), Math.min(text.length, index + 12));
        const cleaned = cleanupText(aroundPattern);

        // Look for number patterns with various formats
        const numberPatterns = [
          /(\d{4,})/,  // 4+ digits
          /(\d{3,4})/, // 3-4 digits
          /(\d{2,3}[-/\s]\d{2,3})/, // numbers with separators
          /(\d{3,4}[-/\s]\d{1,2})/  // numbers with separators
        ];

        for (const pattern of numberPatterns) {
          const numberMatch = cleaned.match(pattern);
          if (numberMatch) {
            // Clean up the start pattern
            let cleanStart = start.replace(/[+-]/g, '');
            if (/^\d/.test(cleanStart)) {
              // If it starts with number, try to find letter pattern nearby
              const letterMatch = aroundPattern.match(/([A-Z][4４４5５]?)/i);
              if (letterMatch) {
                cleanStart = letterMatch[1].replace(/[４４５５]/g, '4');
              }
            }

            const number = numberMatch[1].replace(/[-\s/]/g, '');
            if (number.length >= 3) {
              return `${cleanStart}-${number}`;
            }
          }
        }
      }
    }

    // Look for any letter-number combinations in the text
    const letterNumberPattern = /([A-Z])([\d\s-]{3,})/gi;
    const matches = text.match(letterNumberPattern);
    if (matches) {
      for (const match of matches) {
        const cleaned = match.replace(/\s+/g, '');
        if (/^[A-Z][\d-]{3,}$/.test(cleaned)) {
          return cleaned.replace(/[-\s]/g, '-');
        }
      }
    }

    return null;
  };

  // Generate manual correction suggestions based on OCR text
  const generateNAFDACSuggestions = (text) => {
    const suggestions = [];
    const cleanedText = cleanupText(text);

    // Look for number patterns that might be NAFDAC numbers
    const numberPatterns = [
      /(\d{4,})/g,  // 4+ digits
      /([A-Z]\d{3,})/g,  // Letter + 3+ digits
      /(\d{3,4})/g  // 3-4 digits
    ];

    for (const pattern of numberPatterns) {
      const matches = cleanedText.match(pattern);
      if (matches) {
        suggestions.push(...matches.filter(match => match.length >= 3));
      }
    }

    // Look for common NAFDAC prefixes in the text
    const prefixes = ['A4', 'A5', 'B4', 'B5', 'C4', 'C5'];
    for (const prefix of prefixes) {
      if (cleanedText.toUpperCase().includes(prefix)) {
        suggestions.push(`${prefix}-XXXX`);
      }
    }

    // Remove duplicates and return unique suggestions
    return [...new Set(suggestions)].slice(0, 5);
  };

  // Dynamic confidence thresholds based on text length and patterns
  const getConfidenceThreshold = (text, extractedNAFDAC) => {
    if (extractedNAFDAC && /^[A-Z]\d{1,2}-\d{4,}$/.test(extractedNAFDAC)) {
      return 70; // Lower threshold for valid NAFDAC patterns
    }
    if (text.length < 10) {
      return 85; // Higher threshold for short text
    }
    return 75; // Standard threshold
  };

  // Handle Image scan (OCR) with enhanced processing
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
      // Use simplified preprocessing
      const processedFile = await preprocessImageForNAFDAC(file);
      const worker = await createWorker('eng');

      // Configure Tesseract for better accuracy with NAFDAC numbers
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-:. ',
        tessedit_pageseg_mode: '6', // Uniform block of text
        tessedit_ocr_engine_mode: '2' // LSTM only (better for consistent text)
      });

      const { data: { text, confidence } } = await worker.recognize(processedFile);
      await worker.terminate();

      // Extract NAFDAC number using pattern recognition
      const extractedNAFDAC = extractNAFDACNumber(text);
      const confidenceThreshold = getConfidenceThreshold(text, extractedNAFDAC);

      // Debug logging
      console.log('OCR Debug:', {
        rawText: text,
        confidence: Math.round(confidence),
        extractedNAFDAC,
        confidenceThreshold
      });

      if (extractedNAFDAC && confidence > confidenceThreshold) {
        // High confidence with valid NAFDAC pattern: proceed with verification
        verifyMedicine(extractedNAFDAC, 'nafdac');
      } else if (text.trim() && confidence > 20) {
        // Medium confidence: show suggestions for manual verification
        const suggestions = generateNAFDACSuggestions(text);

        setVerificationResult({
          status: 'ocr_low_confidence',
          extractedText: text.trim(),
          extractedNAFDAC,
          confidence: Math.round(confidence),
          suggestions,
          message: extractedNAFDAC
            ? `We found a potential NAFDAC number: "${extractedNAFDAC}" (Confidence: ${Math.round(confidence)}%). Please confirm this matches what's on your package.`
            : `We detected some text but couldn't confidently identify the NAFDAC number. ${suggestions.length > 0 ? `Possible matches: ${suggestions.join(', ')}. ` : ''}Please check your package and enter the NAFDAC number manually.`
        });
        setIsProcessing(false);
      } else {
        // Very low confidence or no text: provide helpful guidance
        const suggestions = generateNAFDACSuggestions(text);

        setVerificationResult({
          status: 'ocr_failed',
          extractedText: text.trim(),
          extractedNAFDAC,
          confidence: Math.round(confidence),
          suggestions,
          message: `We couldn't clearly read the text on your image. This can happen if the image is blurry, poorly lit, or at an angle. ${suggestions.length > 0 ? `We did find some possible patterns: ${suggestions.join(', ')}. ` : ''}Please try taking a new photo with better lighting and a straighter angle, or enter the NAFDAC number manually.`
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Enhanced OCR error:', error);
      setVerificationResult({
        status: 'ocr_error',
        message: 'OCR processing failed. Please try again or use manual input.'
      });
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
    if (!product) return;

    setVerificationResult({
      status: 'verified',
      // Map field names to match expected format with safety checks
      productName: product['Product Name'] || 'Unknown Product',
      nafdacNo: product['Nafdac Reg. Number'] || 'Not Available',
      manufacturer: product.Manufacturer || 'Not Available',
      activeIngredients: product['Active Ingredients'] || 'Not Available',
      approvalDate: product['Approval Date'] || 'Not Available',
      productStatus: product.Status || 'Unknown',
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