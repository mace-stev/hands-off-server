const router = require("express").Router();
const videosController = require('../controllers/videosController')

router
.route('/')
.get(videosController.testing)
.post(videosController.recording);










module.exports = router;
