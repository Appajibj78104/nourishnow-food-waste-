import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const sendNotification = (userId, notification) => {
    if (io) {
        io.to(userId).emit('notification', notification);
    }
};

export const broadcastDonationUpdate = (donationId, update) => {
    if (io) {
        io.emit('donationUpdate', { donationId, ...update });
    }
}; 