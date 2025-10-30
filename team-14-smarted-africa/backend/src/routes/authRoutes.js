// backend/src/routes/authRoutes.js

// ----------------------------
// Import Modules
// ----------------------------
import { Router } from "express";
import {
  register,
  confirmEmail,
  login,
  refreshToken,
  logout,
  resendConfirmation,
  forgotPassword,
  resetPassword,
  setPassword, // <-- new controller for modern workflow
} from "../controllers/authController.js";

// ----------------------------
// Initialize Router
// ----------------------------
const router = Router();

// ----------------------------
// User Registration & Email Confirmation
// ----------------------------

// Register a new user
// POST /api/v1/auth/register
router.post("/register", register);

// Confirm user's email using token
// GET /api/v1/auth/confirm/:token
router.get("/confirm/:token", confirmEmail);

// Resend confirmation email
// POST /api/v1/auth/resend-confirmation
router.post("/resend-confirmation", resendConfirmation);

// ----------------------------
// User Authentication
// ----------------------------

// Login user and return access & refresh tokens
// POST /api/v1/auth/login
router.post("/login", login);

// Refresh access token using refresh token
// POST /api/v1/auth/refresh
router.post("/refresh", refreshToken);

// Logout user (invalidate refresh token)
// POST /api/v1/auth/logout
router.post("/logout", logout);

// ----------------------------
// Password Management
// ----------------------------

// Send password reset email
// POST /api/v1/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// Reset password using token from email
// POST /api/v1/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword);

// ----------------------------
// Modern Set Password (after email verification)
// ----------------------------
// POST /api/v1/auth/set-password/:token
router.post("/set-password/:id", setPassword);

// ----------------------------
// Export Router
// ----------------------------
export default router;
