// ----------------------------
// backend/src/utils/apiResponse.js
// Standard API Response Utility
// ----------------------------
// Helps keep consistent API response formats across controllers
// Usage: res.json(success(data, "message")) or res.status(400).json(error("message"))
// ----------------------------

// Success response
export const success = (data = {}, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

// Error response
export const error = (message = "Error", code = 400, details = null) => {
  return {
    success: false,
    message,
    code,
    details,
  };
};
