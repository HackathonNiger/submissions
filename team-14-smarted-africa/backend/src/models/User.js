// @ts-nocheck
// backend/src/models/User.js

// ----------------------------
// Import Modules
// ----------------------------
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ----------------------------
// User Schema
// ----------------------------
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Password is optional at first; user sets it after email confirmation
    password: {
      type: String,
      required: false,
      select: false, // don't return password by default in queries
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExp: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ----------------------------
// Password Hash Middleware
// ----------------------------
// Runs automatically before `save()` if password was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ----------------------------
// Instance Methods
// ----------------------------

// Compare input password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // return false if password not set
  return bcrypt.compare(candidatePassword, this.password);
};

// ----------------------------
// Model
// ----------------------------
const User = mongoose.model("User", userSchema);

export default User;
