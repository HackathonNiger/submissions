'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Building2, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Clock,
  X,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState('info');
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    industry: '',
    businessAddress: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
    website: '',
    description: ''
  });

  const [directorInfo, setDirectorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    nationality: 'Nigerian',
    dateOfBirth: '',
    idType: '',
    idNumber: ''
  });

  const [documents, setDocuments] = useState({
    cacCertificate: null,
    taxCertificate: null,
    utilityBill: null,
    directorId: null,
    bankStatement: null,
    memorandum: null
  });

  const [verificationStatus, setVerificationStatus] = useState({
    businessInfo: 'pending',
    documents: 'pending',
    directors: 'pending',
    overall: 'pending'
  });

  const tabs = [
    { id: 'info', title: 'Business Information', icon: Building2 },
    { id: 'directors', title: 'Directors/Owners', icon: User },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'verification', title: 'Verification Status', icon: Shield }
  ];

  const businessTypes = [
    'Private Limited Company',
    'Public Limited Company',
    'Partnership',
    'Sole Proprietorship',
    'Non-Profit Organization',
    'Government Entity'
  ];

  const industries = [
    'Technology',
    'E-commerce',
    'Financial Services',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Agriculture',
    'Other'
  ];

  const requiredDocuments = [
    {
      key: 'cacCertificate',
      title: 'CAC Certificate',
      description: 'Certificate of Incorporation from Corporate Affairs Commission',
      required: true,
      formats: 'PDF, JPG, PNG (Max 5MB)'
    },
    {
      key: 'taxCertificate',
      title: 'Tax Identification Certificate',
      description: 'Valid Tax Identification Number (TIN) certificate',
      required: true,
      formats: 'PDF, JPG, PNG (Max 5MB)'
    },
    {
      key: 'utilityBill',
      title: 'Utility Bill',
      description: 'Recent utility bill (not older than 3 months)',
      required: true,
      formats: 'PDF, JPG, PNG (Max 5MB)'
    },
    {
      key: 'directorId',
      title: 'Director\'s ID',
      description: 'Valid government-issued ID of primary director',
      required: true,
      formats: 'PDF, JPG, PNG (Max 5MB)'
    },
    {
      key: 'bankStatement',
      title: 'Bank Statement',
      description: 'Recent bank statement (last 3 months)',
      required: false,
      formats: 'PDF (Max 10MB)'
    },
    {
      key: 'memorandum',
      title: 'Memorandum & Articles',
      description: 'Memorandum and Articles of Association',
      required: false,
      formats: 'PDF (Max 10MB)'
    }
  ];

  const handleFileUpload = (documentKey, file) => {
    setDocuments(prev => ({ ...prev, [documentKey]: file }));
  };

  const renderBusinessInfo = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type *
            </label>
            <select
              value={businessInfo.businessType}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select business type</option>
              {businessTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number *
            </label>
            <input
              type="text"
              value={businessInfo.registrationNumber}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, registrationNumber: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="RC Number"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID (TIN) *
            </label>
            <input
              type="text"
              value={businessInfo.taxId}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, taxId: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={businessInfo.industry}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={businessInfo.website}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Description
          </label>
          <textarea
            value={businessInfo.description}
            onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Describe your business activities..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={businessInfo.businessAddress}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, businessAddress: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={businessInfo.city}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={businessInfo.state}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              value={businessInfo.country}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="Nigeria">Nigeria</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={businessInfo.postalCode}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, postalCode: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
          Save Business Information
        </button>
      </div>
    </div>
  );

  const renderDirectors = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Primary Director/Owner Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={directorInfo.firstName}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={directorInfo.lastName}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={directorInfo.email}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={directorInfo.phone}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={directorInfo.dateOfBirth}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality *
            </label>
            <select
              value={directorInfo.nationality}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, nationality: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="Nigerian">Nigerian</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Type *
            </label>
            <select
              value={directorInfo.idType}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, idType: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select ID type</option>
              <option value="nin">National ID (NIN)</option>
              <option value="drivers">Driver's License</option>
              <option value="passport">International Passport</option>
              <option value="voters">Voter's Card</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number *
            </label>
            <input
              type="text"
              value={directorInfo.idNumber}
              onChange={(e) => setDirectorInfo(prev => ({ ...prev, idNumber: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Residential Address *
          </label>
          <textarea
            value={directorInfo.address}
            onChange={(e) => setDirectorInfo(prev => ({ ...prev, address: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
          Save Director Information
        </button>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {requiredDocuments.map((doc) => (
        <div key={doc.key} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>{doc.title}</span>
                {doc.required && <span className="text-red-500">*</span>}
              </h3>
              <p className="text-gray-600 mt-1">{doc.description}</p>
              <p className="text-sm text-gray-500 mt-1">{doc.formats}</p>
            </div>
            
            {documents[doc.key] && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Uploaded</span>
              </div>
            )}
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">
              {documents[doc.key] ? documents[doc.key].name : 'Click to upload or drag and drop'}
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
              className="hidden"
              id={`file-${doc.key}`}
            />
            <label
              htmlFor={`file-${doc.key}`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </div>
        </div>
      ))}
      
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
          Submit Documents
        </button>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Verification Status</h3>
        
        <div className="space-y-4">
          {[
            { key: 'businessInfo', title: 'Business Information', status: verificationStatus.businessInfo },
            { key: 'directors', title: 'Director Information', status: verificationStatus.directors },
            { key: 'documents', title: 'Document Verification', status: verificationStatus.documents },
            { key: 'overall', title: 'Overall Status', status: verificationStatus.overall }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{item.title}</span>
              <div className="flex items-center space-x-2">
                {item.status === 'approved' && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">Approved</span>
                  </>
                )}
                {item.status === 'pending' && (
                  <>
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-700 font-medium">Pending</span>
                  </>
                )}
                {item.status === 'rejected' && (
                  <>
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 font-medium">Rejected</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Verification Timeline:</p>
              <ul className="space-y-1">
                <li>• Document review: 2-3 business days</li>
                <li>• Background checks: 3-5 business days</li>
                <li>• Final approval: 1-2 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Business Compliance" 
      subtitle="Complete your business verification and KYC requirements"
    >
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'info' && renderBusinessInfo()}
          {activeTab === 'directors' && renderDirectors()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'verification' && renderVerification()}
        </div>
      </div>
    </DashboardLayout>
  );
}
