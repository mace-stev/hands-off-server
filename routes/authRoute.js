const router = require("express").Router();
const authController = require('../controllers/authController');

router
.route("/auth")
.post(authController.verify)
.get(authController.categories);

router
 .route("/auth/token-valid")
  .post(authController.tokenValid)


module.exports=router