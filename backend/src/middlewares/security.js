const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('../config/config');

/**
 * Configure CORS (Cross-Origin Resource Sharing)
 * 
 * Why CORS is important:
 * - Controls which domains can access your API
 * - Prevents unauthorized cross-origin requests
 * - Essential for frontend-backend communication
 * 
 * @returns {Function} CORS middleware
 */
const configureCors = () => {
  return cors({
    origin: config.security.cors.origin,
    credentials: config.security.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
  });
};

/**
 * Configure Helmet for Security Headers
 * 
 * Helmet sets various HTTP headers to secure Express apps:
 * - X-Content-Type-Options: nosniff (prevents MIME type sniffing)
 * - X-Frame-Options: DENY (prevents clickjacking)
 * - X-XSS-Protection: 1; mode=block (enables XSS filtering)
 * - And many more...
 * 
 * @returns {Function} Helmet middleware
 */
const configureHelmet = () => {
  return helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    // Cross-Origin Embedder Policy
    crossOriginEmbedderPolicy: config.server.isProduction,
    // Only enable HSTS in production with HTTPS
    hsts: config.server.isProduction ? {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    } : false
  });
};

/**
 * General Rate Limiting
 * 
 * Prevents abuse by limiting the number of requests from a single IP
 * within a specified time window.
 * 
 * @returns {Function} Rate limiting middleware
 */
const generalRateLimit = rateLimit({
  windowMs: config.security.rateLimit.windowMs * 60 * 1000, // Convert minutes to milliseconds
  max: config.security.rateLimit.max,
  message: {
    error: 'Too many requests from this IP',
    message: `Please try again after ${config.security.rateLimit.windowMs} minutes`,
    retryAfter: config.security.rateLimit.windowMs * 60
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Don't specify keyGenerator - let express-rate-limit use its default
  // which properly handles both IPv4 and IPv6 addresses
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

/**
 * Strict Rate Limiting for Authentication Routes
 * 
 * More restrictive rate limiting for sensitive authentication endpoints
 * to prevent brute force attacks.
 * 
 * @returns {Function} Strict rate limiting middleware
 */
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth routes
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again after 15 minutes',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Reset count on successful authentication
  skipSuccessfulRequests: true,
  // Custom handler for when limit is exceeded
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} on route: ${req.originalUrl}`);
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again after 15 minutes',
      retryAfter: 15 * 60
    });
  }
});

/**
 * Request Logging Middleware
 * 
 * Logs incoming requests for monitoring and debugging.
 * Only logs detailed info in development.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request in development
  if (config.server.isDevelopment) {
    console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);
  }
  
  // Log response time and status when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 400) {
      console.error(`❌ ${logMessage}`);
    } else if (config.server.isDevelopment) {
      console.log(`✅ ${logMessage}`);
    }
  });
  
  next();
};

/**
 * Security Headers Middleware
 * 
 * Additional custom security headers not covered by Helmet
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const additionalSecurityHeaders = (req, res, next) => {
  // Remove X-Powered-By header to hide Express
  res.removeHeader('X-Powered-By');
  
  // Add custom API version header
  res.setHeader('X-API-Version', '1.0');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

/**
 * Apply All Security Middlewares
 * 
 * This function applies all security middlewares to the Express app
 * in the correct order.
 * 
 * @param {Object} app - Express application instance
 */
const applySecurity = (app) => {
  console.log('🔒 Applying security middlewares...');
  
  // 1. Request logging (should be first to log all requests)
  app.use(requestLogger);
  
  // 2. CORS configuration (must be early in the middleware stack)
  app.use(configureCors());
  
  // 3. Helmet for security headers
  app.use(configureHelmet());
  
  // 4. Additional custom security headers
  app.use(additionalSecurityHeaders);
  
  // 5. General rate limiting (applied to all routes)
  app.use(generalRateLimit);
  
  console.log('✅ Security middlewares applied successfully');
};

// Export middlewares and configuration function
module.exports = {
  applySecurity,
  authRateLimit,
  generalRateLimit,
  requestLogger
};