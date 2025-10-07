import Cookies from 'js-cookie';

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
};

const TOKEN_COOKIE_NAME = 'gestpay_token';
const USER_COOKIE_NAME = 'gestpay_user';

// Token management functions
export const tokenUtils = {
  // Set token in both cookies and localStorage
  setToken: (token) => {
    if (!token) return;
    
    console.log('Setting token:', token);
    
    // Set in cookies (more reliable for SSR)
    Cookies.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
    
    // Also set in localStorage as fallback
    if (typeof window !== 'undefined') {
      localStorage.setItem('gestpay_token', token);
    }
  },

  // Get token from cookies first, then localStorage
  getToken: () => {
    // Try cookies first (works with SSR)
    let token = Cookies.get(TOKEN_COOKIE_NAME);
    
    // Fallback to localStorage
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('gestpay_token');
      
      // If found in localStorage, sync to cookies
      if (token && token !== 'undefined' && token !== 'null') {
        Cookies.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
      }
    }
    
    console.log('Getting token:', token ? 'present' : 'missing');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  },

  // Remove token from both storage methods
  removeToken: () => {
    console.log('Removing token');
    
    // Remove from cookies
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gestpay_token');
    }
  },

  // Set user data
  setUser: (user) => {
    if (!user) return;
    
    const userString = JSON.stringify(user);
    console.log('Setting user data');
    
    // Set in cookies
    Cookies.set(USER_COOKIE_NAME, userString, COOKIE_OPTIONS);
    
    // Also set in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gestpay_user', userString);
    }
  },

  // Get user data
  getUser: () => {
    // Try cookies first
    let userString = Cookies.get(USER_COOKIE_NAME);
    
    // Fallback to localStorage
    if (!userString && typeof window !== 'undefined') {
      userString = localStorage.getItem('gestpay_user');
      
      // If found in localStorage, sync to cookies
      if (userString && userString !== 'undefined' && userString !== 'null') {
        Cookies.set(USER_COOKIE_NAME, userString, COOKIE_OPTIONS);
      }
    }
    
    if (userString && userString !== 'undefined' && userString !== 'null') {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    
    return null;
  },

  // Remove user data
  removeUser: () => {
    console.log('Removing user data');
    
    // Remove from cookies
    Cookies.remove(USER_COOKIE_NAME, { path: '/' });
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gestpay_user');
    }
  },

  // Clear all auth data
  clearAuth: () => {
    console.log('Clearing all auth data');
    tokenUtils.removeToken();
    tokenUtils.removeUser();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenUtils.getToken();
    return !!token;
  }
};
