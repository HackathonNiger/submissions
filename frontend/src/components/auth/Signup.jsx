// frontend/src/compone
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bvn: '',
    nin: '',
    dateOfBirth: '',
    password: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // NEW: Field-specific errors
  const [success, setSuccess] = useState(false);

  /**
   * Get error for specific field
   */
  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || null;
  };

  /**
   * Check if field has error
   */
  const hasFieldError = (fieldName) => {
    return !!fieldErrors[fieldName];
  };

  /**
   * Clear error for specific field
   */
  const clearFieldError = (fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  /**
   * Handle input changes with error clearing
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === 'bvn' || name === 'nin') {
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else if (name === 'phoneNumber') {
      // Allow +234, 234, or 0 prefix
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user starts typing
    clearFieldError(name);
    if (error) setError(null);
  };

  /**
   * Client-side validation
   */
  const validateForm = () => {
    const errors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone number validation (Nigerian format)
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+234|234|0)[789][01]\d{8}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Enter a valid Nigerian phone number (e.g., +2348012345678)';
    }

    // BVN validation
    if (!formData.bvn) {
      errors.bvn = 'BVN is required';
    } else if (formData.bvn.length !== 11) {
      errors.bvn = `BVN must be exactly 11 digits (${formData.bvn.length}/11)`;
    }

    // NIN validation
    if (!formData.nin) {
      errors.nin = 'NIN is required';
    } else if (formData.nin.length !== 11) {
      errors.nin = `NIN must be exactly 11 digits (${formData.nin.length}/11)`;
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        errors.dateOfBirth = 'You must be at least 18 years old';
      }
      
      if (birthDate > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    return errors;
  };

  /**
   * Process backend validation errors
   */
  const processBackendErrors = (backendErrors) => {
    const errors = {};
    
    if (Array.isArray(backendErrors)) {
      backendErrors.forEach(err => {
        errors[err.field] = err.message;
      });
    }
    
    return errors;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setFieldErrors({});
    
    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('🔐 Attempting registration...');
      
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber,
        bvn: formData.bvn,
        nin: formData.nin,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password
      });
      
      console.log('✅ Registration successful');
      setSuccess(true);
      
      // Show success briefly before redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Signup error:', err);
      
      if (err instanceof APIError) {
        setError(err.message);
        
        // Process field-specific errors from backend
        if (err.errors && err.errors.length > 0) {
          const backendFieldErrors = processBackendErrors(err.errors);
          setFieldErrors(backendFieldErrors);
          
          // Scroll to first error
          const firstErrorField = Object.keys(backendFieldErrors)[0];
          document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show success screen
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">
          Account Created Successfully!
        </h3>
        <p className="text-deepBlue-600 mb-2">
          Your wallet has been created automatically.
        </p>
        <p className="text-sm text-deepBlue-500">Redirecting to dashboard...</p>
        <LoadingSpinner size="md" text="" />
      </div>
    );
  }

  return (
    <div>
      {/* Global Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">{error}</h3>
              {Object.keys(fieldErrors).length > 0 && (
                <p className="text-xs text-red-700">
                  Please check the highlighted fields below.
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setError(null);
                setFieldErrors({});
              }}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-deepBlue-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                hasFieldError('firstName')
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-deepBlue-200 focus:ring-deepBlue-500'
              }`}
              disabled={isLoading}
              autoComplete="given-name"
            />
            {hasFieldError('firstName') && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {getFieldError('firstName')}
              </p>
            )}
          </div>
          
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-deepBlue-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                hasFieldError('lastName')
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-deepBlue-200 focus:ring-deepBlue-500'
              }`}
              disabled={isLoading}
              autoComplete="family-name"
            />
            {hasFieldError('lastName') && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {getFieldError('lastName')}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
              hasFieldError('email')
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-deepBlue-200 focus:ring-deepBlue-500'
            }`}
            disabled={isLoading}
            autoComplete="email"
          />
          {hasFieldError('email') && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('email')}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+2348012345678"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
              hasFieldError('phoneNumber')
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-deepBlue-200 focus:ring-deepBlue-500'
            }`}
            disabled={isLoading}
            autoComplete="tel"
          />
          {hasFieldError('phoneNumber') ? (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('phoneNumber')}
            </p>
          ) : (
            <p className="text-xs text-deepBlue-500 mt-1 flex items-center">
              <Info className="w-3 h-3 mr-1" />
              Nigerian phone number (e.g., +2348012345678)
            </p>
          )}
        </div>

        {/* BVN */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            BVN (Bank Verification Number) *
          </label>
          <input
            type="text"
            name="bvn"
            value={formData.bvn}
            onChange={handleChange}
            placeholder="12345678901"
            maxLength="11"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
              hasFieldError('bvn')
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-deepBlue-200 focus:ring-deepBlue-500'
            }`}
            disabled={isLoading}
          />
          {hasFieldError('bvn') ? (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('bvn')}
            </p>
          ) : (
            <p className="text-xs text-deepBlue-500 mt-1">
              11-digit Bank Verification Number ({formData.bvn.length}/11)
            </p>
          )}
        </div>

        {/* NIN */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            NIN (National Identification Number) *
          </label>
          <input
            type="text"
            name="nin"
            value={formData.nin}
            onChange={handleChange}
            placeholder="12345678901"
            maxLength="11"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
              hasFieldError('nin')
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-deepBlue-200 focus:ring-deepBlue-500'
            }`}
            disabled={isLoading}
          />
          {hasFieldError('nin') ? (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('nin')}
            </p>
          ) : (
            <p className="text-xs text-deepBlue-500 mt-1">
              11-digit National Identification Number ({formData.nin.length}/11)
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
              hasFieldError('dateOfBirth')
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-deepBlue-200 focus:ring-deepBlue-500'
            }`}
            disabled={isLoading}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          />
          {hasFieldError('dateOfBirth') ? (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('dateOfBirth')}
            </p>
          ) : (
            <p className="text-xs text-deepBlue-500 mt-1">
              You must be at least 18 years old
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 pr-12 transition duration-200 ${
                hasFieldError('password')
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-deepBlue-200 focus:ring-deepBlue-500'
              }`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deepBlue-400 hover:text-deepBlue-600 transition duration-200"
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {hasFieldError('password') ? (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('password')}
            </p>
          ) : (
            <p className="text-xs text-deepBlue-500 mt-1">
              At least 6 characters with uppercase, lowercase, and number
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
            isLoading
              ? 'bg-deepBlue-300 cursor-not-allowed'
              : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" text="" />
              <span className="ml-2">Creating Account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default Signup;