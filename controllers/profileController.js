const bcrypt = require('bcrypt');
const knex = require('knex')(require('../knexfile'));
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto')

exports.signup = async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(req.body.password, salt);

  try {
    await knex.transaction(async trx => {
      await trx.raw('INSERT INTO `user-profile` (id, username, `#`, email) VALUES (?, ?, ?, ?)', [uuidv4(), req.body.username, hash, req.body.email]);
    });
    res.status(200).send('Successfully signed up');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).send('Username already taken');
    } else {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
};

exports.editProfile = async (req, res) => {
  try {
    const verifiedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
    const userId = verifiedToken['id'][0]['id'];
    const ableToChange = [`obsPort/Domain`, `social-links`];
    const elementsChanged = [];

    const data = Object.keys(req.body);

    for (const element of data) {
      if (ableToChange.includes(element)) {
        await knex.raw('UPDATE `user-profile` SET ?? = ? WHERE id = ?', [element, req.body[element], userId]);
        elementsChanged.push(element);
      }
    }

    res.status(200).send(`Updated elements: ${elementsChanged.join(', ')}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};





function createTransporter() {
  // Get Mailer To Go SMTP connection details
  let mailertogo_host = process.env.MAILERTOGO_SMTP_HOST;
  let mailertogo_port = process.env.MAILERTOGO_SMTP_PORT || 587;
  let mailertogo_user = process.env.MAILERTOGO_SMTP_USER;
  let mailertogo_password = process.env.MAILERTOGO_SMTP_PASSWORD;
  let mailertogo_domain   = process.env.MAILERTOGO_DOMAIN || "mydomain.com";


  // create reusable transporter object using the default SMTP transport
  return nodemailer.createTransport({
    host: mailertogo_host,
    port: mailertogo_port,
    requireTLS: true, // Must use STARTTLS
    auth: {
      user: mailertogo_user,
      pass: mailertogo_password,
    },
  });
}

exports.forgotPassword = async (req, res) => {
  let mailertogo_domain   = process.env.MAILERTOGO_DOMAIN || "mydomain.com";
  try {
    const user = await knex.raw('SELECT `username` from `user-profile` WHERE `email`= ?', [req.body.email]);
    if (!user || !user.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Continue with the password reset process...
    console.log(user)
    // Generate a unique token
    const username = user[0][0].username;
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 60 * 30 * 1000
    await knex.transaction(async trx => {
      await trx.raw('UPDATE `user-profile` SET resetToken = ?, resetTokenExpiration = ? WHERE `username` = ?', [resetToken, resetTokenExpiration, username]);
    });
    // Get the email address of the user
    const userEmail = req.body.email.toString(); // Adjust this based on your actual data structure
    console.log(userEmail)
    // Create a transporter
    const transporter = createTransporter();

    // Send a password reset email
    const resetLink = `https://www.hands-off.app/reset-password/${resetToken}`;
    let info =await transporter.sendMail({
      from: `noreply@${mailertogo_domain}`,
      to: userEmail,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `Click the following link to reset your password: ${resetLink}`
    });
    console.log("Message sent: %s", info.messageId);
    res.json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

exports.resetPassword = async (req, res) => {
  if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
    try {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(req.body.password, salt);
      const verifiedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
      const userId = verifiedToken['id'][0]['id'];
      await knex.raw('UPDATE `user-profile` SET `#` = ? WHERE id = ?', [hash, userId]);
      res.status(200).send("password updated");
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

