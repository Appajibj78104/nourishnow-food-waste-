const mongoose = require('mongoose');

const adminInventorySchema = new mongoose.Schema({
    foodType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'liters', 'pieces']
    },
    storageLocation: {
        type: String,
        required: true
    },
    assignedNGO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        default: null
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['good', 'expiring_soon', 'expired'],
        default: 'good'
    },
    temperature: {
        type: Number,
        required: true
    },
    notes: String,
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update status based on expiry date
adminInventorySchema.pre('save', function(next) {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((this.expiryDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
        this.status = 'expired';
    } else if (daysUntilExpiry <= 3) {
        this.status = 'expiring_soon';
    } else {
        this.status = 'good';
    }
    
    next();
});

module.exports = mongoose.model('AdminInventory', adminInventorySchema); 