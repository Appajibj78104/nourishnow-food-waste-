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
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
// Load env vars
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }
});

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(cors({
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
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
});