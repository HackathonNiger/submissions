const router = require("express").Router();
const UserAuthController = require("../controller/user_auth_controller");

router.post("/register-user", UserAuthController.registerUser);
router.post("/user-login", UserAuthController.userLogin);
router.post("/send-forgot-password-otp", UserAuthController.forgotPassword);
router.put(
  "/reset-password-with-otp",
  UserAuthController.verifyResetPasswordOTPAndResetPassword
);

module.exports = router;
