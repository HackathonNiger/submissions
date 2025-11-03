import { api } from './api';

/**
 * Register a new user
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} userData.phoneNumber - User's phone number
 * @param {string} userData.password - User's password
 * @param {string} userData.bvn - User's BVN
 * @param {string} userData.nin - User's NIN
 * @param {string} userData.dateOfBirth - User's date of birth
 * @returns {Promise<Object>} Response containing user data
 * 
 * @example
 * const response = await authService.register({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   phoneNumber: '+2348012345678',
 *   password: 'SecurePass123',
 *   bvn: '12345678901',
 *   nin: '12345678901',
 *   dateOfBirth: '1990-01-01'
 * });
 */
const register = async (userData) => {
  try {
    console.log('📝 Registering user:', userData.email);
    
    const response = await api.post('/auth/register', userData);
    
    console.log('✅ Registration successful');
    return response;
    
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    throw error;
  }
};

/**
 * Login user
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.phoneNumber - User's phone number
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response containing user data
 * 
 * @example
 * const response = await authService.login({
 *   phoneNumber: '+2348012345678',
 *   password: 'SecurePass123'
 * });
 */
const login = async (credentials) => {
  try {
    console.log('🔐 Logging in user:', credentials.phoneNumber);
    
    const response = await api.post('/auth/login', credentials);
    
    console.log('✅ Login successful');
    return response;
    
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

/**
 * Logout user
 * 
 * @returns {Promise<Object>} Response confirming logout
 * 
 * @example
 * await authService.logout();
 */
const logout = async () => {
  try {
    console.log('👋 Logging out user');
    
    const response = await api.post('/auth/logout');
    
    console.log('✅ Logout successful');
    return response;
    
  } catch (error) {
    console.error('❌ Logout failed:', error.message);
    throw error;
  }
};

/**
 * Get current user information
 * 
 * @returns {Promise<Object>} Response containing user data
 * 
 * @example
 * const response = await authService.getCurrentUser();
 */
const getCurrentUser = async () => {
  try {
    console.log('👤 Fetching current user');
    
    const response = await api.get('/auth/me');
    
    console.log('✅ User data fetched');
    return response;
    
  } catch (error) {
    console.error('❌ Failed to fetch user:', error.message);
    throw error;
  }
};

/**
 * Verify user account
 * 
 * @param {Object} verificationData - Verification data
 * @param {string} verificationData.address - User's residential address
 * @returns {Promise<Object>} Response containing updated user data
 * 
 * @example
 * const response = await authService.verifyUser({
 *   address: '123 Main Street, Lagos, Nigeria'
 * });
 */
const verifyUser = async (verificationData) => {
  try {
    console.log('🔍 Verifying user account');
    
    const response = await api.put('/auth/verify', verificationData);
    
    console.log('✅ Verification successful');
    return response;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    throw error;
  }
};

/**
 * Refresh authentication token
 * 
 * @returns {Promise<Object>} Response confirming token refresh
 * 
 * @example
 * await authService.refreshToken();
 */
const refreshToken = async () => {
  try {
    console.log('🔄 Refreshing auth token');
    
    const response = await api.post('/auth/refresh');
    
    console.log('✅ Token refreshed');
    return response;
    
  } catch (error) {
    console.error('❌ Token refresh failed:', error.message);
    throw error;
  }
};

/**
 * Auth Service Object
 * 
 * Export all authentication functions as a single object
 */
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  verifyUser,
  refreshToken,
};

export default authService;