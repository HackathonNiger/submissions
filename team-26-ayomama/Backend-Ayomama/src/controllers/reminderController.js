import Visit from "../models/Visit.js";
import { sendSMS } from "../services/smsService.js";

export const runReminders = async (req, res) => {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

  try {
    const reminders = await Visit.find({
      reminderDateTime: { $gte: oneMinuteAgo, $lte: now },
      sent: false
    }).populate("userId", "phoneNumber");

    for (let r of reminders) {
      await sendSMS(r.userId.phoneNumber, `Reminder: You have an appointment at ${r.hospitalName} with ${r.doctorName}`);
      r.sent = true;
      await r.save();
    }

    res.json({ message: "Reminders executed successfully", count: reminders.length });
  } catch (err) {
    console.error("Manual reminder error:", err.message);
    res.status(500).json({ error: "Failed to run reminders" });
  }
};


