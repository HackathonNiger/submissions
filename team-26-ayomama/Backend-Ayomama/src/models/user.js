import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    lastPeriodDate: {
      type: Date,
      default: null,
    },

    address: {
      type: String,
      default: "",
    },

    preferredLanguages: {
      type: String,
      enum: ["en", "yo", "ig", "ha"],
      default: "en",
    },

    contact: {
      type: String,
      default: "",
    },

    emergencyContact: [
      {
        name: {
          type: String,
          default: "",
        },

        phone: {
          type: String,
          default: "",
        },

        email: {
          type: String,
          default: "",
        },

        relationship: {
          type: String,
          default: "",
        },
      },
    ],

    // OTP fields
    resetOTP: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
