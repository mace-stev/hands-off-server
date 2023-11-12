const bcrypt = require('bcrypt')
const knex = require('knex')(require('../knexfile'));
const { v4: uuidv4 } = require("uuid");

exports.signup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(req.body.password, salt);

    const profile = {
      id: uuidv4(),
      username: req.body.username,
      '#': hash
    };

    await knex('user-profile').insert(profile);
    
    res.status(200).send('successfully signed-up');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}


exports.editProfile = async (req, res) => {
  const ableToChange = ['obsPort', 'obsUrl', 'social-links']
  const elementsChanged=[]
  let data = Object.keys(req.body)

  data.forEach((element) => {
    if (element.toString() === ableToChange[0] || element.toString() === ableToChange[1] || element.toString() === ableToChange[2]) {
      knex("user-profile").update(element.toString(), req.body[element.toString()])
      elementsChanged.push(element.toString())
    }

  })
  elementsChanged.forEach((element)=>{
    res.status(200).send(`${element} updated`)
  })
}
