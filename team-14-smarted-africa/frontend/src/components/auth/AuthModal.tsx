import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone as PhoneIcon, 
  AlertCircle, 
  CheckCircle, 
  X, 
  RotateCcw, 
  Clock 
} from 'lucide-react';
import AuthInputField from './AuthInputField';
import CaptchaComponent from './CaptchaComponent';
import PasswordStrength from './PasswordStrength';
import ErrorAlert from '../alerts/ErrorAlert';
import SuccessAlert from '../alerts/SuccessAlert';
import LockoutMessage from '../alerts/LockoutMessage';
import useRateLimit from '../../hooks/useRateLimit';
import { translations } from '../../utils/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authType: 'login' | 'signup';
  currentLanguage: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, authType, currentLanguage }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    termsAccepted: false,
    token: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loginRateLimit = useRateLimit(5, 300000);
  const signupRateLimit = useRateLimit(3, 600000);

  // Detect if identifier is phone number
  useEffect(() => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const emailRegex = /\S+@\S+\.\S+/;
    
    if (formData.identifier) {
      if (phoneRegex.test(formData.identifier.replace(/[\s\-\(\)]/g, ''))) {
        setIsPhone(true);
      } else if (emailRegex.test(formData.identifier)) {
        setIsPhone(false);
      }
    } else {
      setIsPhone(false);
    }
  }, [formData.identifier]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (authType === 'signup') {
      if (currentStep === 0) {
        if (!formData.identifier) {
          newErrors.identifier = 'Email or phone number is required';
        } else {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          const emailRegex = /\S+@\S+\.\S+/;
          const cleanPhone = formData.identifier.replace(/[\s\-\(\)]/g, '');
          
          if (!phoneRegex.test(cleanPhone) && !emailRegex.test(formData.identifier)) {
            newErrors.identifier = 'Please enter a valid email or phone number';
          }
        }
      } else if (currentStep === 1) {
        if (!formData.token) {
          newErrors.token = 'Verification token is required';
        } else if (!/^\d{6}$/.test(formData.token)) {
          newErrors.token = 'Token must be 6 digits';
        }
      } else if (currentStep === 2) {
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else {
          const checks = [
            /.{8,}/,
            /[a-z]/,
            /[A-Z]/,
            /[0-9]/,
            /[^A-Za-z0-9]/
          ];
          
          const failedChecks = checks.filter(check => !check.test(formData.password));
          if (failedChecks.length > 0) {
            newErrors.password = 'Password does not meet requirements';
          }
        }
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      } else if (currentStep === 3) {
        if (!formData.firstName) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = 'You must agree to the terms';
        }
      }
    } else if (authType === 'login') {
      if (!formData.identifier) {
        newErrors.identifier = 'Email or phone number is required';
      } else {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const emailRegex = /\S+@\S+\.\S+/;
        const cleanPhone = formData.identifier.replace(/[\s\-\(\)]/g, '');
        
        if (!phoneRegex.test(cleanPhone) && !emailRegex.test(formData.identifier)) {
          newErrors.identifier = 'Please enter a valid email or phone number';
        }
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (captchaSolved) {
      setCaptchaSolved(false);
    }
    
    setGlobalError('');
    setGlobalSuccess('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    setGlobalSuccess('');
    
    let rateLimit;
    let shouldCheckRateLimit = false;
    
    if (authType === 'login') {
      rateLimit = loginRateLimit;
      shouldCheckRateLimit = true;
    } else if (authType === 'signup') {
      rateLimit = signupRateLimit;
      shouldCheckRateLimit = currentStep === 0; // Only rate limit initial signup step
    }
    
    if (shouldCheckRateLimit && rateLimit && !rateLimit.checkRateLimit()) {
      setGlobalError('Too many attempts. Please wait before trying again.');
      return;
    }
    
    if (!validate()) return;
    
    if (authType === 'signup') {
      if (currentStep === 0) {
        setGlobalSuccess(translations[currentLanguage as keyof typeof translations]?.verificationSent || 'Verification code sent! Check your inbox/messages.');
        setCurrentStep(1);
        rateLimit.resetRateLimit();
      } else if (currentStep === 1) {
        if (formData.token === '123456') {
          setCurrentStep(2);
        } else {
          setErrors({ token: 'Invalid verification token' });
          setGlobalError('The verification code you entered is incorrect.');
        }
      } else if (currentStep === 2) {
        setCurrentStep(3);
      } else if (currentStep === 3) {
        setGlobalSuccess(translations[currentLanguage as keyof typeof translations]?.signupSuccess || 'Account created successfully! Redirecting...');
        setTimeout(() => {
          onClose();
          // In real app, redirect to dashboard
        }, 2000);
      }
    } else if (authType === 'login') {
      setGlobalSuccess(translations[currentLanguage as keyof typeof translations]?.loginSuccess || 'Login successful! Redirecting...');
      setTimeout(() => {
        onClose();
        // In real app, redirect to dashboard
      }, 2000);
      rateLimit.resetRateLimit();
    }
  };

  const handleResendToken = () => {
    if (resendCooldown > 0) return;
    
    setGlobalSuccess(translations[currentLanguage as keyof typeof translations]?.verificationSent || 'Verification code sent! Check your inbox/messages.');
    setResendCooldown(60);
  };

  const isFormValid = () => {
    if (authType === 'signup') {
      if (currentStep === 0) {
        return formData.identifier && !errors.identifier;
      } else if (currentStep === 1) {
        return formData.token && !errors.token;
      } else if (currentStep === 2) {
        return formData.password && formData.confirmPassword && 
               !errors.password && !errors.confirmPassword;
      } else if (currentStep === 3) {
        return formData.firstName && formData.lastName && 
               formData.termsAccepted && captchaSolved;
      }
      return true;
    }
    
    return formData.identifier && formData.password && 
           !errors.identifier && !errors.password && captchaSolved;
  };

  const renderSignupForm = () => {
    if (currentStep === 1) {
      return (
        <>
          <div className="text-center py-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isPhone ? 'Check your phone' : 'Check your inbox'}
            </h3>
            <p className="text-gray-600 mb-4">
              We've sent a 6-digit verification code to{' '}
              <span className="font-medium">{formData.identifier}</span>
            </p>
          </div>
          
          <AuthInputField
            label="Verification Code"
            id="token"
            value={formData.token}
            onChange={handleChange}
            error={errors.token}
            placeholder="123456"
            required
            currentLanguage={currentLanguage}
          />
          
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={handleResendToken}
              disabled={resendCooldown > 0}
              className={`text-sm font-medium ${
                resendCooldown > 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-green-600 hover:text-green-500'
              }`}
            >
              {resendCooldown > 0 ? (
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <span className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {translations[currentLanguage as keyof typeof translations]?.resendCode || 'Resend code'}
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setCurrentStep(0)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Change {isPhone ? 'phone' : 'email'}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full mt-6 py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !isFormValid()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            }`}
          >
            {translations[currentLanguage as keyof typeof translations]?.verifyCode || 'Verify Code'}
          </button>
        </>
      );
    }
    
    return (
      <>
        {currentStep === 0 && (
          <AuthInputField
            label={translations[currentLanguage as keyof typeof translations]?.emailOrPhone || "Email or Phone Number"}
            id="identifier"
            type={isPhone ? "tel" : "email"}
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
            placeholder={isPhone ? "+1234567890" : "you@example.com"}
            required
            icon={isPhone ? PhoneIcon : Mail}
            currentLanguage={currentLanguage}
          />
        )}
        
        {currentStep === 2 && (
          <>
            <AuthInputField
              label={translations[currentLanguage as keyof typeof translations]?.password || "Password"}
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
              icon={Lock}
              showPasswordToggle
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              currentLanguage={currentLanguage}
            />
            <PasswordStrength password={formData.password} />
            
            <AuthInputField
              label={translations[currentLanguage as keyof typeof translations]?.confirmPassword || "Confirm Password"}
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
              icon={Lock}
              showPasswordToggle
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              currentLanguage={currentLanguage}
            />
          </>
        )}
        
        {currentStep === 3 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <AuthInputField
                label={translations[currentLanguage as keyof typeof translations]?.firstName || "First Name"}
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="John"
                required
                icon={User}
                currentLanguage={currentLanguage}
              />
              <AuthInputField
                label={translations[currentLanguage as keyof typeof translations]?.lastName || "Last Name"}
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Doe"
                required
                icon={User}
                currentLanguage={currentLanguage}
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  aria-describedby="terms-error"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {translations[currentLanguage as keyof typeof translations]?.terms || "I agree to the Terms of Service and Privacy Policy"}
                </span>
              </label>
              {errors.termsAccepted && (
                <p id="terms-error" className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.termsAccepted}
                </p>
              )}
            </div>
            
            {formData.termsAccepted && (
              <CaptchaComponent 
                onSolve={setCaptchaSolved} 
                solved={captchaSolved} 
              />
            )}
          </>
        )}
        
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !isFormValid()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {currentStep === 0 ? (translations[currentLanguage as keyof typeof translations]?.sendVerification || 'Send Verification Code') : 
           currentStep === 1 ? (translations[currentLanguage as keyof typeof translations]?.verifyCode || 'Verify Code') :
           currentStep === 2 ? (translations[currentLanguage as keyof typeof translations]?.setPassword || 'Set Password') :
           (translations[currentLanguage as keyof typeof translations]?.completeSignup || 'Complete Signup')}
        </button>
      </>
    );
  };

  const renderLoginForm = () => {
    const { isLocked, lockoutTime, lockoutDuration } = loginRateLimit;
    
    return (
      <>
        {isLocked && (
          <LockoutMessage 
            lockoutTime={lockoutTime} 
            lockoutDuration={lockoutDuration}
            currentLanguage={currentLanguage}
          />
        )}
        
        {globalError && <ErrorAlert message={globalError} />}
        {globalSuccess && <SuccessAlert message={globalSuccess} />}
        
        <AuthInputField
          label={translations[currentLanguage as keyof typeof translations]?.emailOrPhone || "Email or Phone Number"}
          id="identifier"
          type={isPhone ? "tel" : "email"}
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          placeholder={isPhone ? "+1234567890" : "you@example.com"}
          required
          icon={isPhone ? PhoneIcon : Mail}
          currentLanguage={currentLanguage}
        />
        <AuthInputField
          label={translations[currentLanguage as keyof typeof translations]?.password || "Password"}
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
          required
          icon={Lock}
          showPasswordToggle
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          currentLanguage={currentLanguage}
        />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              {translations[currentLanguage as keyof typeof translations]?.rememberMe || "Remember me"}
            </label>
          </div>
          <div className="text-sm">
            <button
              onClick={() => {/* Handle forgot password */}}
              className="font-medium text-green-600 hover:text-green-500 focus:outline-none"
            >
              {translations[currentLanguage as keyof typeof translations]?.forgotPassword || "Forgot Password?"}
            </button>
          </div>
        </div>
        
        <CaptchaComponent 
          onSolve={setCaptchaSolved} 
          solved={captchaSolved} 
        />
        
        <button
          type="submit"
          disabled={!isFormValid() || isLocked}
          className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !isFormValid() || isLocked
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          {translations[currentLanguage as keyof typeof translations]?.login || "Login"}
        </button>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {translations[currentLanguage as keyof typeof translations]?.orContinueWith || "Or continue with"}
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {authType === 'login' 
              ? (translations[currentLanguage as keyof typeof translations]?.login || 'Login') 
              : (translations[currentLanguage as keyof typeof translations]?.signup || 'Sign Up')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {authType === 'signup' ? renderSignupForm() : renderLoginForm()}
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {authType === 'login' ? (
              <>
                {translations[currentLanguage as keyof typeof translations]?.backToSignup || "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setFormData({
                      identifier: '',
                      password: '',
                      confirmPassword: '',
                      firstName: '',
                      lastName: '',
                      termsAccepted: false,
                      token: ''
                    });
                    setCurrentStep(0);
                  }}
                  className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline"
                >
                  {translations[currentLanguage as keyof typeof translations]?.signup || "Sign Up"}
                </button>
              </>
            ) : (
              <>
                {translations[currentLanguage as keyof typeof translations]?.backToLogin || "Already have an account?"}{' '}
                <button
                  onClick={() => {
                    setFormData({
                      identifier: '',
                      password: '',
                      confirmPassword: '',
                      firstName: '',
                      lastName: '',
                      termsAccepted: false,
                      token: ''
                    });
                    setCurrentStep(0);
                  }}
                  className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline"
                >
                  {translations[currentLanguage as keyof typeof translations]?.login || "Login"}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;