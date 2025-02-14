const express = require('express');
const {deleteReply, getUserPosts, createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts} = require('../controller/postController.js');
const protectRoute = require('../middlewares/protectRoute.js');


const router = express.Router();

router.get('/feed', protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPost);
router.get('/:id', getPost);
router.get('/user/:username', getUserPosts);
router.delete('/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likeUnlikePost);
router.post('/reply/:id', protectRoute, replyToPost);
router.delete('/reply/delete/:id', protectRoute, deleteReply);


module.exports = router;