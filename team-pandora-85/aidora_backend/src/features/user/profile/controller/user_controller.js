const User = require("../model/user_model");

const checkIfEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        title: "Missing Field",
        message: "Please make sure you provide the email you are searching for",
      });
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          title: "Email Not Found",
          message: "The email you've provided does not exist with us",
        });
      } else {
        res.status(200).json({
          title: "Email Found",
          message: "The email you've provided is registered with us",
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

const checkIfPhoneNumberExists = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      res.status(400).json({
        title: "Missing Field",
        message:
          "Please make sure you provide the phone number you are looking for",
      });
    } else {
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        res.status(404).json({
          title: "Phone Number Not Found",
          message: "The phone number you've provided is not registered with us",
        });
      } else {
        res.status(200).json({
          title: "Phone Number Found",
          message: "The phone number you've provided is registered with us",
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

const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, otherNames, phoneNumber, image, gender, dob } =
      req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login befor accessing this action",
      });
    } else {
      const reqUpdateData = {
        firstName: firstName != null ? firstName : user.firstName,
        lastName: lastName != null ? lastName : user.lastName,
        otherNames: otherNames != null ? otherNames : user.otherNames,
        phoneNumber: otherNames != null ? phoneNumber : user.phoneNumber,
        image: image != null ? image : user.image,
        gender: gender != null ? gender : user.gender,
        dob: dob != null ? dob : user.dob,
      };
      const updateUserData = await User.findOneAndUpdate(
        { userID: user.userID },
        reqUpdateData
      );
      if (!updateUserData) {
        res.status(400).json({
          title: "Profile Update Failed",
          message:
            "Sorry, but we are unable to update your profile at this time, please try again later. Thank You",
        });
      } else {
        res.status(200).json({
          title: "Profile Updated Successfully",
          message: "You have successfully updated your profile",
          data: updateUserData,
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

const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login befor accessing this action",
      });
    } else {
      const deleteData = await User.findOneAndDelete({ userID: user.userID });
      if (!deleteData) {
        res.status(400).json({
          title: "Failed",
          message:
            "Sorry, but we are unable to complete this action at moment, please try again later. Thank You",
        });
      } else {
        res.status(200).json({
          title: "Success",
          message: "User profile have been successfully delete",
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

const userProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      res.status(200).json({
        title: "Success",
        data: user,
      });
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

module.exports = {
  checkIfEmailExists,
  checkIfPhoneNumberExists,
  updateUserProfile,
  deleteUserAccount,
  userProfile,
};
