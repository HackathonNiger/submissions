// backend/src/services/emailService.js

/**
 * Email service
 * - Dev default: nodemailer jsonTransport (prints emails to console)
 * - Prod path: use SendGrid (or SMTP) by setting SENDGRID_API_KEY and uncommenting the SendGrid transport
 *
 * Environment:
 * - SENDGRID_API_KEY (optional for real SendGrid)
 * - EMAIL_FROM        (from address)
 */

// ----------------------------
// Import Modules
// ----------------------------
import nodemailer from 'nodemailer';
import env from '../config/env.js';

// ----------------------------
// Configure transporter
// ----------------------------
// By default we use jsonTransport for development (logs emails to console)
const transporter = nodemailer.createTransport({ jsonTransport: true });

/* Example SendGrid transport (uncomment & npm i nodemailer-sendgrid-transport in production)
import sgTransport from 'nodemailer-sendgrid-transport';
const transporter = nodemailer.createTransport(sgTransport({
  auth: { api_key: env.sendgridApiKey }
}));
*/

// ----------------------------
// Send Email Function
// ----------------------------
export async function sendEmail({ to, subject, html, text }) {
  const msg = {
    from: env.emailFrom || 'no-reply@smarted.africa',
    to,
    subject,
    html,
    text
  };

  try {
    const info = await transporter.sendMail(msg);
    // jsonTransport prints the mail object; SendGrid returns response info
    console.log('[emailService] Sent:', info);
    return info;
  } catch (err) {
    console.error('[emailService] Error sending email', err);
    throw err;
  }
}
