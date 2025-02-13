const express = require('express');
const {followUnfollow, updateUser, getUserProfile} = require('../controller/userController.js');
const protectRoute = require('../middlewares/protectRoute.js');


const router = express.Router();

router.post('/follow/:id', protectRoute, followUnfollow);
router.put('/update', protectRoute, updateUser);
router.get('/profile/:query', getUserProfile);

module.exports = router;