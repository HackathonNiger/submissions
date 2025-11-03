'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, Building2, Eye, EyeOff, Check, ArrowRight, ArrowLeft,
  Phone, Mail, Lock, FileText, Store, Globe, Users, CreditCard
} from 'lucide-react';

export default function GetStarted() {
  const router = useRouter();
  const { register, isAuthenticated, isRegisterLoading } = useAuth();
  
  const [userType, setUserType] = useState(''); // 'user' or 'merchant'
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+234',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    // Business Details (for merchants)
    businessName: '',
    businessCategory: '',
    businessType: '',
    businessAddress: '',
    businessPhone: '',
    businessWebsite: '',
    estimatedMonthlyVolume: '',
    businessDescription: '',
    // Location data (will be filled automatically or via geolocation)
    latitude: '',
    longitude: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/a/dashboard');
    }
  }, [isAuthenticated, router]);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Set default coordinates for Lagos, Nigeria if geolocation fails
          setFormData(prev => ({
            ...prev,
            latitude: '6.5244',
            longitude: '3.3792'
          }));
        }
      );
    } else {
      // Set default coordinates if geolocation is not supported
      setFormData(prev => ({
        ...prev,
        latitude: '6.5244',
        longitude: '3.3792'
      }));
    }
  }, []);

  const countryCodes = [
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' }
  ];

  const businessCategories = [
    'E-commerce',
    'Retail Store',
    'Restaurant/Food Service',
    'Healthcare',
    'Education',
    'Professional Services',
    'Technology',
    'Entertainment',
    'Travel & Tourism',
    'Financial Services',
    'Real Estate',
    'Other'
  ];

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Liability Company (LLC)',
    'Corporation',
    'Non-Profit Organization'
  ];

  const monthlyVolumes = [
    'Less than ₦100,000',
    '₦100,000 - ₦500,000',
    '₦500,000 - ₦1,000,000',
    '₦1,000,000 - ₦5,000,000',
    '₦5,000,000 - ₦10,000,000',
    'More than ₦10,000,000'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare registration data based on user type
      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}${Date.now()}`,
        email: formData.email,
        password: formData.password,
        phone_number: formData.countryCode + formData.phoneNumber,
        latitude: formData.latitude,
        longitude: formData.longitude,
        role: userType
      };

      // Add business details for merchants
      if (userType === 'merchant') {
        registrationData.business_name = formData.businessName;
        registrationData.business_category = formData.businessCategory;
        registrationData.business_type = formData.businessType;
        registrationData.business_address = formData.businessAddress;
        registrationData.business_phone = formData.businessPhone;
        registrationData.business_website = formData.businessWebsite;
        registrationData.monthly_revenue = formData.estimatedMonthlyVolume;
        registrationData.business_description = formData.businessDescription;
      }

      await register(registrationData);
      
      // Success handling is done in the useAuth hook
      
    } catch (error) {
      // Error handling is done in the useAuth hook via toast
      // But we can also set local form errors if needed
      if (error?.data?.error_code === 'MISSING_FIELDS') {
        setErrors({
          general: 'Please fill in all required fields.'
        });
      } else if (error?.data?.message?.includes('email')) {
        setErrors({
          email: 'This email is already registered.'
        });
      } else {
        setErrors({
          general: 'Registration failed. Please try again.'
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal details validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    // Business details validation for merchants
    if (userType === 'merchant' && currentStep === 2) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      
      if (!formData.businessCategory) {
        newErrors.businessCategory = 'Business category is required';
      }
      
      if (!formData.businessType) {
        newErrors.businessType = 'Business type is required';
      }
      
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required';
      }
      
      if (!formData.estimatedMonthlyVolume) {
        newErrors.estimatedMonthlyVolume = 'Monthly volume estimate is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isPersonalDetailsValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.phoneNumber && 
           formData.password && 
           formData.confirmPassword && 
           formData.password === formData.confirmPassword &&
           formData.agreeToTerms;
  };

  const isBusinessDetailsValid = () => {
    return formData.businessName && 
           formData.businessCategory && 
           formData.businessType && 
           formData.businessAddress && 
           formData.estimatedMonthlyVolume;
  };

  return (
    <div className="min-h-screen bg-white font-space">
      <Header />
      
      <div className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-space">
              Get Started with GestPay
            </h1>
            <p className="text-xl text-gray-600">
              Join thousands of users and businesses using biometric payments
            </p>
          </div>

          {/* User Type Selection */}
          {!userType && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-space">
                Choose Your Account Type
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Individual User */}
                <div 
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300"
                  onClick={() => setUserType('user')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Individual User</h3>
                    <p className="text-gray-600 mb-4">
                      Personal account for making payments with biometric technology
                    </p>
                    <ul className="text-sm text-gray-500 space-y-2">
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        FacePay & VoicePay
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Social transfers
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Personal wallet
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Merchant */}
                <div 
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300"
                  onClick={() => setUserType('merchant')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Merchant</h3>
                    <p className="text-gray-600 mb-4">
                      Business account to accept biometric payments from customers
                    </p>
                    <ul className="text-sm text-gray-500 space-y-2">
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Accept all payment methods
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Business dashboard
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        API integration
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {userType && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Progress Bar for Merchants */}
              {userType === 'merchant' && (
                <div className="bg-gray-50 px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        1
                      </div>
                      <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>
                        Personal Details
                      </span>
                    </div>
                    
                    <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
                      <div className={`h-full bg-primary rounded transition-all duration-300 ${
                        currentStep >= 2 ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        2
                      </div>
                      <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>
                        Business Details
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8">
                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-space">
                        {userType === 'user' ? 'Create Your Account' : 'Personal Information'}
                      </h2>
                      <p className="text-gray-600">
                        {userType === 'user' 
                          ? 'Fill in your details to get started with GestPay' 
                          : 'Let\'s start with your personal information'
                        }
                      </p>
                    </div>

                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="Create a password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="Confirm your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
                      </div>
                    </div>

                    {/* Error Messages */}
                    {errors.general && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{errors.general}</p>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className={`mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary ${
                          errors.agreeToTerms ? 'border-red-300' : ''
                        }`}
                        required
                      />
                      <div>
                        <label className="text-sm text-gray-600">
                          I agree to the{' '}
                          <a href="#" className="text-primary hover:underline">Terms of Service</a>
                          {' '}and{' '}
                          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </label>
                        {errors.agreeToTerms && (
                          <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setUserType('')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      
                      {userType === 'user' ? (
                        <button
                          type="submit"
                          disabled={!isPersonalDetailsValid() || isRegisterLoading}
                          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                          {isRegisterLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          ) : null}
                          {isRegisterLoading ? 'Creating Account...' : 'Create Account'}
                          {!isRegisterLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          disabled={!isPersonalDetailsValid()}
                          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                          Next Step
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Business Details (Merchants Only) */}
                {currentStep === 2 && userType === 'merchant' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-space">
                        Business Information
                      </h2>
                      <p className="text-gray-600">
                        Tell us about your business to complete your merchant account
                      </p>
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter your business name"
                          required
                        />
                      </div>
                    </div>

                    {/* Business Category and Type */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Category *
                        </label>
                        <select
                          name="businessCategory"
                          value={formData.businessCategory}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          required
                        >
                          <option value="">Select category</option>
                          {businessCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type *
                        </label>
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          required
                        >
                          <option value="">Select type</option>
                          {businessTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Business Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address *
                      </label>
                      <textarea
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Enter your business address"
                        required
                      />
                    </div>

                    {/* Business Phone and Website */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="businessPhone"
                            value={formData.businessPhone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="Business phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website (Optional)
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            name="businessWebsite"
                            value={formData.businessWebsite}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Monthly Volume */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Monthly Transaction Volume *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="estimatedMonthlyVolume"
                          value={formData.estimatedMonthlyVolume}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          required
                        >
                          <option value="">Select volume range</option>
                          {monthlyVolumes.map((volume) => (
                            <option key={volume} value={volume}>
                              {volume}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Business Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description (Optional)
                      </label>
                      <textarea
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Tell us more about your business..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Previous
                      </button>
                      
                      <button
                        type="submit"
                        disabled={!isBusinessDetailsValid() || isRegisterLoading}
                        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        {isRegisterLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : null}
                        {isRegisterLoading ? 'Creating Account...' : 'Create Merchant Account'}
                        {!isRegisterLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
