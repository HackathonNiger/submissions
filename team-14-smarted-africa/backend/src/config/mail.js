// @ts-nocheck
// backend/src/config/mail.js

import nodemailer from "nodemailer";
import env from "./env.js";

// Create a reusable transporter object with proper defaults
export const transporter = nodemailer.createTransport({
  host: env.smtpHost,                     // e.g. smtp.gmail.com or smtp.ethereal.email
  port: Number(env.smtpPort) || 587,      // fallback to 587 if not set
  secure: false, //Number(env.smtpPort) === 465,   // true if using SSL, false otherwise
  auth: {
    user: env.smtpUser,                   // full email address
    pass: env.smtpPass,                   // app password or real SMTP password
  },
  tls: {
    rejectUnauthorized: false,            // helps avoid self-signed cert issues
  },
  connectionTimeout: 10000,               // 10 seconds timeout
});

// Verify SMTP connection on server start
(async () => {
  try {
    await transporter.verify();
    console.log("SMTP server is ready to send emails");
  } catch (err) {
    console.error("SMTP connection error:", err.message);
  }
})();
