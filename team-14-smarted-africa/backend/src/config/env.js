// @ts-nocheck
// backend/src/config/env.js

// ----------------------------
// Load Environment Variables
// ----------------------------
import dotenv from "dotenv";
dotenv.config(); // Load .env file into process.env

// ----------------------------
// Export Environment Variables
// ----------------------------
const env = {
  // ----------------------------
  // Server & DB
  // ----------------------------
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  dbUri: process.env.MONGO_URI,

  // ----------------------------
  // Security / JWT
  // ----------------------------
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  refreshSecret: process.env.REFRESH_SECRET,
  refreshExpiresIn: process.env.REFRESH_EXPIRES_IN,

  // ----------------------------
  // CORS / Rate Limit
  // ----------------------------
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  // ----------------------------
  // Email (SMTP)
  // ----------------------------
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  emailFrom: process.env.EMAIL_FROM,

  // Frontend
  frontendUrl: process.env.FRONTEND_URL,

  // ----------------------------
  // Paystack
  // ----------------------------
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
  paystackBaseUrl: process.env.PAYSTACK_BASE_URL,

  // ----------------------------
  // Redis
  // ----------------------------
  redisUrl: process.env.REDIS_URL,

  // ----------------------------
  // Stripe (optional)
  // ----------------------------
  // stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  // stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  // clientUrl: process.env.CLIENT_URL,
};

export default env;
