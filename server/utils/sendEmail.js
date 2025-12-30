const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: "no-reply@fakenewsapp.com",
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
