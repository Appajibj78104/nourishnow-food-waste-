const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
    getChats, 
    getChatById, 
    createChat, 
    sendMessage, 
    markAsRead 
} = require('../controllers/chatController');

const router = express.Router();

router.use(protect);

router.get('/', getChats);
router.get('/:id', getChatById);
router.post('/', createChat);
router.post('/:id/messages', sendMessage);
router.patch('/:id/read', markAsRead);

module.exports = router;