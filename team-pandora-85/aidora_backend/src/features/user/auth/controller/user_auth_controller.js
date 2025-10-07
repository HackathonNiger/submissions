const { v4 } = require("uuid");
const User = require("../../profile/model/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EmailServices = require("../../../../config/email_services/utility/mail_sender");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, otherNames, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        title: "Missing Required Fieled",
        message: "Please make sure you provide all required fields",
      });
    } else {
      const isEmailExisting = await User.findOne({ email: email });
      if (isEmailExisting) {
        res.status(400).json({
          title: "Email Already Exists",
          message: "Sorry, but the email you provided already exists",
        });
      } else {
        const encodePassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          userID: v4(),
          firstName: firstName,
          lastName: lastName,
          otherNames: otherNames,
          email: email,
          settings: {
            security: {
              password: encodePassword,
            },
          },
        });
        const saveUser = await newUser.save();
        if (!saveUser) {
          res.status(400).json({
            title: "Registeration Failed",
            message:
              "Sorry, but we are unable to register you at the moment, please try again later",
          });
        } else {
          EmailServices.sendSuccessfulRegistrationEmail(email, "", "");
          res.status(201).json({
            title: "Registeration Successful",
            message: "You have successfully registered with us",
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

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        title: "Missing Required Fieled",
        message: "Please make sure you provide all required fields",
      });
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          title: "Email Not Found",
          message: "The email you provided is not registered with us",
        });
      } else {
        const isPassword = await bcrypt.compare(
          password,
          user.settings.security.password
        );
        if (!isPassword) {
          res.status(400).json({
            title: "Wrong Password",
            message: "The password you provided us is incorrect",
          });
        } else {
          const token = jwt.sign(
            {
              user: {
                userID: user.userID,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              },
            },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: "31d" }
          );
          const loginTime = new Date().toLocaleString();
          EmailServices.accountLoginEmail(
            email,
            `${user.firstName} ${user.lastName}${
              user.otherNames ? ` ${user.otherNames}` : ""
            }`,
            loginTime
          );
          res.status(200).json({
            title: "Login Successfully",
            user: { token, ...user._doc },
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isRegisteredEmail = await User.findOne({ email: email });
    if (!isRegisteredEmail) {
      res.status(400).json({
        title: "Email Does Not Exist",
        message: "The email you provided does not exist",
      });
    } else {
      const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
      const resetExpires = Date.now() + 2 * 60 * 1000;
      isRegisteredEmail.otpCode = resetCode;
      isRegisteredEmail.otpExpires = resetExpires;
      const setOTPData = await isRegisteredEmail.save();

      if (!setOTPData) {
        res.status(400).json({
          title: "Something Went Wrong",
          message:
            "Sorry, but we could not send an OTP at the moment, please try again later. Thank You",
        });
      } else {
        EmailServices.sendForgotPasswordOTP(email, "", `${resetCode}`);
        res.status(200).json({
          title: "OTP Sent",
          message: "A 6 digit OTP code has been sent to your email",
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
const verifyResetPasswordOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
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
        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(newPassword, salt);
        user.settings.security.password = encryptPassword;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        const updatePassword = await user.save();
        if (updatePassword) {
          res.status(200).json({
            title: "Password Chaneged Successfully",
            message:
              "You have successfully changed your password, you can now go and login",
          });
        } else {
          res.status(200).json({
            title: "Unable To Change Password",
            message:
              "Sorry we are unable to change your password at the moment, please try again later thank you.",
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
  registerUser,
  userLogin,
  forgotPassword,
  verifyResetPasswordOTPAndResetPassword,
};
