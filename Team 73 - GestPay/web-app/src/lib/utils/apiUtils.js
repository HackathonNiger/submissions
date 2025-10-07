// API utility functions for common operations

/**
 * Format currency amount for display
 * @param {string|number} amount - The amount to format
 * @param {string} currency - Currency code (default: NGN)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'NGN') => {
  // Remove commas and other non-numeric characters except decimal point and minus sign
  const cleanAmount = String(amount).replace(/[^\d.-]/g, '');
  const numAmount = parseFloat(cleanAmount) || 0;
  
  if (currency === 'NGN') {
    return `₦${numAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return `${currency} ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format transaction type for display
 * @param {string} type - Transaction type (debit/credit)
 * @returns {object} Formatted type with color and label
 */
export const formatTransactionType = (type) => {
  switch (type?.toLowerCase()) {
    case 'debit':
      return {
        label: 'Sent',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        sign: '-'
      };
    case 'credit':
      return {
        label: 'Received',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        sign: '+'
      };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        sign: ''
      };
  }
};

/**
 * Format transaction status for display
 * @param {string} status - Transaction status
 * @returns {object} Formatted status with color and label
 */
export const formatTransactionStatus = (status) => {
  switch (status?.toLowerCase()) {
    case 'successful':
      return {
        label: 'Successful',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        dotColor: 'bg-green-500'
      };
    case 'pending':
      return {
        label: 'Pending',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        dotColor: 'bg-yellow-500'
      };
    case 'failed':
      return {
        label: 'Failed',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        dotColor: 'bg-red-500'
      };
    case 'reversed':
      return {
        label: 'Reversed',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        dotColor: 'bg-purple-500'
      };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        dotColor: 'bg-gray-500'
      };
  }
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string or formatted date
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  let date;
  
  // Handle different date formats
  if (dateString.includes('T') || dateString.includes('-')) {
    // ISO format or YYYY-MM-DD format
    date = new Date(dateString);
  } else {
    // Handle formats like "6 Oct 2025"
    date = new Date(dateString);
  }
  
  // If date is invalid, return the original string
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString, { year: 'numeric', month: 'short', day: 'numeric' });
  }
};

/**
 * Extract error message from API error
 * @param {object} error - API error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  // Handle specific error codes
  switch (error?.data?.error_code) {
    case 'INVALID_TOKEN':
      return 'Your session has expired. Please log in again.';
    case 'INSUFFICIENT_BALANCE':
      return 'Insufficient balance for this transaction.';
    case 'USER_NOT_FOUND':
      return 'User not found.';
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password.';
    case 'MISSING_FIELDS':
      return 'Please fill in all required fields.';
    case 'PIN_REQUIRED':
      return 'Transaction PIN is required.';
    case 'INVALID_PIN':
      return 'Invalid transaction PIN.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Nigerian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const isValidNigerianPhone = (phone) => {
  const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle Nigerian numbers
  if (digits.startsWith('234')) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  } else if (digits.startsWith('0') && digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  
  return phone;
};

/**
 * Generate transaction reference
 * @returns {string} Unique transaction reference
 */
export const generateTransactionRef = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN${timestamp}${random}`.toUpperCase();
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};
