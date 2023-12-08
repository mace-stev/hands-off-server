const router = require("express").Router();
const obsController=require('../controllers/obsController');

router
.route("/obs")
.post(obsController.OBS)


router
.route('/obs/stream')
.post(obsController.streamStatus);

module.exports=router
