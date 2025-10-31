import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { sendOTPEmail } from "../utils/email.js";

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// === Sign Up ===
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "name, email and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("signUp error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// === Login ===
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches)
      return res.status(401).json({ error: "Invalid email or password" });

    const accessToken = generateToken({ userId: user._id });
    res.cookie("token", accessToken, COOKIE_OPTIONS);

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: accessToken,
    });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// === Request Password Reset (Send OTP) ===
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

    user.resetOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: "OTP sent to email", success: true });
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// === Verify OTP and Reset Password ===
export const verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.resetOTP !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful", success: true });
  } catch (err) {
    console.error("verifyOTPAndResetPassword error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// === Logout ===
export const logoutUser = async (_req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
