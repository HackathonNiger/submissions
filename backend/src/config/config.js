const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET'
];

/**
 * Validate that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
const validateEnvVars = () => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
};


const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    // Enable detailed error messages only in development
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  },

  // Database Configuration
  database: {
    mongoUri: process.env.MONGO_URI,
    // Note: Modern Mongoose versions handle most connection options automatically
    // We'll specify options directly in the connection call
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    // Token expiration time (1 hour for access tokens)
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    // Refresh token expiration (7 days)
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Security Configuration
  security: {
    // Rate limiting
    rateLimit: {
      // Maximum requests per window
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      // Time window in minutes
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
    },
    // CORS settings
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true // Allow cookies to be sent
    },
    // Cookie settings for JWT tokens
    cookie: {
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
    }
  },

  // Validation Configuration
  validation: {
    // Password requirements
    password: {
      minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 6,
      requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
      requireSymbols: process.env.PASSWORD_REQUIRE_SYMBOLS !== 'false'
    },
    // Nigerian phone number validation
    phoneNumber: {
      // Nigerian phone number pattern
      pattern: /^(\+234|234|0)[789][01]\d{8}$/
    },
    // BVN validation (11 digits)
    bvn: {
      pattern: /^\d{11}$/,
      length: 11
    },
    // NIN validation (11 digits)
    nin: {
      pattern: /^\d{11}$/,
      length: 11
    }
  }
};

/**
 * Initialize configuration
 * Validates environment variables and returns config object
 * 
 * @returns {Object} Configuration object
 * @throws {Error} If validation fails
 */
const initializeConfig = () => {
  try {
    // Validate required environment variables
    validateEnvVars();
    
    console.log('✅ Environment variables validated successfully');
    console.log(`🚀 Server will run on port ${config.server.port}`);
    console.log(`🌍 Environment: ${config.server.nodeEnv}`);
    
    return config;
  } catch (error) {
    console.error('❌ Configuration Error:', error.message);
    process.exit(1); // Exit the application if configuration is invalid
  }
};

// Export the initialized configuration
module.exports = initializeConfig();