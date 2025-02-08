const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    name: String,
    // ... other NGO fields ...
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add any missing fields needed for donation management
ngoSchema.virtual('activeDonations', {
    ref: 'Donation',
    localField: '_id',
    foreignField: 'assignedNGO',
    match: { status: { $in: ['assigned', 'accepted'] } }
});

// Drop any existing indexes to clean up
mongoose.connection.once('open', async () => {
    try {
        await mongoose.connection.collection('ngos').dropIndexes();
    } catch (err) {
        console.log('No indexes to drop');
    }
});

module.exports = mongoose.model('NGO', ngoSchema);