const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    volunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer'
    }],
    pickupTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    route: {
        startLocation: {
            type: { type: String },
            coordinates: [Number]
        },
        endLocation: {
            type: { type: String },
            coordinates: [Number]
        }
    },
    notes: String,
    completionDetails: {
        completedAt: Date,
        notes: String,
        photos: [String]
    }
}, {
    timestamps: true
});

scheduleSchema.index({ 'route.startLocation': '2dsphere' });
scheduleSchema.index({ 'route.endLocation': '2dsphere' });

module.exports = mongoose.model('Schedule', scheduleSchema);