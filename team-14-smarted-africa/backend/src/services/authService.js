// backend/src/services/authService.js

// ----------------------------
// Import Modules
// ----------------------------
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from './tokenService.js';
import { makeToken, saveToken, getUserIdForToken, revokeToken } from './authTokenService.js';
import env from '../config/env.js';

// ----------------------------
// Register User
// ----------------------------
export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  // Create user with confirmed=false by default
  const user = await User.create({ name, email, password, role, confirmed: false });

  // Create email confirmation token (expires in 24h)
  const token = makeToken(32);
  await saveToken('emailConfirm', token, user._id, 24 * 60 * 60);

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    confirmationToken: token
  };
};

// ----------------------------
// Login User
// ----------------------------
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +confirmed');
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  if (!user.confirmed) {
    const err = new Error('Email not confirmed');
    err.status = 403;
    throw err;
  }
  const valid = await user.comparePassword(password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  };
};

// ----------------------------
// Create Password Reset Token
// ----------------------------
export const createPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const token = makeToken(32);
  await saveToken('passwordReset', token, user._id, 60 * 60); // 1 hour

  return { userId: user._id, token };
};

// ----------------------------
// Reset Password
// ----------------------------
export const resetPassword = async (token, newPassword) => {
  const userId = await getUserIdForToken('passwordReset', token);
  if (!userId) {
    const err = new Error('Invalid or expired reset token');
    err.status = 400;
    throw err;
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  user.password = newPassword;
  await user.save();
  await revokeToken('passwordReset', token);
  return true;
};

// ----------------------------
// Confirm Email
// ----------------------------
export const confirmEmail = async (token) => {
  const userId = await getUserIdForToken('emailConfirm', token);
  if (!userId) {
    const err = new Error('Invalid or expired confirmation token');
    err.status = 400;
    throw err;
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  user.confirmed = true;
  await user.save();
  await revokeToken('emailConfirm', token);
  return true;
};

// ----------------------------
// Resend Confirmation Email Token
// ----------------------------
export const resendConfirmation = async (email) => {
  const user = await User.findOne({ email });
  if (!user || user.confirmed) return null;

  const token = makeToken(32);
  await saveToken('emailConfirm', token, user._id, 24 * 60 * 60);

  return { token, userId: user._id };
};
