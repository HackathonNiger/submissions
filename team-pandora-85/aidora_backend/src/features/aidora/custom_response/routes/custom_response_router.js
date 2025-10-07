const router = require("express").Router();
const CustomResponseController = require("../controller/custom_response_controller");
const AccessTokenValidator = require("../../../../middlewares/access_token_validator");

router.put(
  "/set-custom-response",
  AccessTokenValidator,
  CustomResponseController.setCustomResponse
);

router.put(
  "/update-custom-response",
  AccessTokenValidator,
  CustomResponseController.updateCustomResponse
);

router.put(
  "/clear-custom-response",
  AccessTokenValidator,
  CustomResponseController.clearCustomResponse
);

module.exports = router;
