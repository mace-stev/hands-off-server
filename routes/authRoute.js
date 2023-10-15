const router = require("express").Router();
const authController = require('../controllers/authController');

router
.route("/auth")
.post(authController.params);


module.exports=router