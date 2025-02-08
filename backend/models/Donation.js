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
<<<<<<< HEAD
        required: true
=======
        required: true,
        enum: ['cooked', 'packaged', 'raw', 'other']
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
        required: true
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
<<<<<<< HEAD
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
=======
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'assigned', 'completed', 'cancelled'],
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
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
    assignedVolunteer: {
        name: String,
        assignedAt: Date
    },
    completionDetails: {
        completedAt: Date,
        completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    pickupAddress: {
        street: String,
        district: String,
        state: String,
        pincode: String
    },
    pickupTime: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    description: String,
    location: {
        type: { type: String },
        coordinates: [Number]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for geospatial queries
donationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);