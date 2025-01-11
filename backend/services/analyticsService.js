const User = require('../models/User');
const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const ActivityLog = require('../models/ActivityLog');

const analyticsService = {
    async getDonationMetrics(timeRange = 30) {
        const date = new Date();
        date.setDate(date.getDate() - timeRange);

        const [totalDonations, successfulDonations, averageQuantity] = await Promise.all([
            Donation.countDocuments({ createdAt: { $gte: date } }),
            Donation.countDocuments({ 
                createdAt: { $gte: date },
                status: 'completed'
            }),
            Donation.aggregate([
                { $match: { createdAt: { $gte: date } } },
                { $group: { _id: null, avg: { $avg: '$quantity' } } }
            ])
        ]);

        return {
            totalDonations,
            successfulDonations,
            averageQuantity: averageQuantity[0]?.avg || 0,
            successRate: (successfulDonations / totalDonations) * 100
        };
    },

    async getUserMetrics(timeRange = 30) {
        const date = new Date();
        date.setDate(date.getDate() - timeRange);

        const [totalUsers, activeUsers, userTypes] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: date } }),
            User.countDocuments({ 
                lastActive: { $gte: date }
            }),
            User.aggregate([
                { $match: { createdAt: { $gte: date } } },
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ])
        ]);

        return {
            totalUsers,
            activeUsers,
            userTypes: userTypes.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        };
    },

    async getNGOMetrics(timeRange = 30) {
        const date = new Date();
        date.setDate(date.getDate() - timeRange);

        const [totalNGOs, verifiedNGOs, averageRating] = await Promise.all([
            NGO.countDocuments({ createdAt: { $gte: date } }),
            NGO.countDocuments({ 
                createdAt: { $gte: date },
                verificationStatus: 'verified'
            }),
            NGO.aggregate([
                { $match: { createdAt: { $gte: date } } },
                { $group: { _id: null, avg: { $avg: '$averageRating' } } }
            ])
        ]);

        return {
            totalNGOs,
            verifiedNGOs,
            averageRating: averageRating[0]?.avg || 0,
            verificationRate: (verifiedNGOs / totalNGOs) * 100
        };
    },

    async getActivityMetrics(timeRange = 30) {
        const date = new Date();
        date.setDate(date.getDate() - timeRange);

        const activities = await ActivityLog.aggregate([
            { $match: { createdAt: { $gte: date } } },
            { $group: { 
                _id: { 
                    entityType: '$entityType',
                    day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                },
                count: { $sum: 1 }
            }},
            { $sort: { '_id.day': 1 } }
        ]);

        return activities.reduce((acc, curr) => {
            if (!acc[curr._id.entityType]) {
                acc[curr._id.entityType] = {};
            }
            acc[curr._id.entityType][curr._id.day] = curr.count;
            return acc;
        }, {});
    }
};

module.exports = analyticsService; 