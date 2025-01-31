const express = require('express');
const {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts} = require('../controller/postController.js');
const protectRoute = require('../middlewares/protectRoute.js');


const router = express.Router();

router.get('/feed', protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPost);
router.get('/:id', getPost);
router.delete('/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likeUnlikePost);
router.post('/reply/:id', protectRoute, replyToPost);


module.exports = router;