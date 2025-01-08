const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    quantityUnit: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    pickupAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    pickupTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'picked_up', 'completed', 'cancelled'],
        default: 'pending'
    },
    assignedNGO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);