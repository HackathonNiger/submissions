// backend/src/middleware/roleMiddleware.js

// ----------------------------
// Role-Based Authorization Middleware
// ----------------------------
// Usage: authorize('admin', 'instructor')
// Allows access only if user's role is in allowedRoles
export const authorize = (...allowedRoles) => (req, res, next) => {
  try {
    const user = req.user; // user is attached by protect middleware

    // Check if user is authenticated
    if (!user) {
      return next(Object.assign(new Error('Not authenticated'), { status: 401 }));
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role)) {
      return next(Object.assign(new Error('Forbidden'), { status: 403 }));
    }

    // User is authorized, proceed
    next();
  } catch (err) {
    next(err); // Pass errors to global error handler
  }
};
