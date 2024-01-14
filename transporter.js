const nodemailer = require('nodemailer');
require('dotenv').config();

let mailertogo_host = process.env.MAILERTOGO_SMTP_HOST;
let mailertogo_port = process.env.MAILERTOGO_SMTP_PORT || 587;
let mailertogo_user = process.env.MAILERTOGO_SMTP_USER;
let mailertogo_password = process.env.MAILERTOGO_SMTP_PASSWORD;
let mailertogo_domain= process.env.MAILERTOGO_DOMAIN
const transporter = nodemailer.createTransport({
  name: mailertogo_domain,
  host: mailertogo_host,
  port: 587,
  requireTLS: true, // Must use STARTTLS
  auth: {
    user: mailertogo_user,
    pass: mailertogo_password,
  },
});
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

module.exports = transporter;