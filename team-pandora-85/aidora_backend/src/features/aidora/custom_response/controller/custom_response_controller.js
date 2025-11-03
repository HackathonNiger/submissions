const User = require("../../../user/profile/model/user_model");

const setCustomResponse = async (req, res) => {
  try {
    const { customName, instructions, occupation, bio } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before accessing this action",
      });
    } else {
      user.settings.customResponse = {
        customName: customName,
        instructions: instructions,
        occupation: occupation,
        bio: bio,
      };
      const saveData = await user.save();
      if (!saveData) {
        res.status(400).json({
          title: "Failed",
          message:
            "Unable to set custom settings at the moment, please try again later. Thank You",
        });
      } else {
        res.status(200).json({
          title: "Success",
          message: "Custom response have been successfully set",
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

const updateCustomResponse = async (req, res) => {
  try {
    const { customName, instructions, occupation, bio } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      user.settings.customResponse = {
        customName:
          customName != null
            ? customName
            : user.settings.customResponse.customName,
        instructions:
          instructions != null
            ? instructions
            : user.settings.customResponse.instructions,
        occupation:
          occupation != null
            ? occupation
            : user.settings.customResponse.occupation,
        bio: bio != null ? bio : user.settings.customResponse.bio,
      };

      const updateResponse = await user.save();
      if (!updateResponse) {
        res.status(400).json({
          title: "Failed",
          message:
            "Sorry, but we could not update your data at the moment, please try again later. Thank You",
        });
      } else {
        res.status(200).json({
          title: "Success",
          message: "Custom response successfully updated",
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

const clearCustomResponse = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      user.settings.customResponse = {
        customName: "",
        instructions: "",
        occupation: "",
        bio: "",
      };
      const saveData = await user.save();
      if (!saveData) {
        res.status(400).json({
          title: "Failed",
          message:
            "Sorry, but we could not clear your data at the moment, please try again later. Thank You",
        });
      } else {
        res.status(200).json({
          title: "Success",
          message: "Custom response successfully cleared",
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

module.exports = {
  clearCustomResponse,
  setCustomResponse,
  updateCustomResponse,
};
