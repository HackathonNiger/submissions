// @ts-nocheck

// backend/src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";

/**
 * Middleware: Protect routes (requires valid JWT access token)
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret);

    // Attach user to request (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next(); // proceed to next middleware/controller
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

/**
 * Middleware: Restrict access to specific roles
 * @param  {...string} roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: insufficient rights" });
    }
    next();
  };
};
