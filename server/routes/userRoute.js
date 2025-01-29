const express = require('express');
const {followUnfollow, updateUser} = require('../controller/userController.js');
const protectRoute = require('../middlewares/protectRoute.js');


const router = express.Router();

router.post('/follow/:id', protectRoute,  followUnfollow);
router.post('/update', protectRoute, updateUser);

module.exports = router;