const Chat = require('../models/Chat.js');
<<<<<<< HEAD
const { catchAsync } = require('../utils/catchAsync');
=======
const catchAsync = require('../utils/catchAsync');
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)

// Get all chats for a user
 const getChats = catchAsync(async (req, res) => {
    const chats = await Chat.find({
        participants: req.user._id
    })
    .populate('participants', 'name profilePicture')
    .populate('lastMessage')
    .sort('-updatedAt');

    res.json(chats);
});

 const getChatById = catchAsync(async (req, res) => {
    const chat = await Chat.findById(req.params.id)
        .populate('participants', 'name profilePicture')
        .populate('messages.sender', 'name profilePicture');

    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    res.json(chat);
});

 const createChat = catchAsync(async (req, res) => {
    const { participantId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
        participants: { $all: [req.user._id, participantId] }
    });

    if (existingChat) {
        return res.json(existingChat);
    }

    const chat = await Chat.create({
        participants: [req.user._id, participantId],
        messages: []
    });

    await chat.populate('participants', 'name profilePicture');

    res.status(201).json(chat);
});

 const sendMessage = catchAsync(async (req, res) => {
    const { content } = req.body;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    const message = {
        sender: req.user._id,
        content,
        readBy: [req.user._id]
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    await chat.populate('messages.sender', 'name profilePicture');

    // Get socket instance
    const io = req.app.get('io');
    
    // Emit to other participants
    chat.participants.forEach(participantId => {
        if (participantId.toString() !== req.user._id.toString()) {
            io.to(`user:${participantId}`).emit('newMessage', {
                chatId,
                message: chat.messages[chat.messages.length - 1]
            });
        }
    });

    res.json(message);
});

 const markAsRead = catchAsync(async (req, res) => {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all messages as read
    chat.messages.forEach(message => {
        if (!message.readBy.includes(req.user._id)) {
            message.readBy.push(req.user._id);
        }
    });

    await chat.save();

    // Notify other participants
    const io = req.app.get('io');
    chat.participants.forEach(participantId => {
        if (participantId.toString() !== req.user._id.toString()) {
            io.to(`user:${participantId}`).emit('messagesRead', {
                chatId: chat._id,
                userId: req.user._id
            });
        }
    });

    res.json({ message: 'Messages marked as read' });
}); 

module.exports = {
    getChats,
    getChatById,
    createChat,
    sendMessage,
    markAsRead
};