import nodemailer from "nodemailer";
const Email = process.env.EMAIL;
const password = process.env.EMAIL_PASS;

// export const transporter = nodemailer.createTransport({
//   host: "smtpout.secureserver.net", 
//   secure: true, 
//   port: 465, 
//   auth: {
//     user: Email, 
//     pass: password, 
//   },
// });


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: Email,
    pass: password,
  },
});


export const mailOptions = {
  from: Email,
  to: Email,
};
