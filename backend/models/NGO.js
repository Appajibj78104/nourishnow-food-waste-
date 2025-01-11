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
            required: true,
            verified: {
                type: Boolean,
                default: false
            }
        },
        panCard: {
            type: String,
            required: true,
            verified: {
                type: Boolean,
                default: false
            }
        },
        bankDetails: {
            type: String,
            required: true,
            verified: {
                type: Boolean,
                default: false
            }
        }
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verificationRemarks: {
        type: String,
        trim: true
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
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
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
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

// Update average rating pre-save
ngoSchema.pre('save', function(next) {
    if (this.ratings && this.ratings.length > 0) {
        this.averageRating = this.ratings.reduce((acc, curr) => acc + curr.rating, 0) / this.ratings.length;
    }
    next();
});

// Virtual for verification status
ngoSchema.virtual('isVerified').get(function() {
    return this.verificationStatus === 'verified';
});

// Method to check if all documents are verified
ngoSchema.methods.areDocumentsVerified = function() {
    return this.documents.registrationCertificate.verified &&
           this.documents.panCard.verified &&
           this.documents.bankDetails.verified;
};

const NGO = mongoose.model('NGO', ngoSchema);

module.exports = NGO; 