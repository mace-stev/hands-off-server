const bcrypt = require('bcrypt');
const knex = require('knex')(require('../knexfile'));
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(req.body.password, salt);

  try {
    await knex.transaction(async trx => {
      await trx.raw('INSERT INTO `user-profile` (id, username, `#`) VALUES (?, ?, ?)', [uuidv4(), req.body.username, hash]);
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