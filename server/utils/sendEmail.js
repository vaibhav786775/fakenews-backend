const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.error("Email transporter verify failed:", err);
    throw new Error("Email transporter not ready: " + err.message);
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    return info;
  } catch (err) {
    console.error("sendMail error:", err);
    throw err;
  }
};

module.exports = sendEmail;
