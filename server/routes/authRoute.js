const express = require('express');
const {signup, signin, logout, google} = require('../controller/authController.js');


const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.post('/google', google);

module.exports = router;