import { useState } from 'react';
import { Camera, Upload, FileText, AlertTriangle, CheckCircle, Search, QrCode, Image } from 'lucide-react';
import Navigation from './Navigation';
import CameraModal from './CameraModal';

const HomePage = ({
  currentPage,
  setCurrentPage,
  verificationMethod,
  verificationResult,
  manualInput,
  isProcessing,
  fileInputRef,
  setVerificationMethod,
  handleQRScan,
  handleImageScan,
  handleManualVerification,
  resetVerification,
  setManualInput,
  searchTerm,
  searchResults,
  handleSearchChange,
  selectProduct
}) => {
  const [inputErrors, setInputErrors] = useState({ nafdacNo: '', batchNo: '' });
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState(null); // 'qr' or 'image'

  const validateNafdacNo = (value) => {
    if (!value) return '';
    // Updated regex to match actual NAFDAC formats: "03-6514" or "A3-100797"
    const regex = /^(?:[A-Z]\d-\d{4,6}|[0-9]{2}-\d{4})$/;
    return regex.test(value) ? '' : 'NAFDAC number must be in format like 03-6514 or A3-100797';
  };

  const validateBatchNo = (value) => {
    if (!value) return '';
    const regex = /^[A-Z]{3}\d{8}$/;
    return regex.test(value) ? '' : 'Batch number must be in format like BTH20240101';
  };

  const handleNafdacChange = (e) => {
    const value = e.target.value;
    setManualInput({ ...manualInput, nafdacNo: value });
    setInputErrors({ ...inputErrors, nafdacNo: validateNafdacNo(value) });
  };

  const handleBatchChange = (e) => {
    const value = e.target.value;
    setManualInput({ ...manualInput, batchNo: value });
    setInputErrors({ ...inputErrors, batchNo: validateBatchNo(value) });
  };

  const hasErrors = inputErrors.nafdacNo || inputErrors.batchNo;
  const hasInput = manualInput.nafdacNo || manualInput.batchNo;

  // Camera handlers
  const handleOpenCamera = (mode) => {
    setCameraMode(mode);
    setCameraModalOpen(true);
  };

  const handleCameraCapture = (file) => {
    if (cameraMode === 'qr') {
      handleQRScan(file);
    } else if (cameraMode === 'image') {
      handleImageScan(file);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
    <Navigation
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      resetVerification={resetVerification}
    />
    {!verificationMethod && !verificationResult && (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-green-700 text-center p-8 rounded-xl mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Verify Your Medicine
          </h1>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto">
            Protect yourself and your loved ones from counterfeit drugs.
            Choose a verification method below to check your medicine's authenticity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* QR Code Method */}
          <div
            onClick={() => setVerificationMethod('qr')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-green-300 hover:border-green-500"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <QrCode className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">QR Code Scan</h3>
            <p className="text-gray-600 text-center">
              Scan the QR code on your medicine package using your camera
            </p>
          </div>

          {/* Image Scan Method */}
          <div
            onClick={() => setVerificationMethod('image')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-green-300 hover:border-green-500"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Image className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Image Scan</h3>
            <p className="text-gray-600 text-center">
              Take or upload a photo of your medicine package for analysis
            </p>
          </div>

          {/* Manual Input Method */}
          <div
            onClick={() => setVerificationMethod('manual')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-green-300 hover:border-green-500"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Manual Input</h3>
            <p className="text-gray-600 text-center">
              Enter NAFDAC or Batch number manually from your package
            </p>
          </div>

          {/* Search Method */}
          <div
            onClick={() => setVerificationMethod('search')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-green-300 hover:border-green-500"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Search className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Search Database</h3>
            <p className="text-gray-600 text-center">
              Search for medicines by name, manufacturer, or NAFDAC number
            </p>
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={32} />
            <div>
              <h3 className="text-xl font-bold text-red-700 mb-2">
                Found a Counterfeit Drug?
              </h3>
              <p className="text-gray-700 mb-4">
                Help protect others by reporting suspected fake drugs to NAFDAC immediately.
              </p>
              <a
                href="https://greenbook.nafdac.gov.ng/report/sf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Report to NAFDAC
              </a>
            </div>
          </div>
        </div>
      </div>
    )}

    {verificationMethod === 'search' && !verificationResult && (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={resetVerification}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back to Methods
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Search Medicine Database
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search for Medicine
              </label>
              <input
                type="text"
                placeholder="Enter medicine name, manufacturer, or NAFDAC number..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:border-green-500"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="border-2 border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {searchResults.map((product, index) => (
                  <div
                    key={index}
                    onClick={() => selectProduct(product)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-semibold text-gray-800">{product.productName}</div>
                    <div className="text-sm text-gray-600">{product.manufacturer}</div>
                    <div className="text-sm text-green-600">NAFDAC: {product.nafdacNo}</div>
                    {product.activeIngredients && (
                      <div className="text-sm text-blue-600 mt-1">{product.activeIngredients}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {searchTerm.length >= 2 && searchResults.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No medicines found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {verificationMethod === 'qr' && !verificationResult && (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={resetVerification}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back to Methods
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            QR Code Verification
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => handleOpenCamera('qr')}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Camera size={24} />
              <span>{isProcessing ? 'Processing...' : 'Open Camera'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Upload size={24} />
              <span>{isProcessing ? 'Processing...' : 'Upload QR Image'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleQRScan(e.target.files[0])}
              className="hidden"
            />
          </div>

          {isProcessing && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Scanning QR code...</p>
            </div>
          )}
        </div>
      </div>
    )}

    {verificationMethod === 'image' && !verificationResult && (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={resetVerification}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back to Methods
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Image-Based Verification
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => handleOpenCamera('image')}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Camera size={24} />
              <span>{isProcessing ? 'Processing...' : 'Take Photo'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Upload size={24} />
              <span>{isProcessing ? 'Processing...' : 'Upload Image'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleImageScan(e.target.files[0])}
              className="hidden"
            />
          </div>

          {isProcessing && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Analyzing image with OCR...</p>
            </div>
          )}
        </div>
      </div>
    )}

    {verificationMethod === 'manual' && !verificationResult && (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={resetVerification}
          className="mb-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back to Methods
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Manual Verification
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NAFDAC Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g., 03-6514 or A3-100797"
                value={manualInput.nafdacNo}
                onChange={handleNafdacChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-black focus:outline-none ${
                  inputErrors.nafdacNo ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
              />
              {inputErrors.nafdacNo && (
                <p className="text-red-500 text-sm mt-1">{inputErrors.nafdacNo}</p>
              )}
            </div>

            <div className="text-center text-gray-500 font-semibold">OR</div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Batch Number
              </label>
              <input
                type="text"
                placeholder="e.g., BTH20240101"
                value={manualInput.batchNo}
                onChange={handleBatchChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-black focus:outline-none ${
                  inputErrors.batchNo ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
              />
              {inputErrors.batchNo && (
                <p className="text-red-500 text-sm mt-1">{inputErrors.batchNo}</p>
              )}
            </div>

            <button
              onClick={handleManualVerification}
              disabled={(!hasInput || hasErrors) || isProcessing}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={24} />
              <span>{isProcessing ? 'Verifying...' : 'Verify Medicine'}</span>
            </button>
          </div>

          {isProcessing && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Checking database...</p>
            </div>
          )}
        </div>
      </div>
    )}

    {verificationResult && (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={`rounded-xl shadow-lg p-8 ${
          verificationResult.status === 'verified' ? 'bg-green-50 border-2 border-green-500' :
          verificationResult.status === 'counterfeit' ? 'bg-red-50 border-2 border-red-500' :
          'bg-yellow-50 border-2 border-yellow-500'
        }`}>
          <div className="text-center mb-6">
            {verificationResult.status === 'verified' ? (
              <>
                <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-green-700 mb-2">
                  ✅ VERIFIED: Original Product
                </h2>
                <p className="text-green-600">This medicine is registered with NAFDAC</p>
              </>
            ) : verificationResult.status === 'counterfeit' ? (
              <>
                <AlertTriangle className="mx-auto text-red-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-red-700 mb-2">
                  ⚠️ WARNING: Suspected Counterfeit
                </h2>
                <p className="text-red-600">This medicine may be fake or unregistered</p>
              </>
            ) : verificationResult.status === 'qr_not_found' ? (
              <>
                <AlertTriangle className="mx-auto text-yellow-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-yellow-700 mb-2">
                  QR Code Not Found
                </h2>
                <p className="text-yellow-600">No QR code detected in the image. Please try again with a clearer image.</p>
              </>
            ) : verificationResult.status === 'scan_error' ? (
              <>
                <AlertTriangle className="mx-auto text-red-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-red-700 mb-2">
                  Scan Error
                </h2>
                <p className="text-red-600">Unable to process the image. Please try again.</p>
              </>
            ) : verificationResult.status === 'ocr_no_text' ? (
              <>
                <AlertTriangle className="mx-auto text-yellow-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-yellow-700 mb-2">
                  No Text Detected
                </h2>
                <p className="text-yellow-600">No readable text found in the image. Please try with a clearer image containing medicine details.</p>
              </>
            ) : verificationResult.status === 'ocr_error' ? (
              <>
                <AlertTriangle className="mx-auto text-red-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-red-700 mb-2">
                  OCR Processing Error
                </h2>
                <p className="text-red-600">Unable to analyze the image. Please try again.</p>
              </>
            ) : verificationResult.status === 'invalid_file_type' ? (
              <>
                <AlertTriangle className="mx-auto text-yellow-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-yellow-700 mb-2">
                  Invalid File Type
                </h2>
                <p className="text-yellow-600">Please upload a valid image file (JPG, PNG, etc.).</p>
              </>
            ) : verificationResult.status === 'file_too_large' ? (
              <>
                <AlertTriangle className="mx-auto text-yellow-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-yellow-700 mb-2">
                  File Too Large
                </h2>
                <p className="text-yellow-600">Please upload an image smaller than 5MB.</p>
              </>
            ) : verificationResult.status === 'verification_error' ? (
              <>
                <AlertTriangle className="mx-auto text-red-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-red-700 mb-2">
                  Verification Error
                </h2>
                <p className="text-red-600">An error occurred during verification. Please try again.</p>
              </>
            ) : verificationResult.status === 'system_error' ? (
              <>
                <AlertTriangle className="mx-auto text-red-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-red-700 mb-2">
                  System Error
                </h2>
                <p className="text-red-600">A system error occurred. Please try again later.</p>
              </>
            ) : (
              <>
                <AlertTriangle className="mx-auto text-yellow-600 mb-4" size={64} />
                <h2 className="text-3xl font-bold text-yellow-700 mb-2">
                  Data Not Found
                </h2>
                <p className="text-yellow-600">No information available in database</p>
              </>
            )}
          </div>

          {verificationResult.status === 'verified' && (
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="font-semibold text-gray-800">{verificationResult.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NAFDAC No:</span>
                  <span className="font-semibold text-gray-800">{verificationResult.nafdacNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batch No:</span>
                  <span className="font-semibold text-gray-800">{verificationResult.batchNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Manufacturer:</span>
                  <span className="font-semibold text-gray-800">{verificationResult.manufacturer}</span>
                </div>
                {verificationResult.activeIngredients && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Ingredients:</span>
                    <span className="font-semibold text-gray-800">{verificationResult.activeIngredients}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval Date:</span>
                  <span className="font-semibold text-gray-800">{verificationResult.approvalDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className={`font-semibold ${verificationResult.isExpired ? 'text-red-600' : verificationResult.isExpiringSoon ? 'text-orange-600' : 'text-gray-800'}`}>
                    {verificationResult.expiryDate}
                  </span>
                </div>

                {/* Expiry Alert */}
                {verificationResult.isExpired && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center">
                      <AlertTriangle className="text-red-600 mr-2" size={20} />
                      <span className="text-red-700 font-semibold">This product has expired!</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">Do not use this medicine. It may be unsafe.</p>
                  </div>
                )}

                {verificationResult.isExpiringSoon && !verificationResult.isExpired && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center">
                      <AlertTriangle className="text-orange-600 mr-2" size={20} />
                      <span className="text-orange-700 font-semibold">Expiring Soon</span>
                    </div>
                    <p className="text-orange-600 text-sm mt-1">
                      This product expires in {verificationResult.expiryStatus.daysUntilExpiry} days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {verificationResult.status !== 'verified' && (
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-bold text-red-700 mb-3 text-lg">⚠️ Important Actions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Do not use this medicine</li>
                <li>Keep the packaging for evidence</li>
                <li>Report to NAFDAC immediately</li>
                <li>Inform the pharmacy or store where purchased</li>
              </ul>
            </div>
          )}

          <div className="space-y-3">
            {(verificationResult.status === 'counterfeit' || verificationResult.status === 'qr_not_found' || verificationResult.status === 'scan_error' || verificationResult.status === 'ocr_no_text' || verificationResult.status === 'ocr_error' || verificationResult.status === 'verification_error' || verificationResult.status === 'system_error') && (
              <a
                href="https://greenbook.nafdac.gov.ng/report/sf"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
              >
                Report to NAFDAC
              </a>
            )}

            <button
              onClick={resetVerification}
              className="w-full bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Verify Another Medicine
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Camera Modal */}
    <CameraModal
      isOpen={cameraModalOpen}
      onClose={() => setCameraModalOpen(false)}
      onCapture={handleCameraCapture}
      title={cameraMode === 'qr' ? 'Scan QR Code' : 'Take Photo for Analysis'}
    />
  </div>
  );
};

export default HomePage;