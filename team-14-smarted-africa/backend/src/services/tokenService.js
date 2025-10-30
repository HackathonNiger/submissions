// backend/src/services/tokenService.js

/**
 * Token Service
 * - Handles JWT access tokens and Redis-based refresh tokens
 * - Access tokens: short-lived JWT
 * - Refresh tokens: random strings stored in Redis for fast revocation
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import redis from '../config/redis.js';
import env from '../config/env.js';

// ----------------------------
// Token Expiration Settings
// ----------------------------
const ACCESS_EXPIRES = env.jwtAccessExpires || '15m'; // JWT access token lifespan
const REFRESH_EXPIRES_SECONDS = parseInt(process.env.REFRESH_EXPIRES_SECONDS || String(30 * 24 * 60 * 60), 10); // default 30 days

// ----------------------------
// Generate JWT Access Token
// ----------------------------
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.jwtSecret,
    { expiresIn: ACCESS_EXPIRES }
  );
};

// ----------------------------
// Generate Refresh Token (stored in Redis)
// ----------------------------
export const generateRefreshToken = async (user) => {
  const token = crypto.randomBytes(64).toString('hex');
  await redis.set(`refresh:${token}`, user._id.toString(), 'EX', REFRESH_EXPIRES_SECONDS);
  return token;
};

// ----------------------------
// Verify Refresh Token
// ----------------------------
export const verifyRefreshToken = async (token) => {
  if (!token) throw Object.assign(new Error('No refresh token provided'), { status: 401 });
  const userId = await redis.get(`refresh:${token}`);
  if (!userId) throw Object.assign(new Error('Invalid or revoked refresh token'), { status: 401 });
  return { id: userId };
};

// ----------------------------
// Revoke Refresh Token
// ----------------------------
export const revokeRefreshToken = async (token) => {
  await redis.del(`refresh:${token}`);
};
