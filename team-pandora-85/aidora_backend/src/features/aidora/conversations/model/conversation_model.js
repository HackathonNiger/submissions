const mongoose = require("mongoose");
const messageSchema = require("../../messages/model/messages_model");

const conversationModel = new mongoose.Schema(
  {
    conversationID: {
      type: String,
    },
    title: {
      type: String,
    },
    userID: {
      type: String,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversations", conversationModel);
