import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const Login = () => {
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load remembered phone number on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('rememberedPhone');
    if (savedPhone) {
      setFormData(prev => ({ ...prev, phoneNumber: savedPhone }));
      setRememberMe(true);
    }
  }, []);

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
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    clearFieldError(name);
    if (error) setError(null);
  };

  /**
   * Handle remember me checkbox
   */
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem('rememberedPhone');
    }
  };

  /**
   * Client-side validation
   */
  const validateForm = () => {
    const errors = {};

    // Phone number validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+234|234|0)[789][01]\d{8}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Enter a valid Nigerian phone number';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login...');
      
      // Call login function from AuthContext
      await login({
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      
      // Save phone number if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedPhone', formData.phoneNumber);
      }
      
      console.log('✅ Login successful');
      setSuccess(true);
      
      // Note: AuthContext will handle redirect to dashboard
      // We just show success briefly
      
    } catch (err) {
      console.error('❌ Login error:', err);
      
      // Handle different types of errors
      if (err instanceof APIError) {
        // Check for authentication errors (invalid credentials)
        if (err.statusCode === 401) {
          // Don't specify which field is wrong for security
          setError('Invalid phone number or password');
          setFieldErrors({
            phoneNumber: ' ', // Space to trigger red border
            password: ' '
          });
        } else {
          setError(err.message);
          
          // If there are validation errors from backend, show them
          if (err.errors && err.errors.length > 0) {
            const backendFieldErrors = processBackendErrors(err.errors);
            setFieldErrors(backendFieldErrors);
          }
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  // Show success screen
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">
          Login Successful!
        </h3>
        <p className="text-deepBlue-600 mb-2">Welcome back!</p>
        <LoadingSpinner size="md" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              {error === 'Invalid phone number or password' && (
                <p className="text-xs text-red-700 mt-1">
                  Please check your credentials and try again.
                </p>
              )}
            </div>
            <button
              onClick={clearErrors}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            Phone Number
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
          {hasFieldError('phoneNumber') && getFieldError('phoneNumber').trim() ? (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('phoneNumber')}
            </p>
          ) : !hasFieldError('phoneNumber') ? (
            <p className="text-xs text-deepBlue-500 mt-1 flex items-center">
              <Info className="w-3 h-3 mr-1" />
              Enter your registered phone number
            </p>
          ) : null}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 pr-12 transition duration-200 ${
                hasFieldError('password')
                  ? 'border-red-500 focus:ring-red-500 bg-red-50'
                  : 'border-deepBlue-200 focus:ring-deepBlue-500'
              }`}
              disabled={isLoading}
              autoComplete="current-password"
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
          {hasFieldError('password') && getFieldError('password').trim() && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {getFieldError('password')}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="w-4 h-4 text-deepBlue-600 border-deepBlue-300 rounded focus:ring-deepBlue-500"
              disabled={isLoading}
            />
            <span className="text-sm text-deepBlue-700">Remember phone number</span>
          </label>
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
              <span className="ml-2">Logging in...</span>
            </div>
          ) : (
            'Log In'
          )}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button 
            type="button" 
            className="text-deepBlue-600 text-sm hover:underline"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;