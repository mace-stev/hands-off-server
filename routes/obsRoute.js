const router = require("express").Router();
const obsController=require('../controllers/obsController');

router
.route("/obs")
.post(obsController.obs);



module.exports=router
