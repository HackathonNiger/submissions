import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRetypePasswordChange = (e) => {
    setRetypePassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== retypePassword) {
      setError('Passwords do not match');
      return;
    }

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting registration for:', formData.email);
      
      const res = await fetch('http://localhost:1180/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      // Get response text first to debug
      const responseText = await res.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(responseData.message || `Server error: ${res.status}`);
      }

      console.log('Registration successful:', responseData);

      // Store the email for verification step
      try {
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);
        localStorage.setItem('verifyEmail', formData.email);
        console.log('Email stored in localStorage:', formData.email);
      } catch (storageError) {
        console.warn('LocalStorage not available:', storageError);
        // Continue anyway, pass email as state
      }

      // Add a small delay to ensure localStorage is set
      setTimeout(() => {
        console.log('Navigating to /verify');
        
        // Navigate with state as fallback if localStorage fails
        navigate('/verify', { 
          state: { email: formData.email },
          replace: true // Use replace to prevent going back to register
        });
      }, 100);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      
      {/* Another blur effect for more ambiance */}
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

      {/* Navbar with gradient border */}
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
        <a href="/" className="text-white hover:text-green-400 transition-colors duration-200 flex items-center space-x-2 relative z-10">
          <span>🏠</span>
          <span>Home</span>
        </a>
      </nav>

      {/* Register Form Container */}
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
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Sign up to get started with PathWise AI</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg relative z-10">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="flex space-x-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C7.52246 5 3.73226 7.94288 2.45801 12C3.73226 16.0571 7.52246 19 12 19C16.4775 19 20.2677 16.0571 21.542 12C20.2677 7.94288 16.4775 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showRetypePassword ? "text" : "password"}
                placeholder="Retype Password"
                value={retypePassword}
                onChange={handleRetypePasswordChange}
                required
                className="w-full px-4 py-3 pr-12 bg-transparent border border-green-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-300 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                {showRetypePassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C7.52246 5 3.73226 7.94288 2.45801 12C3.73226 16.0571 7.52246 19 12 19C16.4775 19 20.2677 16.0571 21.542 12C20.2677 7.94288 16.4775 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
                loading 
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-400'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 relative z-10">
            <p className="text-gray-300">
              Already have an account?{' '}
              <a href="/login" className="text-green-400 hover:text-green-300 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;