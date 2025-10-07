const mongoose = require("mongoose");

const CLobotAPIKayModel = new mongoose.Schema(
  {
    keyID: {
      type: String,
    },
    api_key: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("api_keys", CLobotAPIKayModel);
