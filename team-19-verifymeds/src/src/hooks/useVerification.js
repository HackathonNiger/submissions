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

  // Helper functions for advanced image preprocessing
  const applyMedianFilter = (data, width, height) => {
    const output = new Uint8ClampedArray(data);
    const radius = 1;

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const neighbors = [];
        for (let ky = -radius; ky <= radius; ky++) {
          for (let kx = -radius; kx <= radius; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            neighbors.push(data[idx]);
          }
        }
        neighbors.sort((a, b) => a - b);
        const median = neighbors[Math.floor(neighbors.length / 2)];

        const idx = (y * width + x) * 4;
        output[idx] = output[idx + 1] = output[idx + 2] = median;
      }
    }
    return output;
  };

  const applySharpenFilter = (data, width, height) => {
    const output = new Uint8ClampedArray(data);
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const weight = kernel[(ky + 1) * 3 + (kx + 1)];
            sum += data[idx] * weight;
          }
        }
        const idx = (y * width + x) * 4;
        output[idx] = output[idx + 1] = output[idx + 2] = Math.max(0, Math.min(255, sum));
      }
    }
    return output;
  };

  const applyCLAHE = (data, width, height) => {
    // Simplified CLAHE implementation
    const output = new Uint8ClampedArray(data);
    const tileSize = 32;

    for (let tileY = 0; tileY < height; tileY += tileSize) {
      for (let tileX = 0; tileX < width; tileX += tileSize) {
        const tileHeight = Math.min(tileSize, height - tileY);
        const tileWidth = Math.min(tileSize, width - tileX);

        // Calculate histogram for this tile
        const histogram = new Array(256).fill(0);
        for (let y = tileY; y < tileY + tileHeight; y++) {
          for (let x = tileX; x < tileX + tileWidth; x++) {
            const idx = (y * width + x) * 4;
            histogram[data[idx]]++;
          }
        }

        // Apply contrast limiting
        const clipLimit = 40;
        let excess = 0;
        for (let i = 0; i < 256; i++) {
          if (histogram[i] > clipLimit) {
            excess += histogram[i] - clipLimit;
            histogram[i] = clipLimit;
          }
        }

        // Redistribute excess
        const redistribution = Math.floor(excess / 256);
        for (let i = 0; i < 256; i++) {
          histogram[i] += redistribution;
        }

        // Apply histogram equalization to tile
        const totalPixels = tileWidth * tileHeight;
        const cdf = new Array(256).fill(0);
        cdf[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
          cdf[i] = cdf[i - 1] + histogram[i];
        }

        for (let y = tileY; y < tileY + tileHeight; y++) {
          for (let x = tileX; x < tileX + tileWidth; x++) {
            const idx = (y * width + x) * 4;
            const equalized = Math.floor((cdf[data[idx]] * 255) / totalPixels);
            output[idx] = output[idx + 1] = output[idx + 2] = equalized;
          }
        }
      }
    }

    return output;
  };

  const applyOtsuThreshold = (data, width, height) => {
    const histogram = new Array(256).fill(0);

    // Calculate histogram
    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++;
    }

    const totalPixels = (width * height);
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }

    let sumB = 0;
    let wB = 0;
    let varianceMax = 0;
    let threshold = 0;

    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;

      const wF = totalPixels - wB;
      if (wF === 0) break;

      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;

      const varianceBetween = wB * wF * (mB - mF) * (mB - mF);
      if (varianceBetween > varianceMax) {
        varianceMax = varianceBetween;
        threshold = t;
      }
    }

    // Apply threshold
    const output = new Uint8ClampedArray(data);
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] > threshold ? 255 : 0;
      output[i] = output[i + 1] = output[i + 2] = value;
    }

    return output;
  };

  const applyMorphologicalOperations = (data, width, height) => {
    const output = new Uint8ClampedArray(data);

    // Dilation to connect broken text parts
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx] === 0) { // Black pixel
          // Check if any neighbor is white
          let hasWhiteNeighbor = false;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const nIdx = ((y + ky) * width + (x + kx)) * 4;
              if (data[nIdx] === 255) {
                hasWhiteNeighbor = true;
                break;
              }
            }
            if (hasWhiteNeighbor) break;
          }
          if (hasWhiteNeighbor) {
            output[idx] = output[idx + 1] = output[idx + 2] = 255;
          }
        }
      }
    }

    return output;
  };

  // Enhanced preprocessing for NAFDAC numbers
  const preprocessImageForNAFDAC = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set optimal dimensions for OCR
        const maxWidth = 1200;
        const maxHeight = 800;
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Step 1: Draw original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Step 2: Apply advanced preprocessing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Noise reduction using median filter
        const denoisedData = applyMedianFilter(data, canvas.width, canvas.height);

        // Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization)
        const enhancedData = applyCLAHE(denoisedData, canvas.width, canvas.height);

        // Apply sharpening filter
        const sharpenedData = applySharpenFilter(enhancedData, canvas.width, canvas.height);

        // Convert to grayscale with optimized weights
        for (let i = 0; i < sharpenedData.length; i += 4) {
          const gray = sharpenedData[i] * 0.299 + sharpenedData[i + 1] * 0.587 + sharpenedData[i + 2] * 0.114;
          sharpenedData[i] = sharpenedData[i + 1] = sharpenedData[i + 2] = gray;
        }

        // Apply binary thresholding with Otsu's method
        const binaryData = applyOtsuThreshold(sharpenedData, canvas.width, canvas.height);

        // Put processed data back to canvas
        const processedImageData = new ImageData(binaryData, canvas.width, canvas.height);
        ctx.putImageData(processedImageData, 0, 0);

        // Apply morphological operations to clean up text
        const cleanedData = applyMorphologicalOperations(processedImageData.data, canvas.width, canvas.height);
        const finalImageData = new ImageData(cleanedData, canvas.width, canvas.height);
        ctx.putImageData(finalImageData, 0, 0);

        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Very minimal preprocessing for extremely difficult images
  const preprocessImageMinimal = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Keep original size for minimal processing
        canvas.width = img.width;
        canvas.height = img.height;

        // Just convert to grayscale - minimal processing
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Simpler preprocessing fallback for difficult images
  const preprocessImageSimple = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set dimensions
        const maxWidth = 800;
        const maxHeight = 600;
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Simple preprocessing: increase contrast and convert to grayscale
        const grayImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const grayData = grayImageData.data;
        for (let i = 0; i < grayData.length; i += 4) {
          const gray = grayData[i] * 0.299 + grayData[i + 1] * 0.587 + grayData[i + 2] * 0.114;
          grayData[i] = grayData[i + 1] = grayData[i + 2] = gray;
        }
        ctx.putImageData(grayImageData, 0, 0);

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

    // Common NAFDAC patterns (expanded for garbled text)
    const patterns = [
      // Standard patterns
      /(?:NAFDAC\s*REG\s*\.?\s*NO\s*:?\s*)?([A-Z]\d{1,2}-\d{4,})/i,
      /([A-Z]\d{1,2}-\d{4,})/g,
      /(?:REG\s*NO|REGISTRATION\s*NO|REG\.?\s*NO)\s*:?\s*([A-Z]\d{1,2}-\d{4,})/i,
      /(?:Nafdac|NAFDAC)\s*:?\s*([A-Z]\d{1,2}-\d{4,})/i,

      // Garbled text patterns - look for letter-number combinations
      /([A-Z][4４４]\d{0,2}[-\s]*\d{3,4})/i,
      /([A-Z]\d{1,2}[-\s]*\d{3,})/g,

      // Fragmented patterns - look for A4, A5 followed by numbers
      /([A-Z][4４４5５]\d{0,2}[-\s]*\d{2,4})/gi,

      // Loose patterns for very garbled text
      /([A-Z]\d{3,})/g,
      /(\d{3,4})/g
    ];

    for (const pattern of patterns) {
      const matches = cleanedText.match(pattern);
      if (matches) {
        console.log('Pattern matches:', matches);

        // Filter for most likely NAFDAC format (letter + number + dash + numbers)
        const validMatches = matches.filter(match => {
          const cleaned = match.replace(/[|lI!]/g, '1').replace(/[0OQ]/g, '0');
          return /^[A-Z]\d{1,2}-\d{3,}$/.test(cleaned.trim()) ||
                 /^[A-Z]\d{3,}$/.test(cleaned.trim());
        });

        if (validMatches.length > 0) {
          return validMatches[0].trim();
        }
      }
    }

    // Try fuzzy matching for very garbled text
    return fuzzyMatchNAFDAC(cleanedText);
  };

  // Fuzzy matching for very garbled NAFDAC numbers
  const fuzzyMatchNAFDAC = (text) => {
    // Look for common NAFDAC starting patterns
    const commonStarts = ['A4', 'A5', 'B4', 'B5', 'C4', 'C5'];

    for (const start of commonStarts) {
      const index = text.toUpperCase().indexOf(start);
      if (index !== -1) {
        // Extract potential number around this pattern
        const aroundPattern = text.substring(Math.max(0, index - 2), index + 8);
        const cleaned = cleanupText(aroundPattern);

        // Look for number patterns
        const numberMatch = cleaned.match(/(\d{3,})/);
        if (numberMatch) {
          return `${start}-${numberMatch[1]}`;
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
      // Try advanced preprocessing first
      let processedFile = await preprocessImageForNAFDAC(file);
      const worker = await createWorker('eng');

      // Configure Tesseract for better accuracy
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-:. ',
        tessedit_pageseg_mode: '6', // Uniform block of text
        tessedit_ocr_engine_mode: '2' // LSTM only (better for consistent text)
      });

      let { data: { text, confidence } } = await worker.recognize(processedFile);

      // If confidence is very low (< 15%), try simple preprocessing
      if (confidence < 15 && text.trim().length < 5) {
        console.log('Advanced preprocessing gave poor results, trying simple preprocessing...');
        await worker.terminate();

        const simpleWorker = await createWorker('eng');
        await simpleWorker.setParameters({
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-:. ',
          tessedit_pageseg_mode: '6',
          tessedit_ocr_engine_mode: '2'
        });

        processedFile = await preprocessImageSimple(file);
        const simpleResult = await simpleWorker.recognize(processedFile);
        await simpleWorker.terminate();

        text = simpleResult.data.text;
        confidence = simpleResult.data.confidence;

        // If still poor results, try minimal preprocessing
        if (confidence < 10 && text.trim().length < 5) {
          console.log('Simple preprocessing still poor, trying minimal preprocessing...');

          const minimalWorker = await createWorker('eng');
          await minimalWorker.setParameters({
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-:. ',
            tessedit_pageseg_mode: '6',
            tessedit_ocr_engine_mode: '2'
          });

          processedFile = await preprocessImageMinimal(file);
          const minimalResult = await minimalWorker.recognize(processedFile);
          await minimalWorker.terminate();

          text = minimalResult.data.text;
          confidence = minimalResult.data.confidence;
        }
      } else {
        await worker.terminate();
      }

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
      } else if (text.trim() && confidence > 15) {
        // Show result with enhanced suggestions for manual correction
        const suggestions = generateNAFDACSuggestions(text);

        setVerificationResult({
          status: 'ocr_low_confidence',
          extractedText: text.trim(),
          extractedNAFDAC,
          confidence: Math.round(confidence),
          suggestions,
          message: extractedNAFDAC
            ? `OCR extracted potential NAFDAC number: "${extractedNAFDAC}" (Confidence: ${Math.round(confidence)}%). Please verify this is correct before proceeding.`
            : `OCR extracted text: "${text.trim()}" (Confidence: ${Math.round(confidence)}%). ${suggestions.length > 0 ? `Possible NAFDAC numbers found: ${suggestions.join(', ')}. ` : ''}Please look for the NAFDAC number and verify manually.`
        });
        setIsProcessing(false);
      } else {
        // Very low confidence: show what was extracted with suggestions
        const suggestions = generateNAFDACSuggestions(text);

        setVerificationResult({
          status: 'ocr_failed',
          extractedText: text.trim(),
          extractedNAFDAC,
          confidence: Math.round(confidence),
          suggestions,
          message: `Could not confidently read NAFDAC number. Raw OCR result: "${text.trim()}" (Confidence: ${Math.round(confidence)}%). ${suggestions.length > 0 ? `Possible patterns found: ${suggestions.join(', ')}. ` : ''}Please try manual input or take a clearer photo.`
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