const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    messageID: {
      type: String,
    },
    sender: {
      type: String,
      enum: ["user", "aidora"],
      default: "user",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = messageSchema;
