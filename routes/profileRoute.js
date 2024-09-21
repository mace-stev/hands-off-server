const router = require("express").Router();
const profileController = require('../controllers/profileController');


router
.route('/profile')
.post(profileController.signup)
.put(profileController.editProfile);

router
.route('/profile/forgot-password')
.post(profileController.forgotPassword);

router
 .route('/profile/reset-password')
    .post(profileController.resetPassword);





module.exports = router;