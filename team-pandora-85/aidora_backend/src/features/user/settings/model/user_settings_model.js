const mongoose = require("mongoose");
const customResponseModel = require("../../../aidora/custom_response/model/custom_response_model");

const userSettings = new mongoose.Schema(
  {
    //seurity settings
    security: {
      password: {
        type: String,
      },
      pin: {
        type: String,
      },
      enableBiometrics: {
        type: Boolean,
        default: false,
      },
      alwaysLogin: {
        type: Boolean,
        default: false,
      },
      loginWithAccountPIN: {
        type: Boolean,
        default: false,
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
    },

    //custom aidora response
    customResponse: {
      type: customResponseModel,
      default: () => ({}),
    },

    //account personalization
    personalization: {
      theme: {
        type: String,
        enum: ["Dark", "Light", "System"],
        default: "Light",
      },
    },
  },
  { timestamps: false, _id: false }
);

module.exports = userSettings;
