const sgMail = require("@sendgrid/mail");

// Validate environment variables
if (!process.env.SENDGRID_API_KEY) {
  console.error("Error: SENDGRID_API_KEY is not set in environment variables");
}
if (!process.env.SENDGRID_SENDER_EMAIL) {
  console.error("Error: SENDGRID_SENDER_EMAIL is not set in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    if (!to || !subject || !text) {
      throw new Error("Missing required parameters: to, subject, and text are required");
    }

    const msg = {
      to,
      from: process.env.SENDGRID_SENDER_EMAIL, // verified sender
      subject,
      text,
    };

    const result = await sgMail.send(msg);
    console.log("Email sent successfully to:", to);
    return result;
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Full error details:", error);
    throw error; // Re-throw so calling code can handle it
  }
};

module.exports = sendEmail;
