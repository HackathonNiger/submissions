import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Individual Code Input Component
const CodeInput = ({ index, value, onChange, onKeyDown, inputRefs }) => {
  return (
    <input
      ref={inputRefs[index]}
      type="text"
      maxLength="1"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      className="w-16 h-16 text-center text-2xl font-bold bg-transparent border-2 border-green-400 rounded-xl text-white focus:border-green-300 focus:outline-none transition-all duration-300 hover:border-green-300"
    />
  );
};

const EmailVerifyPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 min

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    if (!email) {
      navigate('/register'); // If no email in state, redirect
    }
  }, [email, navigate]);

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Move to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.join('').length === 6 && !newCode.includes('')) {
      handleVerify();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerify(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if full code pasted
    if (newCode.join('').length === 6 && !newCode.includes('')) {
      handleVerify();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:1180/api/users/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, code: verificationCode })
      });

      // Check if response is ok first
      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = 'Verification failed';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textResponse = await res.text();
            errorMessage = textResponse || `Server error: ${res.status}`;
          }
        } catch (parseError) {
          errorMessage = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON response');
      }

      const data = await res.json();
      setSuccess(data.message || 'Email verified successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        let errorMessage = 'Failed to resend code';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const textResponse = await res.text();
            errorMessage = textResponse || `Server error: ${res.status}`;
          }
        } catch (parseError) {
          errorMessage = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON response');
      }

      const data = await res.json();
      setSuccess('New verification code sent to your email!');
      setCanResend(false);
      setCountdown(600);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full px-6 py-4 relative" style={{ background: '#101727' }}>
      {/* Green elliptical blur effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          left: '15%',
          width: '400px',
          height: '200px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.3,
          zIndex: 1
        }}
      />
      
      {/* Another blur effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '60%',
          right: '10%',
          width: '300px',
          height: '150px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.2,
          zIndex: 1
        }}
      />

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-12 py-4 relative overflow-hidden w-full max-w-[95%] mx-auto mb-8"
        style={{
          background: 'rgba(19, 21, 27, 0.03)',
          backdropFilter: 'blur(7.4px)',
          borderRadius: '17px',
          zIndex: 10
        }}
      >
        {/* Gradient border */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            borderRadius: '17px',
            padding: '1px',
            background: 'linear-gradient(to bottom, #aaa 0%, #019438 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude'
          }}
        />

        <div className="text-green-400 font-bold text-xl relative z-10">
          PathWise AI
        </div>
        <a href="/course-selection" className="text-white hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 relative z-10">
          <span>🏠</span>
          <span>Home</span>
        </a>
      </nav>

      {/* Email Verify Form Container */}
      <div className="flex items-center justify-center min-h-[70vh] relative z-10">
        <div
          className="w-full max-w-lg p-8 relative overflow-hidden"
          style={{
            background: 'rgba(19, 21, 27, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
          }}
        >
          {/* Gradient border */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              borderRadius: '20px',
              padding: '1px',
              background: 'linear-gradient(to bottom, #aaa 0%, #019438 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude'
            }}
          />

          {/* Page Title */}
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-300 mb-2">
              Enter the 6-digit code we sent to
            </p>
            <p className="text-green-400 font-semibold">{email}</p>
          </div>

          {/* Verification Form */}
          <div className="space-y-6 relative z-10">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <CodeInput
                  key={index}
                  index={index}
                  value={digit}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  inputRefs={inputRefs}
                />
              ))}
            </div>

            {error && (
              <div className="text-center">
                <p className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-400/30">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="text-center">
                <p className="text-green-400 text-sm bg-green-900/20 p-3 rounded-lg border border-green-400/30">
                  {success}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || code.join('').length !== 6}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                loading || code.join('').length !== 6
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-400"
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center pt-3">
              <p className="text-gray-300 text-sm mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="text-green-400 hover:text-green-300 font-medium underline underline-offset-2 disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <p className="text-gray-400 text-sm">
                  Resend code in {formatCountdown(countdown)}
                </p>
              )}
            </div>

            <div className="text-center pt-4 border-t border-gray-600/30">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-gray-300 hover:text-green-400 text-sm font-medium underline underline-offset-2 transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyPage;