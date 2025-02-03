const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

testConnection(); 