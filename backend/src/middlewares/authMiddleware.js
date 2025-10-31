const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const config = require('../config/config');
const {
  AuthenticationError,
  AuthorizationError,
  asyncErrorHandler
} = require('./errorHandler');

/**
 * Extract Token from Request
 * 
 * Extracts JWT token from httpOnly cookie or Authorization header.
 * Prioritizes cookie over header for security.
 * 
 * @param {Object} req - Express request object
 * @returns {string|null} JWT token or null if not found
 */

const extractToken = (req) => {
  let token = null;
  
  // 1. First priority: httpOnly cookie (most secure)
  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
    console.log('🍪 Token extracted from httpOnly cookie');
  }
  
  // 2. Fallback: Authorization header (for API clients that can't use cookies)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('📋 Token extracted from Authorization header');
  }
  
  return token;
};

/**
 * Verify JWT Token
 * 
 * Verifies the JWT token and returns the decoded payload.
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {AuthenticationError} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if token has required fields
    if (!decoded.id) {
      throw new AuthenticationError('Invalid token format');
    }
    
    // Check token age (additional security check)
    const tokenAge = Date.now() / 1000 - decoded.iat;
    const maxAge = 24 * 60 * 60; // 24 hours in seconds
    
    if (tokenAge > maxAge) {
      throw new AuthenticationError('Token is too old. Please login again');
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Your session has expired. Please login again');
    } else if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid authentication token');
    } else if (error.name === 'NotBeforeError') {
      throw new AuthenticationError('Token not active yet');
    } else {
      // Re-throw custom authentication errors
      throw error;
    }
  }
};

/**
 * Load User from Database
 * 
 * Loads user information from database and attaches to request object.
 * 
 * @param {string} userId - User ID from token
 * @returns {Object} User document from database
 * @throws {AuthenticationError} If user not found or account issues
 */
const loadUser = async (userId) => {
  try {
    // Find user by ID and exclude sensitive fields
    const user = await User.findById(userId).select('-password -bvn -nin');
    
    if (!user) {
      throw new AuthenticationError('User account not found. Please login again');
    }
    
    // Check if user account is active (you can add more checks here)
    // For example: if user is banned, suspended, etc.
    if (user.isDeactivated) {
      throw new AuthenticationError('User account has been deactivated');
    }
    
    return user;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new AuthenticationError('Invalid user identifier');
    }
    throw error;
  }
};

/**
 * Main Authentication Middleware
 * 
 * Protects routes by verifying JWT tokens and loading user information.
 * This middleware should be used on all protected routes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = asyncErrorHandler(async (req, res, next) => {
  console.log(`🔐 Authentication check for: ${req.method} ${req.originalUrl}`);
  
  // Extract token from request
  const token = extractToken(req);
  
  if (!token) {
    throw new AuthenticationError('Access denied. No authentication token provided');
  }
  
  try {
    // Verify the token
    const decoded = verifyToken(token);
    
    // Load user from database
    const user = await loadUser(decoded.id);
    
    // Attach user to request object for use in route handlers
    req.user = user;
    req.tokenDecoded = decoded;
    
    console.log(`✅ Authentication successful for user: ${user._id}`);
    
    // Proceed to next middleware/route handler
    next();
    
  } catch (error) {
    console.error(`❌ Authentication failed for ${req.originalUrl}:`, error.message);
    
    // Clear invalid cookie if present
    if (req.cookies && req.cookies.authToken) {
      res.clearCookie('authToken');
    }
    
    throw error;
  }
});

/**
 * Optional Authentication Middleware
 * 
 * Similar to protect middleware but doesn't throw error if no token is provided.
 * Useful for routes that work for both authenticated and unauthenticated users.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = asyncErrorHandler(async (req, res, next) => {
  // Extract token from request
  const token = extractToken(req);
  
  if (token) {
    try {
      // Verify the token
      const decoded = verifyToken(token);
      
      // Load user from database
      const user = await loadUser(decoded.id);
      
      // Attach user to request object
      req.user = user;
      req.tokenDecoded = decoded;
      
      console.log(`✅ Optional authentication successful for user: ${user._id}`);
    } catch (error) {
      console.warn(`⚠️ Optional authentication failed: ${error.message}`);
      
      // Clear invalid cookie if present
      if (req.cookies && req.cookies.authToken) {
        res.clearCookie('authToken');
      }
      
      // Don't throw error for optional auth - just continue without user
    }
  }
  
  next();
});

/**
 * Role-Based Authorization Middleware
 * 
 * Checks if authenticated user has required role(s).
 * Must be used after the protect middleware.
 * 
 * @param {...string} roles - Required roles
 * @returns {Function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      throw new AuthenticationError('Authentication required for this action');
    }
    
    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      );
    }
    
    console.log(`✅ Authorization successful for user: ${req.user._id} with role: ${req.user.role}`);
    next();
  };
};

/**
 * Verification Status Check Middleware
 * 
 * Ensures that the user's account is verified before allowing access.
 * Must be used after the protect middleware.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireVerification = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }
  
  // Check if user is verified
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required',
      error: 'VERIFICATION_REQUIRED',
      user: {
        _id: req.user._id,
        isVerified: req.user.isVerified
      }
    });
  }
  
  console.log(`✅ Verification check passed for user: ${req.user._id}`);
  next();
};

/**
 * Admin Only Middleware
 * 
 * Convenience middleware for admin-only routes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const adminOnly = authorize('admin');

/**
 * Rate Limiting by User ID
 * 
 * Additional rate limiting based on authenticated user ID.
 * Useful for preventing abuse from authenticated users.
 * 
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Express middleware function
 */
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequestCounts = new Map();
  
  return (req, res, next) => {
    if (!req.user) {
      return next(); // Skip if not authenticated
    }
    
    const userId = req.user._id.toString();
    const now = Date.now();
    
    // Clean up old entries
    for (const [key, data] of userRequestCounts.entries()) {
      if (now - data.resetTime > windowMs) {
        userRequestCounts.delete(key);
      }
    }
    
    // Get or create user request data
    let userData = userRequestCounts.get(userId);
    if (!userData || now - userData.resetTime > windowMs) {
      userData = { count: 0, resetTime: now };
    }
    
    // Check if limit exceeded
    if (userData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this user',
        retryAfter: Math.ceil((windowMs - (now - userData.resetTime)) / 1000)
      });
    }
    
    // Increment count and update
    userData.count++;
    userRequestCounts.set(userId, userData);
    
    next();
  };
};

// Export all middleware functions
module.exports = {
  protect,
  optionalAuth,
  authorize,
  requireVerification,
  adminOnly,
  userRateLimit,
  
  // Utility functions for testing
  extractToken,
  verifyToken,
  loadUser
};