const router = require("express").Router();
const profileController = require('../controllers/profileController');


router
.route('/profile')
.post(profileController.signup);



module.exports = router;