const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    termsOfService: {
        type: String,
        required: true
    },
    privacyPolicy: {
        type: String,
        required: true
    },
    donationGuidelines: {
        type: String,
        required: true
    },
    ngoGuidelines: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema); 