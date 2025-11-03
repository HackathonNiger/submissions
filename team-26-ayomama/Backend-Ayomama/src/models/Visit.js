import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
    },
    reminderDateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: false,
    },
    notes: {
      type: String,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Visit", visitSchema);
