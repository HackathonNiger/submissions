const mongoose = require("mongoose");

const customResponseModel = new mongoose.Schema(
  {
    customName: {
      type: String,
    },
    instructions: {
      type: String,
    },
    occupation: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: false, _id: false }
);

module.exports = customResponseModel;
