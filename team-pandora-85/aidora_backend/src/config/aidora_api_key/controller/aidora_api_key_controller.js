const APIKEYModel = require("../model/aidora_api_key_model");
const { v4 } = require("uuid");

const getAPIKeys = async (req, res) => {
  try {
    const key = await APIKEYModel.find();
    res.status(200).json({
      title: "Success",
      data: key,
    });
  } catch {
    res.status(500).json({
      text: "Server Error",
      message: `Server ${e}`,
    });
  }
};

const postAPIKeys = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      res.status(400).json({
        title: "Required",
        message: "Api key required",
      });
    } else {
      const newKey = new APIKEYModel({
        keyID: v4(),
        api_key: key,
      });
      const saveKey = await newKey.save();
      if (saveKey) {
        res.status(200).json({
          text: "Sucess",
          message: "Key saved",
        });
      } else {
        res.status(400).json({
          text: "Failed",
          message: "Unable to save key",
        });
      }
    }
  } catch {
    res.status(500).json({
      text: "Server Error",
      message: `Server ${e}`,
    });
  }
};

module.exports = {
  getAPIKeys,
  postAPIKeys,
};
