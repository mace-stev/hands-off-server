 const nodemailer = require('nodemailer');
require('dotenv').config();

let cloudmailin_host = process.env.CLOUDMAILIN_SMTP_HOST;
let cloudmailin_port = process.env.CLOUDMAILIN_SMTP_PORT || 587;
let cloudmailin_user = process.env.CLOUDMAILIN_SMTP_USER;
let cloudmailin_password = process.env.CLOUDMAILIN_SMTP_PASSWORD;
let cloudmailin_domain= process.env.CLOUDMAILIN_DOMAIN
const transporter = nodemailer.createTransport({
    host: cloudmailin_host,
    port: cloudmailin_port,
    secure: false,
    requireTLS: true,
    auth: {
      user: cloudmailin_user,
      pass: cloudmailin_password,
    },
    logger: true
  });

module.exports = transporter;