// backend/src/middleware/errorHandler.js

// ----------------------------
// Import Utilities
// ----------------------------
import logger from '../utils/logger.js';
import { serverError, fail } from '../utils/response.js';

// ----------------------------
// Not Found Middleware
// ----------------------------
// Handles 404 errors for undefined routes
export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
};

// ----------------------------
// Global Error Handler Middleware
// ----------------------------
// Handles all errors thrown in routes or middleware
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500; // Default to 500
  const message = err.message || 'Internal Server Error';

  // Log full error stack for debugging
  logger.error('ErrorHandler:', err.stack || err);

  // Handle duplicate key errors from MongoDB
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    return fail(
      res,
      `Duplicate value for field(s): ${field}`,
      { field, keyValue: err.keyValue },
      409
    );
  }

  // Handle Mongoose validation errors
  if (err.errors && Array.isArray(err.errors)) {
    return fail(res, 'Validation failed', err.errors, 400);
  }

  // For server errors (status >= 500)
  if (status >= 500) return serverError(res, message);

  // For other errors (client-side)
  return fail(res, message, err.errors || null, status);
};
