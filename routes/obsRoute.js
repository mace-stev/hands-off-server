const router = require("express").Router();
const obsController=require('../controllers/obsController');

router
.route("/obs")
.post(obsController.OBS);



module.exports=router
