const router = require("express").Router();
const videosController = require('../controllers/videosController')

router
.route('/vid')
.get(videosController.testing)
.post(videosController.recording);







module.exports = router;
