const bcrypt = require('bcrypt');
const knex = require('knex')(require('../knexfile'));
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const transporter=require('../transporter')


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







exports.forgotPassword = async (req, res) => {
  let cloudmailin_domain= process.env.CLOUDMAILIN_DOMAIN
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
    const resetTokenExpiration = Date.now() + 30 * 60 * 1000;
    await knex.transaction(async trx => {
      await trx.raw('UPDATE `user-profile` SET resetToken = ?, resetTokenExpiration = ? WHERE `username` = ?', [resetToken, resetTokenExpiration, username]);
    });
    // Get the email address of the user
    const userEmail = req.body.email.toString(); 
    // Create a transporter

    // Send a password reset email
    const resetLink = `https://www.hands-off.app/reset-password/${resetToken}`;
    let info =await transporter.sendMail({
      from: `noreply@${cloudmailin_domain}`,
      to: userEmail,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `Click the following link to reset your password: ${resetLink}`,
      headers: { 'x-cloudmta-class': 'standard' }
    })
    console.log("Message sent: %s", info.response);
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
      const userId = verifiedToken['id']
      const result=await knex.raw('UPDATE `user-profile` SET `#` = ? WHERE id = ?',[ hash, userId ]);
  
      res.status(200).send("password updated");
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

