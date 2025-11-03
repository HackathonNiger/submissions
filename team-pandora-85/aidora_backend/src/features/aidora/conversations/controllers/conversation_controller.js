const Conversation = require("../model/conversation_model");
const { v4 } = require("uuid");
const User = require("../../../user/profile/model/user_model");

const createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceding",
      });
    } else {
      let titleManager = title ? title : "New Consultation";
      const conversation = new Conversation({
        conversationID: v4(),
        title: titleManager,
        userID: user.userID,
        messages: [],
      });
      const saveConversation = await conversation.save();
      if (saveConversation) {
        res.status(201).json({
          title: "Success",
          message: "Conversation created successfully",
        });
      } else {
        res.status(400).json({
          title: "Failed",
          message: "Conversation creation failed",
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      message: "Error creating conversation",
      error: `Server Error: ${e}`,
    });
  }
};

const getConversationByID = async (req, res) => {
  try {
    const { conversationId } = req.params;
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
        res.status(200).json({
          title: "Found",
          data: conversation,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      message: "Error creating conversation",
      error: `Server Error: ${e}`,
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(404).json({
        title: "Login Required",
        message: "You have to login to proceed",
      });
    } else {
      const conversations = await Conversation.find({ userID: user.userID });
      res.status(200).json({
        title: "Success",
        data: conversations,
      });
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are to login before proceeding",
      });
    } else {
      const conversation = await Conversation.findOne({
        conversationID: conversationId,
        userID: user.userID,
      });
      if (!conversation) {
        res.status(404).json({
          title: "Not Found",
          message: "Conversation not found",
        });
      } else {
        const deleteData = await Conversation.findOneAndDelete({
          conversationID: conversation.conversationID,
        });
        if (!deleteData) {
          res.status(400).json({
            title: "Failed",
            message:
              "Sorry, but we are unable to delete this data at the moment, please try again later. Thank You",
          });
        } else {
          res.status(200).json({
            title: "Success",
            message: "Conversation Deleted successfully",
          });
        }
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

module.exports = {
  createConversation,
  getConversationByID,
  getConversations,
  deleteConversation,
};
