const express = require('express');
const {createPost, getPost, deletePost, likeUnlikePost} = require('../controller/postController.js');
const protectRoute = require('../middlewares/protectRoute.js');


const router = express.Router();

router.post('/create', protectRoute, createPost);
router.get('/:id', getPost);
router.delete('/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likeUnlikePost);


module.exports = router;