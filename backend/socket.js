const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Chat = require('./models/Chat');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user._id);

        // Join user's personal room
        socket.join(`user:${socket.user._id}`);
        
        // Join role-specific room
        socket.join(`role:${socket.user.role}`);

        // If user is NGO, join NGO room
        if (socket.user.role === 'ngo') {
            socket.join(`ngo:${socket.user._id}`);
        }

        // Handle chat room join
        socket.on('joinChat', (chatId) => {
            socket.join(`chat:${chatId}`);
        });

        // Handle chat room leave
        socket.on('leaveChat', (chatId) => {
            socket.leave(`chat:${chatId}`);
        });

        // Handle new message
        socket.on('sendMessage', async (data) => {
            try {
                const { chatId, content } = data;
                
                // Save message to database
                const message = await saveMessage(chatId, socket.user._id, content);
                
                // Broadcast to chat room
                io.to(`chat:${chatId}`).emit('newMessage', message);
                
                // Send notification to offline participants
                const chat = await Chat.findById(chatId).populate('participants');
                chat.participants
                    .filter(p => p._id.toString() !== socket.user._id.toString())
                    .forEach(participant => {
                        io.to(`user:${participant._id}`).emit('messageNotification', {
                            chatId,
                            message: {
                                sender: socket.user._id,
                                content: content.substring(0, 50) + '...'
                            }
                        });
                    });
            } catch (error) {
                socket.emit('error', error.message);
            }
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            const { chatId } = data;
            socket.to(`chat:${chatId}`).emit('userTyping', {
                userId: socket.user._id,
                chatId
            });
        });

        // Handle donation notifications
        socket.on('donationCreated', async (donation) => {
            // Notify nearby NGOs
            const nearbyNGOs = await getNearbyNGOs(donation.location);
            nearbyNGOs.forEach(ngo => {
                io.to(`ngo:${ngo._id}`).emit('newDonation', donation);
            });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user._id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
}; 