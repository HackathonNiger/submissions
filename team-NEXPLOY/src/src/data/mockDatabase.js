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

const rawDatabase = [
  {
    nafdacNo: 'A4-1234',
    batchNo: 'BTH20240101',
    productName: 'Paracetamol 500mg Tablets',
    manufacturer: 'May & Baker Nigeria Plc',
    expiryDate: '2026-12-31',
    status: 'verified',
    qrCode: 'NAFDAC-A4-1234-BTH20240101'
  },
  {
    nafdacNo: 'A7-5678',
    batchNo: 'BTH20240205',
    productName: 'Amoxicillin 250mg Capsules',
    manufacturer: 'GlaxoSmithKline Nigeria',
    expiryDate: '2027-06-30',
    status: 'verified',
    qrCode: 'NAFDAC-A7-5678-BTH20240205'
  },
  {
    nafdacNo: 'B2-9999',
    batchNo: 'FAKE001',
    productName: 'Counterfeit Medicine',
    manufacturer: 'Unknown',
    status: 'counterfeit'
  },
  {
    nafdacNo: 'A1-2468',
    batchNo: 'BTH20231115',
    productName: 'Vitamin C 1000mg',
    manufacturer: 'Emzor Pharmaceutical',
    expiryDate: '2026-08-15',
    status: 'verified',
    qrCode: 'NAFDAC-A1-2468-BTH20231115'
  }
];

export const mockDatabase = validateDatabase(rawDatabase);