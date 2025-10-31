// backend/src/utils/response.js

/**
 * Standardized API response helpers
 * - success: general 200 OK responses
 * - created: 201 Created responses
 * - fail: generic client error
 * - unauthorized: 401
 * - forbidden: 403
 * - notFound: 404
 * - serverError: 500
 */

export const success = (res, data = null, message = 'OK', status = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(status).json(payload);
};

export const created = (res, data = null, message = 'Created') => success(res, data, message, 201);

export const fail = (res, message = 'Bad Request', errors = null, status = 400) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(status).json(payload);
};

export const unauthorized = (res, message = 'Unauthorized') => fail(res, message, null, 401);

export const forbidden = (res, message = 'Forbidden') => fail(res, message, null, 403);

export const notFound = (res, message = 'Not Found') => fail(res, message, null, 404);

export const serverError = (res, message = 'Internal Server Error') => fail(res, message, null, 500);
