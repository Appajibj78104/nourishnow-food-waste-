const User = require('../models/User');
const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const Chat = require('../models/Chat');

class SocketEventHandlers {
    constructor(io) {
        this.io = io;
        this.connectedUsers = new Map();
    }

    handleConnection(socket) {
        const userId = socket.user._id;
        this.connectedUsers.set(userId, socket.id);
        
        // Join user-specific room
        socket.join(`user:${userId}`);
        
        // Join role-specific room
        socket.join(`role:${socket.user.role}`);

        // Handle user-specific events
        this.setupUserEvents(socket);
        
        // Handle donation events
        this.setupDonationEvents(socket);
        
        // Handle chat events
        this.setupChatEvents(socket);
        
        // Handle notification events
        this.setupNotificationEvents(socket);

        socket.on('disconnect', () => this.handleDisconnect(socket));
    }

    setupUserEvents(socket) {
        const userId = socket.user._id;

        socket.on('updateStatus', async (status) => {
            try {
                await User.findByIdAndUpdate(userId, { status });
                this.io.emit('userStatusUpdated', { userId, status });
            } catch (error) {
                socket.emit('error', error.message);
            }
        });

        socket.on('joinNGORoom', async (ngoId) => {
            socket.join(`ngo:${ngoId}`);
        });
    }

    setupDonationEvents(socket) {
        socket.on('donationCreated', async (donation) => {
            try {
                // Find nearby NGOs
                const nearbyNGOs = await NGO.find({
                    location: {
                        $near: {
                            $geometry: donation.location,
                            $maxDistance: 10000 // 10km radius
                        }
                    }
                });

                // Notify nearby NGOs
                nearbyNGOs.forEach(ngo => {
                    this.io.to(`ngo:${ngo._id}`).emit('newDonation', {
                        donation,
                        message: 'New donation available in your area'
                    });
                });
            } catch (error) {
                socket.emit('error', error.message);
            }
        });

        socket.on('donationStatusUpdate', async (data) => {
            try {
                const { donationId, status, location } = data;
                const donation = await Donation.findByIdAndUpdate(
                    donationId,
                    { status, currentLocation: location },
                    { new: true }
                );

                // Notify relevant parties
                this.io.to(`donation:${donationId}`).emit('donationUpdated', donation);
                
                if (donation.donor) {
                    this.io.to(`user:${donation.donor}`).emit('donationStatusChanged', {
                        donationId,
                        status,
                        location
                    });
                }
            } catch (error) {
                socket.emit('error', error.message);
            }
        });
    }

    setupChatEvents(socket) {
        socket.on('joinChat', (chatId) => {
            socket.join(`chat:${chatId}`);
        });

        socket.on('leaveChat', (chatId) => {
            socket.leave(`chat:${chatId}`);
        });

        socket.on('sendMessage', async (data) => {
            try {
                const { chatId, content } = data;
                const message = await this.saveMessage(chatId, socket.user._id, content);
                
                this.io.to(`chat:${chatId}`).emit('newMessage', {
                    chatId,
                    message: {
                        ...message.toObject(),
                        sender: {
                            _id: socket.user._id,
                            name: socket.user.name
                        }
                    }
                });
            } catch (error) {
                socket.emit('error', error.message);
            }
        });

        socket.on('typing', (data) => {
            const { chatId } = data;
            socket.to(`chat:${chatId}`).emit('userTyping', {
                userId: socket.user._id,
                chatId
            });
        });
    }

    setupNotificationEvents(socket) {
        socket.on('markNotificationRead', async (notificationId) => {
            try {
                await this.markNotificationRead(socket.user._id, notificationId);
                socket.emit('notificationMarkedRead', notificationId);
            } catch (error) {
                socket.emit('error', error.message);
            }
        });
    }

    async saveMessage(chatId, senderId, content) {
        const chat = await Chat.findById(chatId);
        if (!chat) throw new Error('Chat not found');

        const message = {
            sender: senderId,
            content,
            readBy: [senderId]
        };

        chat.messages.push(message);
        chat.lastMessage = message;
        await chat.save();

        return message;
    }

    async markNotificationRead(userId, notificationId) {
        await User.updateOne(
            { _id: userId, 'notifications._id': notificationId },
            { $set: { 'notifications.$.read': true } }
        );
    }

    handleDisconnect(socket) {
        const userId = socket.user._id;
        this.connectedUsers.delete(userId);
        this.io.emit('userOffline', userId);
    }

    // Utility methods for broadcasting
    broadcastToNearbyNGOs(location, event, data, radius = 10000) {
        NGO.find({
            location: {
                $near: {
                    $geometry: location,
                    $maxDistance: radius
                }
            }
        }).then(ngos => {
            ngos.forEach(ngo => {
                this.io.to(`ngo:${ngo._id}`).emit(event, data);
            });
        });
    }

    broadcastUrgentAlert(message, location, radius = 10000) {
        this.broadcastToNearbyNGOs(location, 'urgentAlert', {
            message,
            location,
            timestamp: new Date()
        }, radius);
    }
}

module.exports = SocketEventHandlers; 