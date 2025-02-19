const express = require('express');
const protectRoute = require('../middlewares/protectRoute');
const { sendMessage, getMessages, getConversations } = require('../controller/messageController');

const router = express.Router();


router.get('/conversations', protectRoute, getConversations);
router.post('/', protectRoute, sendMessage);
router.get('/:otherUserId', protectRoute, getMessages);

module.exports = router;