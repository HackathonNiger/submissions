const router = require("express").Router();
const UserSettingsController = require("../controller/user_settings_controller");
const AccessTokenValidator = require("../../../../middlewares/access_token_validator");

router.get(
  "/enable-or-disable-account-pin",
  AccessTokenValidator,
  UserSettingsController.enableOrDisableAccountPINLogin
);

router.get(
  "/enable-or-disable-biometrics",
  AccessTokenValidator,
  UserSettingsController.enableOrDisableBiometrics
);

router.get(
  "/enable-or-disable-always-login",
  AccessTokenValidator,
  UserSettingsController.enableOrDisableAlwaysLogin
);

router.put(
  "/update-password",
  AccessTokenValidator,
  UserSettingsController.updatePassword
);

router.post(
  "/verify-account-email-otp",
  AccessTokenValidator,
  UserSettingsController.verifyAccountEmail
);

router.put(
  "/verify-account-email-with-otp",
  AccessTokenValidator,
  UserSettingsController.verifyEmailAddressWithOTP
);

module.exports = router;
