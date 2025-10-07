const mongoose = require("mongoose");
const userSettings = require("../../settings/model/user_settings_model");

const userModel = new mongoose.Schema(
  {
    userID: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    otherNames: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    dob: {
      type: String,
    },
    settings: {
      type: userSettings,
      default: () => ({}),
    },
    otpCode: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userModel);
