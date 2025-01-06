const express = require('express');
const cors = require('cors');
const connectDB = require('../backend/db'); // Import the database connection

// Initialize the app
const app = express();

// Connect to the database
connectDB();

// CORS options
const corsOptions = {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
