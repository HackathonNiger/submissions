// @ts-nocheck
// backend/src/app.js

// ----------------------------
// Import Modules
// ----------------------------
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import router from "./routes/index.js"; // Centralized route imports

// ----------------------------
// Initialize Express App
// ----------------------------
const app = express();

// ----------------------------
// Middleware
// ----------------------------

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable if using inline scripts (React/Vite)
  })
);

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN, // e.g., http://localhost:3000 or Vercel URL
    credentials: true,       // Allow cookies to be sent cross-domain
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser (for refresh tokens)
app.use(cookieParser());

// Logging requests
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // Less verbose in production
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // default 15 minutes
  max: env.RATE_LIMIT_MAX || 100,                         // default 100 requests per window
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// ----------------------------
// Mount Routes
// ----------------------------
app.use('/api', router);

// ----------------------------
// Health Check Route
// ----------------------------
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// ----------------------------
// 404 Handler
// ----------------------------
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ----------------------------
// Global Error Handler
// ----------------------------
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// ----------------------------
// Export App
// ----------------------------
export default app;
