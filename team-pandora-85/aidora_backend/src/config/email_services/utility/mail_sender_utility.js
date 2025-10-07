const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aidoraapps@gmail.com",
    pass: "nyql nmrh fhbh vvfn",
  },
});
const sendEmail = async (to, subject, templateName, replacements) => {
  try {
    const templatePath = path.join(
      __dirname,
      `../template/${templateName}.html`
    );
    let template = fs.readFileSync(templatePath, "utf8");
    for (const [key, value] of Object.entries(replacements)) {
      template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: template,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
