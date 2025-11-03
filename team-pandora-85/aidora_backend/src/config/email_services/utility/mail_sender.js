const sendEmail = require("./mail_sender_utility");

const sendForgotPasswordOTP = async (email, name, otp) => {
  await sendEmail(email, "Password Reset OTP", "forgot_password_mail", {
    name,
    otp,
  });
};

const sendVerifyAccountOTP = async (email, name, otp) => {
  await sendEmail(email, "Verify Your Account", "verify_email_mail", {
    name,
    otp,
  });
};

const sendSuccessfulRegistrationEmail = async (email, name) => {
  await sendEmail(
    email,
    "Registration Successful",
    "registration_successful_mail",
    {
      name,
    }
  );
};

const accountLoginEmail = async (email, name, loginTime) => {
  await sendEmail(email, "Account Login", "login_notification_mail", {
    name,
    loginTime,
  });
};

const sendTaskReminderEmail = async (email, name, task) => {
  await sendEmail(email, "Task Reminder", "task_reminder_email", {
    userName: name,
    taskTitle: task.title,
    dueTime: task.dueTime,
    isRecurring: task.isRecurring,
    recurrenceEndDate: task.recurrenceEndDate,
    content: task.content,
    appLink: "https://aidora.app/tasks", // Replace with actual app link
  });
};
module.exports = {
  sendForgotPasswordOTP,
  sendSuccessfulRegistrationEmail,
  sendVerifyAccountOTP,
  accountLoginEmail,
  sendTaskReminderEmail,
};
