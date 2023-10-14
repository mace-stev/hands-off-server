const router = require("express").Router();
const authController = require('../controllers/authController');

router
.route("/auth")
.get(authController.params);


module.exports=router