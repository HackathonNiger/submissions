'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import { useAuth } from '../../hooks/useAuth';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2,
  Shield, Zap, Globe, CheckCircle
} from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const { login, isAuthenticated, isLoginLoading } = useAuth();
  
  const [accountType, setAccountType] = useState('user'); // 'user' or 'merchant'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/a/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Add account type to login data for role-based routing
      const loginData = {
        ...formData,
        role: accountType // This helps with role-based redirection
      };
      
      await login(loginData);
      
      // Success handling is done in the useAuth hook
      
    } catch (error) {
      // Error handling is done in the useAuth hook via toast
      // But we can also set local form errors if needed
      if (error?.data?.error_code === 'INVALID_CREDENTIALS') {
        setErrors({
          general: 'Invalid email or password. Please try again.'
        });
      } else {
        setErrors({
          general: 'An error occurred. Please try again.'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-space">
      <Header />
      
      <div className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Side - Welcome Content */}
            <div className="hidden lg:block">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-space">
                  Welcome back to
                  <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    GestPay
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Continue your journey with biometric payments. Secure, fast, and convenient.
                </p>
                
                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Bank-Grade Security</h3>
                      <p className="text-gray-600 text-sm">Your data is protected with advanced encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Instant Access</h3>
                      <p className="text-gray-600 text-sm">Sign in once and stay connected securely</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Global Reach</h3>
                      <p className="text-gray-600 text-sm">Access your account from anywhere in the world</p>
                    </div>
                  </div>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    PCI DSS Compliant
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    99.99% Uptime
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    ISO 27001 Certified
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Sign In Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Image 
                      src="/logo.png" 
                      alt="GestPay Logo" 
                      width={32} 
                      height={32}
                      className="w-8 h-8"
                    />
                    <span className="text-2xl font-bold text-gray-900 font-space">GestPay</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 font-space">
                    Sign In
                  </h2>
                  <p className="text-gray-600">
                    Access your account to continue
                  </p>
                </div>

                {/* Account Type Selector */}
                <div className="mb-6">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setAccountType('user')}
                      className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        accountType === 'user'
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('merchant')}
                      className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        accountType === 'merchant'
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Business
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                {/* Sign In Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
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
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoginLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">New to GestPay?</span>
                    </div>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <Link 
                    href="/get-started" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Create an account
                  </Link>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>

              {/* Mobile Welcome Message */}
              <div className="lg:hidden mt-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome back to GestPay
                </h3>
                <p className="text-gray-600">
                  Continue your journey with biometric payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
