import nodemailer from "nodemailer";
const Email = process.env.EMAIL;
const password = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net", // Corrected to remove `http://`
  secure: true, // Secure connection (SSL/TLS)
  port: 465, // Standard port for secure SMTP
  auth: {
    user: Email, // Replace with your email
    pass: password, // Replace with your password
  },
});




export const mailOptions = {
  from: Email,
  to: Email,
};
