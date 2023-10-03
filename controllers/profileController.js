const bcrypt=require('bcrypt')
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
    }

}
exports.verify=(req,res)=>{
    bcrypt.compare(req.body.password, hashword, function(err, isPasswordMatch) {   
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
 };

