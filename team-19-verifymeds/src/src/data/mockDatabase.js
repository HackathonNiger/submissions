// Validation function for database entries
const validateDatabaseEntry = (entry, index) => {
  const errors = [];

  if (!entry.nafdacNo || typeof entry.nafdacNo !== 'string') {
    errors.push(`Entry ${index}: Invalid or missing nafdacNo`);
  } else if (!/^[A-Z]\d-\d{4}$/.test(entry.nafdacNo)) {
    errors.push(`Entry ${index}: nafdacNo format invalid`);
  }

  if (!entry.batchNo || typeof entry.batchNo !== 'string') {
    errors.push(`Entry ${index}: Invalid or missing batchNo`);
  } else if (!/^[A-Z]{3}\d{8}$/.test(entry.batchNo)) {
    errors.push(`Entry ${index}: batchNo format invalid`);
  }

  if (!entry.productName || typeof entry.productName !== 'string') {
    errors.push(`Entry ${index}: Invalid or missing productName`);
  }

  if (!entry.manufacturer || typeof entry.manufacturer !== 'string') {
    errors.push(`Entry ${index}: Invalid or missing manufacturer`);
  }

  if (!['verified', 'counterfeit'].includes(entry.status)) {
    errors.push(`Entry ${index}: Invalid status`);
  }

  if (entry.status === 'verified') {
    if (!entry.expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(entry.expiryDate)) {
      errors.push(`Entry ${index}: Invalid expiryDate for verified product`);
    }
    if (!entry.qrCode || typeof entry.qrCode !== 'string') {
      errors.push(`Entry ${index}: Missing qrCode for verified product`);
    }
  }

  return errors;
};

// Validate the database
const validateDatabase = (db) => {
  const allErrors = [];
  db.forEach((entry, index) => {
    const errors = validateDatabaseEntry(entry, index);
    allErrors.push(...errors);
  });

  if (allErrors.length > 0) {
    console.error('Database validation errors:', allErrors);
    // In production, you might throw an error or handle it
  }

  return db;
};

import processedData from './processedData.json';

// Transform processed data to match expected format
const rawDatabase = processedData.map(entry => ({
  nafdacNo: entry.nafdacNo,
  batchNo: entry.batchNo,
  productName: entry.productName,
  manufacturer: entry.manufacturer,
  expiryDate: entry.expiryDate,
  status: entry.status,
  qrCode: entry.qrCode,
  activeIngredients: entry.activeIngredients,
  approvalDate: entry.approvalDate,
  qrCodeImage: entry.qrCodeImage
}));

export const mockDatabase = validateDatabase(rawDatabase);