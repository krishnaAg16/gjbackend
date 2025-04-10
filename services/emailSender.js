import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();
export async function sendConfirmationEmail({ email, name, id, events }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Fest Registration Confirmed!',
    html: `
      <h3>Hello ${name},</h3>
      <p>Your registration is confirmed. Here are your details:</p>
      <ul>
        <li><strong>ID:</strong> ${id}</li>
        <li><strong>Events:</strong> ${events}</li>
      </ul>
      <p>If you'd like to register for more events, click below:</p>
      <a href="https://yourfestsite.com/add-events?pid=${id}">Add More Events</a>
    `
  };

  await transporter.sendMail(mailOptions);
}
