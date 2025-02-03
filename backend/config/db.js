const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
<<<<<<< HEAD
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
=======
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle MongoDB connection events
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        return conn;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        console.error('Full error:', error);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        process.exit(1);
    }
};

<<<<<<< HEAD
=======
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
module.exports = { connectDB };