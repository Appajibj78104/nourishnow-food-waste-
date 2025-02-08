const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
<<<<<<< HEAD
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'ngo', 'donor'],
        default: 'donor'
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
=======
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['donor', 'ngo', 'admin'],
        default: 'donor'
    },
    status: {
        type: String,
        enum: ['active', 'disabled'],
        default: 'active'
    },
    verified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        },
        privacySettings: {
            showProfile: { type: Boolean, default: true },
            showDonations: { type: Boolean, default: true }
        }
    },
    organization: {
        name: String,
        position: String
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)

const User = mongoose.model('User', userSchema);
module.exports = User;
