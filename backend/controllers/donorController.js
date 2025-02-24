const User = require('../models/User');
const Donation = require('../models/Donation');
const Broadcast = require('../models/Broadcast');
const NGO = require('../models/NGO');

// Get donor profile
const getDonorProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update donor profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, organization, socialLinks, preferences } = req.body;
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update basic fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        // Update nested objects if provided
        if (organization) {
            user.organization = {
                ...user.organization,
                ...organization
            };
        }

        if (socialLinks) {
            user.socialLinks = {
                ...user.socialLinks,
                ...socialLinks
            };
        }

        if (preferences) {
            user.preferences = {
                ...user.preferences,
                ...preferences
            };
        }

        await user.save();

        // Send response without password
        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Get donor stats
const getDonorStats = async (req, res) => {
    try {
        const stats = await Donation.aggregate([
            { $match: { donor: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalDonations: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    completedDonations: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    pendingDonations: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedQuantity: {
                        $sum: { 
                            $cond: [
                                { $eq: ['$status', 'completed'] }, 
                                '$quantity', 
                                0
                            ] 
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: '$totalDonations',
                    completed: '$completedDonations',
                    pending: '$pendingDonations',
                    impact: '$completedQuantity', // Only count completed donations for impact
                    mealsProvided: { $multiply: ['$completedQuantity', 3] }, // Each quantity serves 3 meals
                    peopleImpacted: { $multiply: ['$completedQuantity', 2] } // Each quantity impacts 2 people
                }
            }
        ]);

        const defaultStats = {
            total: 0,
            completed: 0,
            pending: 0,
            impact: 0,
            mealsProvided: 0,
            peopleImpacted: 0
        };

        res.json(stats[0] || defaultStats);
    } catch (error) {
        console.error('Error fetching donor stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching donor statistics',
            error: error.message
        });
    }
};

// Get donor leaderboard
const getDonorLeaderboard = async (req, res) => {
    try {
        const { timeframe = 'month' } = req.query;
        
        let dateFilter = {};
        const now = new Date();
        
        switch (timeframe) {
            case 'week':
                dateFilter = {
                    createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) }
                };
                break;
            case 'month':
                dateFilter = {
                    createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
                };
                break;
            case 'year':
                dateFilter = {
                    createdAt: { $gte: new Date(now.getFullYear(), 0, 1) }
                };
                break;
            default:
                dateFilter = {};
        }

        const leaderboard = await Donation.aggregate([
            { 
                $match: { 
                    ...dateFilter, 
                    status: 'completed' // Only count completed donations
                } 
            },
            {
                $group: {
                    _id: '$donor',
                    donations: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    lastDonation: { $max: '$createdAt' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'donor'
                }
            },
            { $unwind: '$donor' },
            {
                $project: {
                    _id: 1,
                    name: '$donor.name',
                    donations: 1,
                    impact: '$totalQuantity',
                    mealsProvided: { $multiply: ['$totalQuantity', 3] },
                    peopleImpacted: { $multiply: ['$totalQuantity', 2] },
                    lastDonation: 1
                }
            },
            { $sort: { donations: -1, lastDonation: -1 } },
            { $limit: 10 }
        ]);

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const { timeframe = 'month' } = req.query;
        let dateFilter = {};

        // Calculate date range based on timeframe
        const now = new Date();
        if (timeframe === 'week') {
            dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        } else if (timeframe === 'month') {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
        } else if (timeframe === 'year') {
            dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
        }

        const leaderboard = await Donation.aggregate([
            { $match: { ...dateFilter, status: 'completed' } },
            {
                $group: {
                    _id: '$donor',
                    donations: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    points: { 
                        $sum: {
                            $cond: [
                                { $eq: ['$status', 'completed'] },
                                { $multiply: ['$quantity', 10] }, // 10 points per quantity
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'donor'
                }
            },
            { $unwind: '$donor' },
            {
                $project: {
                    _id: 1,
                    name: '$donor.name',
                    donations: 1,
                    points: 1,
                    profilePicture: '$donor.profilePicture'
                }
            },
            { $sort: { points: -1 } },
            { $limit: 10 }
        ]);

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
};

const getBroadcasts = async (req, res) => {
    try {
        console.log('Fetching broadcasts for donor:', req.user._id);
        const broadcasts = await Broadcast.find({
            $or: [
                { sender: req.user._id },
                { recipients: { $in: ['all', 'donors'] } }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'name role');

        console.log('Found broadcasts:', broadcasts.length);
        res.json({
            success: true,
            data: broadcasts
        });
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching broadcasts'
        });
    }
};

const createBroadcast = async (req, res) => {
    try {
        const { title, message, recipients } = req.body;

        // Validate recipients
        if (!['all', 'ngos', 'admin'].includes(recipients)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid recipient type'
            });
        }

        const broadcast = await Broadcast.create({
            title,
            message,
            recipients,
            sender: req.user._id,
            urgency: 'normal'
        });

        // Get the io instance
        const io = req.app.get('io');

        // Emit to appropriate rooms based on recipients
        if (recipients === 'all') {
            io.to('admin-broadcasts').to('ngo-broadcasts').emit('newBroadcast', {
                broadcast: {
                    ...broadcast.toObject(),
                    sender: {
                        _id: req.user._id,
                        name: req.user.name,
                        role: 'donor'
                    }
                }
            });
        } else if (recipients === 'ngos') {
            io.to('ngo-broadcasts').emit('newBroadcast', {
                broadcast: {
                    ...broadcast.toObject(),
                    sender: {
                        _id: req.user._id,
                        name: req.user.name,
                        role: 'donor'
                    }
                }
            });
        } else if (recipients === 'admin') {
            io.to('admin-broadcasts').emit('newBroadcast', {
                broadcast: {
                    ...broadcast.toObject(),
                    sender: {
                        _id: req.user._id,
                        name: req.user.name,
                        role: 'donor'
                    }
                }
            });
        }

        res.status(201).json({
            success: true,
            data: broadcast
        });
    } catch (error) {
        console.error('Error creating broadcast:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating broadcast'
        });
    }
};

module.exports = {
    getDonorProfile,
    updateProfile,
    getDonorStats,
    getDonorLeaderboard,
    getLeaderboard,
    getBroadcasts,
    createBroadcast
}; 