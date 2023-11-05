const bcrypt = require('bcrypt')
const knex = require('knex')(require('../knexfile'));
exports.signup = (req, res) => {
  console.log(req.body)
  function signUp(callback) {
    bcrypt.genSalt(12, function (err, salt) {
      if (err)
        return callback(err);

      bcrypt.hash(req.body.password, salt, function (err, hash) {
        return callback(err, hash);
      });
    });
    signUp(function (err, hash) {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
      }
      const profile = {
        username: req.body.username,
        '#': hash
      }
      // Store the hashed password in the database
      knex('user-profile').insert(profile)
        .returning('id')
        .then((response) => {
          console.log('success')
          console.log(response)
        })
    });
  };
}


exports.verify = (req, res) => {
  knex('user-profile')
    .select('#')
    .where(username, req.body.username)
    .then((data) => {
      bcrypt.compare(req.body.password, data, function (err, isPasswordMatch) {
        return err == null ?
          callback(null, isPasswordMatch) :
          callback(err);
      })
    });
};

