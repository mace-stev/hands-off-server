const bcrypt=require('bcrypt')
const knex = require('knex')(require('../knexfile'));
exports.signup=(req, res)=>{
    console.log(req.body)
    function signUp(callback){
        bcrypt.genSalt(12, function(err, salt) {
            if (err) 
              return callback(err);
        
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              return callback(err, hash);
            });
          });
          signUp(function(err, hash) {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal server error');
            }
        
            // Store the hashed password in the database
            console.log(hash);
            res.send('Password hashed successfully');
          });
        };
    }


exports.verify=(req,res)=>{
    bcrypt.compare(req.body.password, hashword, function(err, isPasswordMatch) {   
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
 };

