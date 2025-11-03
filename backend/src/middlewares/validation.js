const { body, validationResult } = require('express-validator');
const config = require('../config/config');


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Extract and format validation errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    console.error('Validation errors:', formattedErrors);
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

/**
 * User Registration Validation Rules
 * 
 * Validates all fields required for user registration including
 * Nigerian-specific requirements like BVN and NIN.
 */
const validateRegistration = [
  // First Name validation
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens and apostrophes'),

  // Last Name validation
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens and apostrophes'),

  // Email validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must not exceed 100 characters'),

  // Phone Number validation (Nigerian format)
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(config.validation.phoneNumber.pattern)
    .withMessage('Please provide a valid Nigerian phone number (e.g., +2348012345678)'),

  // BVN validation
  body('bvn')
    .trim()
    .notEmpty()
    .withMessage('BVN is required')
    .matches(config.validation.bvn.pattern)
    .withMessage('BVN must be exactly 11 digits')
    .isLength({ min: 11, max: 11 })
    .withMessage('BVN must be exactly 11 digits'),

  // NIN validation
  body('nin')
    .trim()
    .notEmpty()
    .withMessage('NIN is required')
    .matches(config.validation.nin.pattern)
    .withMessage('NIN must be exactly 11 digits')
    .isLength({ min: 11, max: 11 })
    .withMessage('NIN must be exactly 11 digits'),

  // Date of Birth validation
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      // Check if user is at least 18 years old (required for financial services)
      if (age < 18) {
        throw new Error('You must be at least 18 years old to register');
      }
      
      // Check if birth date is not in the future
      if (birthDate > today) {
        throw new Error('Date of birth cannot be in the future');
      }
      
      return true;
    }),

  // Password validation
  body('password')
    .isLength({ min: config.validation.password.minLength })
    .withMessage(`Password must be at least ${config.validation.password.minLength} characters long`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value) => {
      // Check for common weak passwords
      const weakPasswords = ['password', '123456', 'qwerty', 'abc123'];
      if (weakPasswords.includes(value.toLowerCase())) {
        throw new Error('Password is too common. Please choose a stronger password');
      }
      return true;
    }),

  // Handle validation errors
  handleValidationErrors
];

/**
 * User Login Validation Rules
 * 
 * Validates login credentials (phone number and password).
 */
const validateLogin = [
  // Phone Number validation
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(config.validation.phoneNumber.pattern)
    .withMessage('Please provide a valid Nigerian phone number'),

  // Password validation (basic check for login)
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty'),

  // Handle validation errors
  handleValidationErrors
];

/**
 * User Verification Validation Rules
 * 
 * Validates the final verification step where users provide their address.
 */
const validateVerification = [
  // Address validation
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters')
    .matches(/^[a-zA-Z0-9\s,.-]+$/)
    .withMessage('Address contains invalid characters'),

  // Handle validation errors
  handleValidationErrors
];

/**
 * Password Reset Validation Rules
 * 
 * Validates email for password reset requests.
 */
const validatePasswordReset = [
  // Email validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Handle validation errors
  handleValidationErrors
];

/**
 * Password Update Validation Rules
 * 
 * Validates new password when user is updating their password.
 */
const validatePasswordUpdate = [
  // Current password validation
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  // New password validation (same rules as registration)
  body('newPassword')
    .isLength({ min: config.validation.password.minLength })
    .withMessage(`New password must be at least ${config.validation.password.minLength} characters long`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => {
      // Ensure new password is different from current password
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),

  // Confirm password validation
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),

  // Handle validation errors
  handleValidationErrors
];

/**
 * Sanitize User Input
 * 
 * Additional middleware to sanitize and normalize user input
 * for security and consistency.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    // Remove any fields that start with $ (potential NoSQL injection)
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('$')) {
        delete req.body[key];
      }
    });
    
    // Trim whitespace from string fields
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
};

// Export all validation middleware
module.exports = {
  validateRegistration,
  validateLogin,
  validateVerification,
  validatePasswordReset,
  validatePasswordUpdate,
  sanitizeInput,
  handleValidationErrors
};