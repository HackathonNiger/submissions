const mongoose = require("mongoose");

const taskContentModel = new mongoose.Schema(
  {
    contentID: {
      type: String,
      required: true,
      default: () => require("uuid").v4(),
    },
    content: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: function () {
        return this.isMedication;
      },
    },
    medicationName: {
      type: String,
      required: function () {
        return this.isMedication;
      },
    },
    isMedication: {
      type: Boolean,
      default: false,
    },
    administrationRoute: {
      type: String,
      enum: ["oral", "injection", "topical", "inhalation", "other"],
      required: function () {
        return this.isMedication;
      },
    },
  },
  { timestamps: true }
);

const taskModel = new mongoose.Schema(
  {
    taskID: {
      type: String,
      required: true,
      default: () => require("uuid").v4(),
    },
    userID: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    content: {
      type: [taskContentModel],
      required: true,
    },
    dueTime: {
      type: Date,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    recurrenceEndDate: {
      type: Date,
      required: function () {
        return this.isRecurring;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tasks", taskModel);
