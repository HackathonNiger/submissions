const router = require("express").Router();
const ConversationController = require("../controllers/conversation_controller");
const AccessTokenValidator = require("../../../../middlewares/access_token_validator");

router.post(
  "/new-conversation",
  AccessTokenValidator,
  ConversationController.createConversation
);

router.get(
  "/single-conversation/:conversationId",
  AccessTokenValidator,
  ConversationController.getConversationByID
);

router.get(
  "/all-conversations",
  AccessTokenValidator,
  ConversationController.getConversations
);

router.delete(
  "/delete-conversation",
  AccessTokenValidator,
  ConversationController.deleteConversation
);

module.exports = router;
