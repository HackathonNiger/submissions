// backend/src/services/authTokenService.js

/**
 * Redis-backed single-use tokens service
 * --------------------------------------
 * Purpose:
 *  - Email confirmation
 *  - Password reset
 *
 * Keys are namespaced:
 *  <type>:<token> => userId
 * Example types: 'emailConfirm', 'passwordReset'
 */

// ----------------------------
// Import Modules
// ----------------------------
import redis from '../config/redis.js';
import crypto from 'crypto';

// ----------------------------
// Generate a random token
// ----------------------------
export const makeToken = (len = 48) => {
  // crypto.randomBytes returns a buffer; convert to hex string
  return crypto.randomBytes(len).toString('hex');
};

// ----------------------------
// Save token in Redis with expiry
// ----------------------------
export const saveToken = async (type, token, userId, expiresSeconds) => {
  const key = `${type}:${token}`;
  // Set key with TTL in seconds
  await redis.set(key, userId.toString(), 'EX', expiresSeconds);
  return key;
};

// ----------------------------
// Get userId associated with a token
// ----------------------------
export const getUserIdForToken = async (type, token) => {
  const key = `${type}:${token}`;
  return await redis.get(key);
};

// ----------------------------
// Revoke (delete) token from Redis
// ----------------------------
export const revokeToken = async (type, token) => {
  const key = `${type}:${token}`;
  await redis.del(key);
};
