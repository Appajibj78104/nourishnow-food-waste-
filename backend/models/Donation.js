const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodType: {
        type: String,
<<<<<<< HEAD
        required: true
=======
        required: true,
        enum: ['cooked', 'packaged', 'raw', 'other']
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    },
    quantity: {
        type: Number,
        required: true
    },
    quantityUnit: {
        type: String,
<<<<<<< HEAD
        required: true
=======
        default: 'servings'
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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
<<<<<<< HEAD
    status: {
        type: String,
        enum: ['pending', 'accepted', 'picked_up', 'completed', 'cancelled'],
=======
    description: {
        type: String
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        default: 'pending'
    },
    assignedNGO: {
        type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
        ref: 'User'
=======
        ref: 'NGO'
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);