const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    donationExpiryHours: {
        type: Number,
        default: 24
    },
    autoAssignNGOs: {
        type: Boolean,
        default: true
    },
    maxDonationDistance: {
        type: Number,
        default: 10
    },
    enableNotifications: {
        type: Boolean,
        default: true
    },
    requireVerification: {
        type: Boolean,
        default: true
    },
    minimumDonationQuantity: {
        type: Number,
        default: 1
    },
    systemMaintenanceMode: {
        type: Boolean,
        default: false
    },
    defaultRadius: {
        type: Number,
        default: 5
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema); 