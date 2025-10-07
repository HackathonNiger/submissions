const router = require("express").Router();
const MessagesController = require("../controller/messages_controller");
const AccessTokenValidator = require("../../../../middlewares/access_token_validator");

router.post(
  "/add-message",
  AccessTokenValidator,
  MessagesController.addMessage
);

module.exports = router;
