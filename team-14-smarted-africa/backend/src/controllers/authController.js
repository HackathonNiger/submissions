// @ts-nocheck
// backend/src/controllers/authController.js

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose"; 
import User from "../models/User.js";
import env from "../config/env.js";

// ----------------------------
// Email Transporter
// ----------------------------
const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465, 
  auth: { user: env.smtpUser, pass: env.smtpPass },
});

// ----------------------------
// Helper: Generate JWT Tokens
// ----------------------------
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    env.refreshSecret,
    { expiresIn: env.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

// ----------------------------
// Helper: Send Email
// ----------------------------
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"SmartEd Africa" <${env.emailFrom}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};

// ----------------------------
// Helper: Set Refresh Token Cookie
// ----------------------------
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ----------------------------
// Registration
// ----------------------------
export const register = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.confirmed)
        return res.status(400).json({ message: "Email already registered. Please login." });
      else {
        existingUser.emailToken = crypto.randomBytes(32).toString("hex");
        await existingUser.save();
        const confirmUrl = `${env.frontendUrl}/confirm/${existingUser.emailToken}`;
        await sendEmail({ to: normalizedEmail, subject: "Confirm your account", html: `<a href="${confirmUrl}">Confirm Email</a>` });
        return res.status(200).json({ message: "Confirmation email resent." });
      }
    }

    const emailToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({ name, email: normalizedEmail, emailToken, confirmed: false });
    const confirmUrl = `${env.frontendUrl}/confirm/${emailToken}`;
    await sendEmail({ to: normalizedEmail, subject: "Confirm your account", html: `<a href="${confirmUrl}">Confirm Email</a>` });

    return res.status(201).json({ message: "Registration successful. Please confirm your email." });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Confirm Email
// ----------------------------
export const confirmEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid or expired confirmation link" });

    user.confirmed = true;
    user.emailToken = null;
    await user.save();

    return res.json({ message: "Email verified. Please set your password.", redirectTo: `${env.frontendUrl}/set-password/${user._id}` });
  } catch (err) {
    console.error("Confirm email error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Set Password (after email verification)
// ----------------------------
export const setPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) return res.status(400).json({ message: "Password and confirmation are required" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({ message: "Password must include uppercase, lowercase, number, and special character" });

    const userId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(userId);
    if (!user || !user.confirmed) return res.status(400).json({ message: "Invalid user or email not confirmed" });

    user.password = password;
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.json({ message: "Password set successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
  } catch (err) {
    console.error("Set password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Login (with cookie)
// ----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.confirmed) return res.status(403).json({ message: "Please confirm your email first" });
    if (!user.password) return res.status(403).json({ message: "Password not set. Please set your password." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Forgot Password
// ----------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExp = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${env.frontendUrl}/reset-password/${resetToken}`;
    await sendEmail({ to: user.email, subject: "Password Reset", html: `<a href="${resetUrl}">Reset Password</a>` });

    return res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Reset Password
// ----------------------------
export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) return res.status(400).json({ message: "Password and confirmation are required" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({ resetToken: req.params.token, resetTokenExp: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset link" });

    user.password = password;
    user.resetToken = null;
    user.resetTokenExp = null;
    user.refreshToken = null; // revoke refresh token
    await user.save();

    await sendEmail({ to: user.email, subject: "Password Reset Successful", html: `<p>Your password has been reset successfully.</p>` });

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Resend Email Confirmation
// ----------------------------
export const resendConfirmation = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.confirmed) return res.status(400).json({ message: "Account already confirmed" });

    user.emailToken = crypto.randomBytes(32).toString("hex");
    await user.save();

    const confirmUrl = `${env.frontendUrl}/confirm/${user.emailToken}`;
    await sendEmail({ to: user.email, subject: "Resend: Confirm your account", html: `<a href="${confirmUrl}">Confirm Email</a>` });

    return res.json({ message: "Confirmation email resent successfully." });
  } catch (err) {
    console.error("Resend confirmation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Refresh Token (from cookie)
// ----------------------------
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    const payload = jwt.verify(token, env.refreshSecret);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: "Invalid refresh token" });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken);

    return res.json({ accessToken });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ----------------------------
// Logout (clears cookie)
// ----------------------------
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    const payload = jwt.verify(token, env.refreshSecret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
