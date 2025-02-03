const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    aadharNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    panNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePicture: String,
    badges: [{
        name: String,
        icon: String,
        dateAwarded: Date
    }],
    donationStats: {
        totalDonations: { type: Number, default: 0 },
        mealsProvided: { type: Number, default: 0 },
        peopleImpacted: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Calculate donation stats
donorSchema.methods.calculateStats = async function() {
    const donations = await mongoose.model('Donation').find({ donor: this.user });
    
    this.donationStats.totalDonations = donations.length;
    this.donationStats.mealsProvided = donations.reduce((sum, donation) => 
        sum + (donation.quantity * (donation.quantityUnit === 'meals' ? 1 : 3)), 0);
    this.donationStats.peopleImpacted = Math.floor(this.donationStats.mealsProvided / 3);
    
    const completedDonations = donations.filter(d => d.status === 'completed').length;
    this.donationStats.successRate = donations.length > 0 
        ? (completedDonations / donations.length) * 100 
        : 0;

    await this.save();
    return this.donationStats;
};

module.exports = mongoose.model('Donor', donorSchema); 