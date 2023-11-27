const router = require("express").Router();
const profileController = require('../controllers/profileController');


router
.route('/profile')
.post(profileController.signup)
.put(profileController.editProfile);




module.exports = router;