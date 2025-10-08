import cron from "node-cron";
import Visit from "../models/Visit.js";
import { sendSMS } from "../services/smsService.js";

// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("Running reminder job...");

  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

  try {
    // Find visits scheduled within the last 1 min window
    const reminders = await Visit.find({
      reminderDateTime: { $gte: oneMinuteAgo, $lte: now },
      sent: false,
    }).populate("userId", "phoneNumber");

    for (let r of reminders) {
      try {
        await sendSMS(
          r.userId.phoneNumber,
          `Reminder: You have an appointment at ${r.hospitalName} with ${r.doctorName}`
        );
        r.sent = true;
        await r.save();
        console.log(`Reminder sent to ${r.userId.phoneNumber}`);
      } catch (err) {
        console.error("Failed to send reminder:", err.message);
      }
    }
  } catch (err) {
    console.error("Reminder job error:", err.message);
  }
});
