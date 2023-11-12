const router = require("express").Router();
const authController = require('../controllers/authController');
const profileController=require('../controllers/profileController')

router
.route("/auth")
.post(authController.verify)


module.exports=router