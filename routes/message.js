const express = require('express');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { sendMessage, getMessages, deleteMessage } = require('../controllers/messageController');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/:userId/:receiverId',  getMessages);
router.delete('/:messageId',deleteMessage);

module.exports = router;
