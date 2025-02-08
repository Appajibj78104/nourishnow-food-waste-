const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    availability: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        timeSlots: [{
            start: String,
            end: String
        }]
    }],
    skills: [{
        type: String
    }],
    area: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    documents: {
        idProof: String,
        addressProof: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    assignments: [{
        donation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        },
        role: String,
        date: Date,
        status: {
            type: String,
            enum: ['assigned', 'completed', 'cancelled'],
            default: 'assigned'
        }
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    feedback: [{
        comment: String,
        date: Date,
        rating: Number
    }]
}, {
    timestamps: true
});

// Index for geospatial queries if needed
volunteerSchema.index({ 'address.location': '2dsphere' });

module.exports = mongoose.model('Volunteer', volunteerSchema);