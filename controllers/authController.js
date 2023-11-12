const fileupload = require("express-fileupload");
const jwt=require('jsonwebtoken')
const knex = require('knex')(require('../knexfile'));
const bcrypt = require('bcrypt')
exports.params=(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/post')

    res.send(process.env.PARAMS);
}
exports.verify = async (req, res) => {
  const id= await knex('user-profile').select('id').where('username', req.body.username)
  function generateJWTToken(userId) {
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    return token;
  }
    try {
      const [data] = await knex('user-profile').select('#').where('username', req.body.username);
      const isPasswordMatch = await bcrypt.compare(req.body.password, data['#']);
  
      if (isPasswordMatch) {
        res.setHeader('Authorization', `Bearer ${generateJWTToken(id)}`);
        res.status(200).send("Successfully signed-in");
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  };