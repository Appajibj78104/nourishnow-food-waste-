const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    darpanId: {
        type: String,
        required: true,
        unique: true
    },
    panNumber: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    servingCapacity: {
        type: Number,
        required: true
    },
    operatingAreas: [String],
    establishedYear: {
        type: Number,
        required: true
    },
    documents: {
        registrationCertificate: {
            type: String,
            required: true
        },
        panCard: {
            type: String,
            required: true
        },
        bankDetails: {
            type: String,
            required: true
        }
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    stats: {
        totalDonationsReceived: {
            type: Number,
            default: 0
        },
        peopleServed: {
            type: Number,
            default: 0
        },
        activeDonors: {
            type: Number,
            default: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for geospatial queries
ngoSchema.index({ location: '2dsphere' });

const NGO = mongoose.model('NGO', ngoSchema);

module.exports = NGO; 