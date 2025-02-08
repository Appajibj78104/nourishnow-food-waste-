const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
<<<<<<< HEAD
=======
const fs = require('fs');
const donorRoutes = require('./routes/donorRoutes');
<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
const User = require('./models/User');

>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
// Load env vars
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io setup with updated CORS configuration
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Make io accessible in routes
app.set('io', io);

// CORS configuration
app.use(cors({
<<<<<<< HEAD
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
<<<<<<< HEAD
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
=======
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
=======
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
<<<<<<< HEAD
app.use('/api/donor', donationRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
// Error Handler
app.use(errorHandler);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
=======
app.use('/api/donations', donationRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donor', donorRoutes);

// Error Handler
app.use(errorHandler);

// Connect to Database first
connectDB().then(() => {
    // Only start server after DB connection is established
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    httpServer.close(() => {
        process.exit(1);
    });
<<<<<<< HEAD
=======
});

// Enable detailed error logging
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error('Error:', err.name, err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
});

// Update the socket.io setup
io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('userConnected', async (userId) => {
        try {
            console.log('User connected:', userId);
            await User.findByIdAndUpdate(userId, { socketId: socket.id });
        } catch (error) {
            console.error('Error storing socket ID:', error);
        }
    });

    socket.on('joinBroadcastRoom', (data) => {
        console.log('User joining broadcast room:', data);
        const roomName = `${data.role}-broadcasts`;
        socket.join(roomName);
        console.log(`Joined room: ${roomName}`);
    });

    socket.on('leaveBroadcastRoom', (data) => {
        console.log('User leaving broadcast room:', data);
        const roomName = `${data.role}-broadcasts`;
        socket.leave(roomName);
        console.log(`Left room: ${roomName}`);
    });

    socket.on('disconnect', async () => {
        try {
            await User.findOneAndUpdate(
                { socketId: socket.id },
                { $unset: { socketId: 1 } }
            );
            console.log('User disconnected:', socket.id);
        } catch (error) {
            console.error('Error removing socket ID:', error);
        }
    });
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
});