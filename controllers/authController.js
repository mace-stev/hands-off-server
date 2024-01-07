const jwt = require('jsonwebtoken')
const knex=require('knex')(require('../knexfile'));
const bcrypt = require('bcrypt')
const axios = require('axios')
exports.categories = (req, res) => {

 const result={}
  if(jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)) {
    const categories = [];
    const verifiedToken=jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)
      result['id']=verifiedToken['id'][0]['id']
      result['obsPort/Domain']=verifiedToken['obsPort/Domain'][0]['obsPort/Domain']
     
      
    axios.get(`https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=US&key=${process.env.API_KEY}`)
    .then((response) => {
      response.data.items.forEach((element) => {
        if (element.snippet.assignable === true) {
          categories.push({
            value: element.id,
            label: element.snippet.title
          })
        }
      })
      result['categories']=categories
      res.status(201).send(result)

    }).catch((err) => {
      console.log(err + " error getting youtube vid categories")
    })
  }




}
exports.verify = async (req, res) => {
  const [id]= await knex.raw('SELECT id FROM `user-profile` WHERE username = ?', req.body.username)
  const [domain]= await knex.raw('SELECT `obsPort/Domain` FROM `user-profile` WHERE username = ?', req.body.username )
 
 
  function generateJWTToken(userId, domain) {
    const token = jwt.sign({ id: userId,
    "obsPort/Domain": domain}, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    return token;
  }
  try {
    const [data] = await knex.raw('SELECT `#` FROM `user-profile` WHERE username = ?', req.body.username )
    const isPasswordMatch = await bcrypt.compare(req.body.password, data[0]['#']);
    const hash = await bcrypt.hash(req.body.stateToHash.toString(), 16)

    if (isPasswordMatch) {
      res.setHeader('Authorization', `Bearer ${generateJWTToken(id, domain)}`);
      res.status(200).send(hash);
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};