// src/middlewares/errorHandler.js

/**
 * Comprehensive Error Handling Middleware
 * 
 * This module provides centralized error handling for the entire application.
 * It catches all errors, formats them consistently, and provides appropriate
 * responses based on the error type and environment.
 */

const config = require('../config/config');

/**
 * Custom Error Classes
 * 
 * These custom error classes help us categorize and handle different
 * types of errors more effectively.
 */

/**
 * Application Error Class
 * 
 * Base class for all application-specific errors.
 * Extends the built-in Error class with additional properties.
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Indicates this is an expected error
    
    // Capture stack trace excluding this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error Class
 * 
 * Specific error class for validation failures.
 */
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

/**
 * Authentication Error Class
 * 
 * Specific error class for authentication failures.
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Authorization Error Class
 * 
 * Specific error class for authorization failures.
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Not Found Error Class
 * 
 * Specific error class for resource not found errors.
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

/**
 * Database Error Class
 * 
 * Specific error class for database-related errors.
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

/**
 * Handle Mongoose Validation Errors
 * 
 * Converts Mongoose validation errors into a consistent format.
 * 
 * @param {Error} error - Mongoose validation error
 * @returns {ValidationError} Formatted validation error
 */
const handleMongooseValidationError = (error) => {
  const errors = Object.keys(error.errors).map(key => ({
    field: key,
    message: error.errors[key].message,
    value: error.errors[key].value
  }));
  
  return new ValidationError('Validation failed', errors);
};

/**
 * Handle Mongoose Duplicate Key Errors
 * 
 * Converts MongoDB duplicate key errors into user-friendly messages.
 * 
 * @param {Error} error - MongoDB duplicate key error
 * @returns {ValidationError} Formatted validation error
 */
const handleMongoDuplicateKeyError = (error) => {
  // Extract field name from error message
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  
  let message = `${field} '${value}' already exists`;
  
  // Provide more specific messages for common fields
  if (field === 'email') {
    message = 'An account with this email address already exists';
  } else if (field === 'phoneNumber') {
    message = 'An account with this phone number already exists';
  } else if (field === 'bvn') {
    message = 'This BVN is already registered with another account';
  }
  
  return new ValidationError(message, [{
    field,
    message,
    value
  }]);
};

/**
 * Handle JWT Errors
 * 
 * Converts JWT errors into authentication errors.
 * 
 * @param {Error} error - JWT error
 * @returns {AuthenticationError} Formatted authentication error
 */
const handleJWTError = (error) => {
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Your session has expired. Please login again');
  } else if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid authentication token');
  }
  return new AuthenticationError('Authentication failed');
};

/**
 * Format Error Response
 * 
 * Creates a consistent error response format for the API.
 * 
 * @param {Error} error - The error to format
 * @param {Object} req - Express request object
 * @returns {Object} Formatted error response
 */
const formatErrorResponse = (error, req) => {
  const response = {
    success: false,
    message: error.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };
  
  // Add error code if available
  if (error.errorCode) {
    response.errorCode = error.errorCode;
  }
  
  // Add validation errors if available
  if (error.errors && Array.isArray(error.errors)) {
    response.errors = error.errors;
  }
  
  // Add stack trace in development
  if (config.server.isDevelopment) {
    response.stack = error.stack;
  }
  
  // Add request ID for debugging (if you implement request tracking)
  if (req.requestId) {
    response.requestId = req.requestId;
  }
  
  return response;
};

/**
 * Log Error
 * 
 * Logs errors with appropriate detail level based on environment.
 * 
 * @param {Error} error - The error to log
 * @param {Object} req - Express request object
 */
const logError = (error, req) => {
  const logData = {
    message: error.message,
    statusCode: error.statusCode || 500,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };
  
  // Add user info if available
  if (req.user) {
    logData.userId = req.user._id;
    logData.userEmail = req.user.email;
  }
  
  // Log based on error severity
  if (error.statusCode >= 500) {
    console.error('🚨 SERVER ERROR:', logData);
    if (config.server.isDevelopment) {
      console.error('Stack Trace:', error.stack);
    }
  } else if (error.statusCode >= 400) {
    console.warn('⚠️  CLIENT ERROR:', logData);
  } else {
    console.log('ℹ️  INFO:', logData);
  }
};

/**
 * Global Error Handler Middleware
 * 
 * This is the main error handling middleware that catches all errors
 * in the application and provides consistent error responses.
 * 
 * @param {Error} error - The error that occurred
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const globalErrorHandler = (error, req, res, next) => {
  // If response was already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(error);
  }
  
  let processedError = error;
  
  // Convert known error types to our custom error classes
  if (error.name === 'ValidationError') {
    processedError = handleMongooseValidationError(error);
  } else if (error.code === 11000) {
    processedError = handleMongoDuplicateKeyError(error);
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    processedError = handleJWTError(error);
  } else if (error.name === 'CastError') {
    processedError = new ValidationError('Invalid ID format');
  } else if (!error.isOperational) {
    // For unexpected errors, create a generic server error
    processedError = new AppError('Something went wrong!', 500, 'INTERNAL_SERVER_ERROR');
  }
  
  // Set default status code if not set
  const statusCode = processedError.statusCode || 500;
  
  // Log the error
  logError(processedError, req);
  
  // Format and send error response
  const errorResponse = formatErrorResponse(processedError, req);
  res.status(statusCode).json(errorResponse);
};

/**
 * Async Error Handler Wrapper
 * 
 * Wrapper function to catch async errors in route handlers.
 * This eliminates the need for try-catch blocks in every async route.
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function that catches async errors
 */
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found Handler
 * 
 * Middleware to handle 404 errors for undefined routes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Export all error handling utilities
module.exports = {
  // Error classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  
  // Middleware
  globalErrorHandler,
  asyncErrorHandler,
  notFoundHandler,
  
  // Utility functions
  formatErrorResponse,
  logError
};