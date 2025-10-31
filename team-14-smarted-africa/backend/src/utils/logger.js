// backend/src/utils/logger.js

/**
 * Simple logger utility
 * - info: general logs
 * - warn: warnings
 * - error: errors
 * Prefixes each log for clarity
 */

export const info = (...args) => console.log('[INFO]', ...args);
export const warn = (...args) => console.warn('[WARN]', ...args);
export const error = (...args) => console.error('[ERROR]', ...args);
