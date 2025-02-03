require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        console.log('Attempting to connect with URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Connection test failed:', error);
        process.exit(1);
    }
};

testConnection(); 