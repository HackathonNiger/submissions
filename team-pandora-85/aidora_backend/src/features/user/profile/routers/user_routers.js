const UserController = require("../controller/user_controller");
const AccessTokenValidator = require("../../../../middlewares/access_token_validator");
const router = require("express").Router();

router.post("/check-email", UserController.checkIfEmailExists);
router.post("/check-phone", UserController.checkIfPhoneNumberExists);
router.put(
  "/update-profile",
  AccessTokenValidator,
  UserController.updateUserProfile
);
router.delete(
  "/delete-profile",
  AccessTokenValidator,
  UserController.deleteUserAccount
);

router.get("/user-profile", AccessTokenValidator, UserController.userProfile);

module.exports = router;
