const Chat = require('../models/Chat');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

class ChatService {
    constructor(io) {
        this.io = io;
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);

            // Join personal room
            socket.on('join', async (userId) => {
                socket.join(userId);
                await User.findByIdAndUpdate(userId, { isOnline: true });
                this.io.emit('userOnline', userId);
            });

            // Join chat room
            socket.on('joinChat', (chatId) => {
                socket.join(`chat:${chatId}`);
            });

            // Handle new message
            socket.on('sendMessage', async (data) => {
                try {
                    const { chatId, senderId, content, attachments } = data;
                    
                    // Process attachments if any
                    const processedAttachments = await Promise.all(
                        (attachments || []).map(async (file) => {
                            const result = await uploadToCloudinary(file);
                            return {
                                url: result.secure_url,
                                fileType: file.mimetype
                            };
                        })
                    );

                    // Create message
                    const message = {
                        sender: senderId,
                        content,
                        attachments: processedAttachments,
                        readBy: [senderId]
                    };

                    // Update chat with new message
                    const updatedChat = await Chat.findByIdAndUpdate(
                        chatId,
                        {
                            $push: { messages: message },
                            lastMessage: message
                        },
                        { new: true }
                    ).populate('participants', 'name profilePicture');

                    // Emit to all participants
                    this.io.to(`chat:${chatId}`).emit('newMessage', {
                        chatId,
                        message: {
                            ...message,
                            createdAt: new Date()
                        }
                    });

                    // Send notification to offline participants
                    updatedChat.participants
                        .filter(p => p._id.toString() !== senderId)
                        .forEach(participant => {
                            this.io.to(participant._id.toString()).emit('messageNotification', {
                                chatId,
                                message: {
                                    content,
                                    sender: senderId
                                }
                            });
                        });

                } catch (error) {
                    console.error('Message Error:', error);
                    socket.emit('messageError', error.message);
                }
            });

            // Handle read receipts
            socket.on('markAsRead', async ({ chatId, userId }) => {
                try {
                    await Chat.updateMany(
                        { _id: chatId, 'messages.readBy': { $ne: userId } },
                        { $addToSet: { 'messages.$[].readBy': userId } }
                    );

                    this.io.to(`chat:${chatId}`).emit('messagesRead', {
                        chatId,
                        userId
                    });
                } catch (error) {
                    console.error('Read Receipt Error:', error);
                }
            });

            // Handle typing indicators
            socket.on('typing', ({ chatId, userId }) => {
                socket.to(`chat:${chatId}`).emit('userTyping', {
                    chatId,
                    userId
                });
            });

            // Handle disconnect
            socket.on('disconnect', async () => {
                const userId = socket.userId;
                if (userId) {
                    await User.findByIdAndUpdate(userId, { isOnline: false });
                    this.io.emit('userOffline', userId);
                }
            });
        });
    }

    // Service methods for REST API
    async getChats(userId) {
        return await Chat.find({ participants: userId })
            .populate('participants', 'name profilePicture')
            .populate('lastMessage')
            .sort('-updatedAt');
    }

    async getChatMessages(chatId, userId) {
        const chat = await Chat.findById(chatId);
        if (!chat.participants.includes(userId)) {
            throw new Error('Unauthorized access to chat');
        }
        return chat.messages;
    }

    async createChat(participantIds, donationId = null) {
        return await Chat.create({
            participants: participantIds,
            donationId,
            messages: []
        });
    }
}

module.exports = ChatService; 