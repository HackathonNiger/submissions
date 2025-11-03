const User = require("../../profile/model/user_model");
const EmailServices = require("../../../../config/email_services/utility/mail_sender");
const bcrypt = require("bcryptjs");

const verifyAccountEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const isRegisteredEmail = await User.findOne({ email: email });
    if (!isRegisteredEmail) {
      res.status(400).json({
        title: "Email Does Not Exist",
        message: "The email you provided does not exist",
      });
    } else {
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000
      ).toString();

      const verificationCodeExpires = Date.now() + 2 * 60 * 1000;
      isRegisteredEmail.otpCode = verificationCode;
      isRegisteredEmail.otpExpires = verificationCodeExpires;
      const buildData = await isRegisteredEmail.save();
      if (buildData) {
        EmailServices.sendVerifyAccountOTP(
          email,
          `${isRegisteredEmail.firstName.trim()} ${isRegisteredEmail.lastName.trim()} ${isRegisteredEmail.otherNames.trim()}`,
          `${verificationCode}`
        );
        res.status(200).json({
          title: "OTP Sent",
          message: "A 4 digit OTP code has been sent to your email",
        });
      } else {
        res.status(400).json({
          title: "Failed To Send OTP",
          message:
            "Sorry, but we are unable to send an OTP at the moment, please try again later. Thank You",
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const verifyEmailAddressWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });
    if (user.otpCode !== otp) {
      res.status(400).json({
        title: "Invalid OTP",
        message:
          "The OTP you provided is does not match the one we sent you, please check your email and try again",
      });
    } else {
      if (user.otpExpires < Date.now()) {
        res.status(400).json({
          title: "Expired OTP",
          message:
            "The OTP you provided us has expired, please request for another OTP",
        });
      } else {
        user.isEmailVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        const isSuccessful = await user.save();
        if (isSuccessful) {
          res.status(200).json({
            title: "Email Verified Successfully",
            message:
              "You have successfully verified your email address and also increased your account security",
          });
        } else {
          res.status(200).json({
            title: "Unable To Verify Your Email",
            message:
              "Sorry we are unable to verify your email at the moment, please try again later thank you.",
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

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Not Allowed",
        message:
          "This action is only allowed for logged in users, please login to complete this action",
      });
    } else {
      const isOldPassword = await bcrypt.compare(oldPassword, user.password);

      if (!isOldPassword) {
        res.status(400).json({
          title: "Incorrect Old Password",
          message:
            "The old password you provided is incorrect, you are required to provide your old password before you can change it to a new one",
        });
      } else {
        if (newPassword == "") {
          res.status(400).json({
            title: "Invalid Input",
            message: "You cannot leave it empty",
          });
        } else {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          const updatedPassword = await user.save();
          if (updatedPassword) {
            res.status(200).json({
              title: "Password Updated Successfully",
              message: "You have successfully updated your password",
            });
          } else {
            res.status(400).json({
              title: "Password Update Failed",
              message:
                "We are unable to update your password, please check the details and try again or contact our customer care to help get the issue resolved",
            });
          }
        }
      }
    }
  } catch (err) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${err}`,
    });
  }
};

const enableOrDisableBiometrics = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });

    if (!user) {
      res.status(400).json({
        title: "User Login Required",
        message: "You must log in before accessing this route.",
      });
    } else {
      user.settings.security.enableBiometrics =
        !user.settings.security.enableBiometrics;
      if (!user.settings.security.enableBiometrics) {
        user.settings.security.enableBiometrics = false;
      } else {
        await user.save();

        res.status(200).json({
          title: `Account Biometric Security ${
            user.extraSecurity ? "Enabled" : "Disabled"
          }`,
          message: `You have ${
            user.extraSecurity ? "enabled" : "disabled"
          } account biometrics security. You ${
            user.extraSecurity ? "can now" : "can no longer"
          } use your device biometrics to login.`,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `An unexpected error occurred: ${e}`,
    });
  }
};

const enableOrDisableAlwaysLogin = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });

    if (!user) {
      res.status(400).json({
        title: "User Login Required",
        message: "You must log in before accessing this route.",
      });
    } else {
      user.settings.security.alwaysLogin = !user.settings.security.alwaysLogin;
      if (!user.settings.security.alwaysLogin) {
        user.settings.security.enableBiometrics = false;
        user.settings.security.loginWithAccountPIN = false;
      } else {
        await user.save();
        res.status(200).json({
          title: `Account 24/7 Security ${
            user.extraSecurity ? "Enabled" : "Disabled"
          }`,
          message: `You have ${
            user.extraSecurity ? "enabled" : "disabled"
          } account 24/7 security. You ${
            user.extraSecurity ? "can now" : "can no longer"
          } use your device 24/7 to login.`,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `An unexpected error occurred: ${e}`,
    });
  }
};

const enableOrDisableAccountPINLogin = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "User Login Required",
        message: "You must log in before accessing this route.",
      });
    } else {
      user.settings.security.loginWithAccountPIN =
        !user.settings.security.loginWithAccountPIN;
      if (!user.settings.security.loginWithAccountPIN) {
        user.settings.security.loginWithAccountPIN = false;
      } else {
        await user.save();
        res.status(200).json({
          title: `Account PIN Security ${
            user.extraSecurity ? "Enabled" : "Disabled"
          }`,
          message: `You have ${
            user.extraSecurity ? "enabled" : "disabled"
          } account PIN security. You ${
            user.extraSecurity ? "can now" : "can no longer"
          } use your device PIN to login.`,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `An unexpected error occurred: ${e}`,
    });
  }
};

module.exports = {
  verifyAccountEmail,
  verifyEmailAddressWithOTP,
  updatePassword,
  enableOrDisableAlwaysLogin,
  enableOrDisableBiometrics,
  enableOrDisableAccountPINLogin,
};
