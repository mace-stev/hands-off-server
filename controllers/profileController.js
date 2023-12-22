const bcrypt = require('bcrypt')
const knex = require('knex')(require('../knexfile'));
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken')
exports.signup = async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(req.body.password, salt);
  try {
    await knex.transaction(async trx => {
      const profile = {
        id: uuidv4(),
        username: req.body.username,
        '#': hash
      };
      await trx('user-profile').insert(profile);
    });
    res.status(200).send('successfully signed-up');
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
    if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
      const verifiedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY);
      const ableToChange = ['obsDomain', 'social-links'];
      const elementsChanged = [];
      let data = Object.keys(req.body);
      console.log(data);

      data.forEach(async(element) => {
        if (element.toString() === ableToChange[0] || element.toString() === ableToChange[1]) {
          await knex('user-profile')
            .update(element.toString(), req.body[element.toString()])
            .where('id', verifiedToken['id'][0]['id']);
          elementsChanged.push(element.toString());
        }
      });

      elementsChanged.forEach((element) => {
        res.status(200).send(`${element} updated`);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
