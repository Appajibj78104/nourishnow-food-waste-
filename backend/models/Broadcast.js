const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipients: {
        type: String,
        enum: ['all', 'donors', 'admin', 'ngos'],
        default: 'all'
    },
    urgency: {
        type: String,
        enum: ['normal', 'urgent'],
        default: 'normal'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Broadcast', broadcastSchema);