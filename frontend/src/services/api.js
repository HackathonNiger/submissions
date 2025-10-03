// src/services/api.js

/**
 * API Service Layer
 * 
 * This module provides a centralized interface for all API calls to the backend.
 * It handles request/response formatting, error handling, and authentication.
 * 
 * Key Features:
 * - Automatic token handling via httpOnly cookies
 * - Consistent error handling and formatting
 * - Request/response interceptors
 * - Base URL configuration
 */

// Base API URL - configure based on environment
// In Vite, environment variables must start with VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log the API URL on startup for debugging
console.log('🔗 API Base URL:', API_BASE_URL);

/**
 * API Error Class
 * 
 * Custom error class for API-related errors with additional context
 */
class APIError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.errors = errors; // Validation errors array
  }
}

/**
 * Make HTTP Request
 * 
 * Core function to make HTTP requests with proper error handling
 * 
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 * @throws {APIError} If request fails
 */
const makeRequest = async (endpoint, options = {}) => {
  try {
    // Construct full URL
    const url = `${API_BASE_URL}${endpoint}`;
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Merge options with defaults
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // CRITICAL: Include cookies in requests
    };
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`);
    }
    
    // Make the request
    const response = await fetch(url, config);
    
    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If response is not JSON, create error
      throw new APIError(
        'Invalid response from server',
        response.status
      );
    }
    
    // Check if request was successful
    if (!response.ok) {
      // Extract error message and validation errors
      const errorMessage = data.message || 'An error occurred';
      const validationErrors = data.errors || null;
      
      throw new APIError(errorMessage, response.status, validationErrors);
    }
    
    // Log success in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Success: ${options.method || 'GET'} ${endpoint}`);
    }
    
    return data;
    
  } catch (error) {
    // Network error or other non-API errors
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network error
    console.error('Network Error:', error);
    throw new APIError(
      'Network error. Please check your internet connection.',
      0
    );
  }
};

/**
 * API Methods
 * 
 * Convenience methods for different HTTP verbs
 */
const api = {
  /**
   * GET Request
   * 
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response data
   */
  get: async (endpoint, params = {}) => {
    // Build query string from params
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return makeRequest(url, {
      method: 'GET',
    });
  },
  
  /**
   * POST Request
   * 
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  post: async (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * PUT Request
   * 
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  put: async (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * DELETE Request
   * 
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Response data
   */
  delete: async (endpoint) => {
    return makeRequest(endpoint, {
      method: 'DELETE',
    });
  },
};

// Export API methods and error class
export { api, APIError };