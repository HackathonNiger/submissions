const Conversation = require("../../conversations/model/conversation_model");
const User = require("../../../user/profile/model/user_model");
const { v4 } = require("uuid");

const addMessage = async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      const conversation = await Conversation.findOne({
        conversationID: conversationId,
      });
      if (!conversation) {
        res.status(404).json({
          title: "Not Found",
          message: "Conversation not found",
        });
      } else {
        const messageData = {
          messageID: v4(),
          sender: sender,
          content: content,
        };
        conversation.messages.push(messageData);
        const saveMessage = await conversation.save();
        if (!saveMessage) {
          res.status(400).json({
            title: "Failed",
            message: "Unable to add message",
          });
        } else {
          res.status(200).json({
            title: "Success",
            message: "Message added successfully",
          });
        }
      }
    }
  } catch (e) {
    res.status(500).json({
      message: "Error creating conversation",
      error: `Server Error: ${e}`,
    });
  }
};

module.exports = {
  addMessage,
};
