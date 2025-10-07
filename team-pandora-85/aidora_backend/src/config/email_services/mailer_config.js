const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aidoraapps@gmail.com",
    pass: "nyql nmrh fhbh vvfn",
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "aidoraapps@gmail.com",
    to: to,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error occurred: " + error.message);
    }
    console.log("Email sent: " + info.response);
  });
};

module.exports = {
  sendEmail,
};
