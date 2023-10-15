const fileupload = require("express-fileupload");
exports.params=(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/post')

    res.send(process.env.PARAMS);
}