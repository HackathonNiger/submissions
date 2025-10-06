import QRCode from 'qrcode';
import fs from 'fs';

// Function to calculate expiry date (5 years from approval date for demo purposes)
const calculateExpiryDate = (approvalDate) => {
  const date = new Date(approvalDate);
  date.setFullYear(date.getFullYear() + 5);
  return date.toISOString().split('T')[0];
};

// Function to generate QR code data
const generateQRCodeData = (entry) => {
  return `NAFDAC-${entry['Nafdac Reg. No']}-${entry['Product Name'].substring(0, 20)}`;
};

// Function to transform NAFDAC data to our format
const transformEntry = (entry) => {
  return {
    nafdacNo: entry['Nafdac Reg. No'],
    batchNo: `BATCH${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    productName: entry['Product Name'],
    manufacturer: entry.Manufacturer,
    expiryDate: calculateExpiryDate(entry['Approval date']),
    status: entry.Status.toLowerCase() === 'active' ? 'verified' : 'inactive',
    qrCode: generateQRCodeData(entry),
    activeIngredients: entry['Active ingredients'],
    approvalDate: entry['Approval date']
  };
};

// Function to process all drugs for comprehensive database
const selectAllDrugs = (data) => {
  // Return all entries for comprehensive search database
  return data;
};

// Main processing function
const processData = async () => {
  try {
    // Read the raw data
    const rawData = fs.readFileSync('./src/data/data.json', 'utf8');
    const data = JSON.parse(rawData);

    // Select all drugs for comprehensive database
    const selectedDrugs = selectAllDrugs(data);

    // Transform the data
    const transformedData = selectedDrugs.map(transformEntry);

    // Generate QR codes for each entry
    for (let i = 0; i < transformedData.length; i++) {
      try {
        const qrCodeDataURL = await QRCode.toDataURL(transformedData[i].qrCode, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        transformedData[i].qrCodeImage = qrCodeDataURL;
      } catch (error) {
        console.error(`Error generating QR code for ${transformedData[i].productName}:`, error);
      }
    }

    // Save the processed data
    fs.writeFileSync(
      './src/data/processedData.json',
      JSON.stringify(transformedData, null, 2)
    );

    console.log(`Successfully processed ${transformedData.length} drug entries`);
    console.log('Sample entries:');
    transformedData.slice(0, 3).forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.productName} - ${entry.nafdacNo}`);
    });

    return transformedData;
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

// Run the processing if this file is executed directly
if (typeof window === 'undefined') {
  processData().catch(console.error);
}

export { processData, transformEntry, selectAllDrugs };