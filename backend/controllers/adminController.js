const User = require('../models/User');
const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const Feedback = require('../models/Feedback');
const Content = require('../models/Content');
const Policy = require('../models/Policy');
const Settings = require('../models/Settings');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const Broadcast = require('../models/Broadcast');


// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        // Get total donations
        const totalDonations = await Donation.countDocuments();

        // Get NGOs count
        const totalNGOs = await User.countDocuments({ role: 'ngo' });

        // Get donors count
        const totalDonors = await User.countDocuments({ role: 'donor' });

        // Get pending pickups
        const pendingPickups = await Donation.countDocuments({ status: 'pending' });

        // Get active pickups
        const activePickups = await Donation.countDocuments({ status: 'accepted' });

        // Get completed donations
        const completedDonations = await Donation.countDocuments({ status: 'completed' });

        // Calculate success rate
        const successRate = totalDonations > 0 
            ? ((completedDonations / totalDonations) * 100).toFixed(2) 
            : 0;

        // Get meals provided (assuming each donation serves 10 meals on average)
        const donations = await Donation.find({ status: 'completed' });
        const mealsProvided = donations.reduce((total, donation) => {
            return total + (Number(donation.quantity) * 10); // Approximate meals per donation
        }, 0);

        // Get people served (assuming each meal serves 1 person)
        const peopleServed = mealsProvided;

        // Get active deliveries (same as active pickups for now)
        const activeDeliveries = activePickups;

        res.json({
            success: true,
            data: {
                totalDonations,
                totalNGOs,
                totalDonors,
                mealsProvided,
                peopleServed,
                pendingPickups,
                activePickups,
                activeDeliveries,
                successRate
            }
        });
    } catch (error) {
        console.error('Error getting admin stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const { timeframe } = req.query;
        const now = new Date();
        let startDate;

        // Set time range based on timeframe
        switch (timeframe) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default: // month
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        // Donor Activity Metrics
        const donorMetrics = await User.aggregate([
            { $match: { role: 'donor', createdAt: { $gte: startDate } } },
            {
                $facet: {
                    'totalDonors': [{ $count: 'count' }],
                    'activeDonors': [
                        {
                            $lookup: {
                                from: 'donations',
                                localField: '_id',
                                foreignField: 'donor',
                                as: 'donations'
                            }
                        },
                        { $match: { 'donations.0': { $exists: true } } },
                        { $count: 'count' }
                    ],
                    'donationTrends': [
                        {
                            $lookup: {
                                from: 'donations',
                                localField: '_id',
                                foreignField: 'donor',
                                as: 'donations'
                            }
                        },
                        { $unwind: '$donations' },
                        {
                            $group: {
                                _id: { $dateToString: { format: '%Y-%m-%d', date: '$donations.createdAt' } },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id': 1 } }
                    ]
                }
            }
        ]);

        // NGO Performance Metrics
        const ngoMetrics = await NGO.aggregate([
            {
                $lookup: {
                    from: 'donations',
                    localField: '_id',
                    foreignField: 'assignedNGO',
                    as: 'donations'
                }
            },
            {
                $facet: {
                    'totalPickups': [
                        { $unwind: '$donations' },
                        { $match: { 'donations.status': 'completed' } },
                        { $count: 'count' }
                    ],
                    'avgResponseTime': [
                        { $unwind: '$donations' },
                        {
                            $project: {
                                responseTime: {
                                    $subtract: [
                                        '$donations.updatedAt',
                                        '$donations.createdAt'
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                avgTime: { $avg: '$responseTime' }
                            }
                        }
                    ],
                    'successRate': [
                        { $unwind: '$donations' },
                        {
                            $group: {
                                _id: null,
                                completed: {
                                    $sum: {
                                        $cond: [{ $eq: ['$donations.status', 'completed'] }, 1, 0]
                                    }
                                },
                                total: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                rate: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
                            }
                        }
                    ]
                }
            }
        ]);

        // Impact Metrics
        const impactMetrics = await Donation.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$quantity' },
                    totalDonations: { $sum: 1 },
                    avgQuantityPerDonation: { $avg: '$quantity' }
                }
            }
        ]);

        // Success Metrics
        const successMetrics = await Donation.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                donorMetrics: donorMetrics[0],
                ngoMetrics: ngoMetrics[0],
                impactMetrics: impactMetrics[0],
                successMetrics: successMetrics
            }
        });

    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating analytics'
        });
    }
};

// Recent Activity
exports.getRecentActivity = async (req, res) => {
    try {
        const recentDonations = await Donation.find()
            .sort('-createdAt')
            .limit(5)
            .populate('donor', 'name')
            .populate('assignedNGO', 'name');

        const recentNGOs = await NGO.find()
            .sort('-createdAt')
            .limit(5)
            .populate('user', 'name');

        res.json({
            recentDonations,
            recentNGOs
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent activity', error: error.message });
    }
};

// User Management
exports.getUsers = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
        query.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ];
    }
    if (req.query.role) {
        query.role = req.query.role;
    }

    const users = await User.find(query)
        .skip(skip)
        .limit(limit)
        .select('-password');

    const total = await User.countDocuments(query);

    res.status(200).json({
        users,
        total,
        pages: Math.ceil(total / limit)
    });
});

exports.updateUserStatus = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json(user);
});

// NGO Verification
exports.getNGOVerificationRequests = catchAsync(async (req, res) => {
    const requests = await NGO.find({ verificationStatus: 'pending' })
        .populate('user', 'name email');

    res.status(200).json(requests);
});

exports.verifyNGO = catchAsync(async (req, res) => {
    const ngo = await NGO.findByIdAndUpdate(
        req.params.id,
        {
            verificationStatus: req.body.status,
            verificationRemarks: req.body.remarks
        },
        { new: true }
    );

    if (!ngo) {
        throw new AppError('NGO not found', 404);
    }

    // Emit socket event for real-time update
    req.io.emit('ngoVerificationUpdate', {
        ngoId: ngo._id,
        status: ngo.verificationStatus
    });

    res.status(200).json(ngo);
});

// Analytics
exports.getAnalytics = catchAsync(async (req, res) => {
    try {
        const { timeframe } = req.query;
        const now = new Date();
        let startDate;

        // Set time range based on timeframe
        switch (timeframe) {
        case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
            default: // month
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        // Donor Activity Metrics
        const donorMetrics = await User.aggregate([
            { $match: { role: 'donor', createdAt: { $gte: startDate } } },
            {
                $facet: {
                    'totalDonors': [{ $count: 'count' }],
                    'activeDonors': [
                        {
                            $lookup: {
                                from: 'donations',
                                localField: '_id',
                                foreignField: 'donor',
                                as: 'donations'
                            }
                        },
                        { $match: { 'donations.0': { $exists: true } } },
                        { $count: 'count' }
                    ],
                    'donationTrends': [
                        {
                            $lookup: {
                                from: 'donations',
                                localField: '_id',
                                foreignField: 'donor',
                                as: 'donations'
                            }
                        },
                        { $unwind: '$donations' },
            {
                $group: {
                                _id: { $dateToString: { format: '%Y-%m-%d', date: '$donations.createdAt' } },
                    count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id': 1 } }
                    ]
                }
            }
        ]);

        // NGO Performance Metrics
        const ngoMetrics = await NGO.aggregate([
            {
                $lookup: {
                    from: 'donations',
                    localField: '_id',
                    foreignField: 'assignedNGO',
                    as: 'donations'
                }
            },
            {
                $facet: {
                    'totalPickups': [
                        { $unwind: '$donations' },
                        { $match: { 'donations.status': 'completed' } },
                        { $count: 'count' }
                    ],
                    'avgResponseTime': [
                        { $unwind: '$donations' },
                        {
                            $project: {
                                responseTime: {
                                    $subtract: [
                                        '$donations.updatedAt',
                                        '$donations.createdAt'
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                avgTime: { $avg: '$responseTime' }
                            }
                        }
                    ],
                    'successRate': [
                        { $unwind: '$donations' },
                        {
                            $group: {
                                _id: null,
                                completed: {
                                    $sum: {
                                        $cond: [{ $eq: ['$donations.status', 'completed'] }, 1, 0]
                                    }
                                },
                                total: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                rate: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }
                            }
                        }
                    ]
                }
            }
        ]);

        // Impact Metrics
        const impactMetrics = await Donation.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$quantity' },
                    totalDonations: { $sum: 1 },
                    avgQuantityPerDonation: { $avg: '$quantity' }
                }
            }
        ]);

        // Success Metrics
        const successMetrics = await Donation.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                donorMetrics: donorMetrics[0],
                ngoMetrics: ngoMetrics[0],
                impactMetrics: impactMetrics[0],
                successMetrics: successMetrics
            }
        });

    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating analytics'
        });
    }
});

// Content Management
exports.getContent = catchAsync(async (req, res) => {
    const content = await Content.find();
    res.status(200).json(content);
});

exports.createContent = catchAsync(async (req, res) => {
    const content = await Content.create(req.body);
    res.status(201).json(content);
});

exports.updateContent = catchAsync(async (req, res) => {
    const content = await Content.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!content) {
        throw new AppError('Content not found', 404);
    }

    res.status(200).json(content);
});

// Policy Management
exports.getPolicies = catchAsync(async (req, res) => {
    const policies = await Policy.findOne();
    res.status(200).json(policies);
});

exports.updatePolicies = catchAsync(async (req, res) => {
    const policies = await Policy.findOneAndUpdate(
        {},
        req.body,
        { new: true, upsert: true }
    );
    res.status(200).json(policies);
});

// System Settings
exports.getSystemSettings = catchAsync(async (req, res) => {
    const settings = await Settings.findOne();
    res.status(200).json(settings);
});

exports.updateSystemSettings = catchAsync(async (req, res) => {
    const settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        { new: true, upsert: true }
    );
    res.status(200).json(settings);
});

// User Management - Adding getUserDetails
exports.getUserDetails = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('donations')
        .populate('ngo');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json(user);
});

// Donation Management - Adding missing functions
exports.getDonationStats = catchAsync(async (req, res) => {
    const stats = await Donation.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalQuantity: { $sum: '$quantity' },
                avgQuantity: { $avg: '$quantity' }
            }
        }
    ]);

    res.status(200).json(stats);
});

exports.getActiveDonations = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({ status: 'active' })
        .populate('donor', 'name email')
        .populate('assignedNGO', 'name')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');

    const total = await Donation.countDocuments({ status: 'active' });

    res.status(200).json({
        donations,
        total,
        pages: Math.ceil(total / limit)
    });
});

exports.getCompletedDonations = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({ status: 'completed' })
        .populate('donor', 'name email')
        .populate('assignedNGO', 'name')
        .skip(skip)
        .limit(limit)
        .sort('-completedAt');

    const total = await Donation.countDocuments({ status: 'completed' });

    res.status(200).json({
        donations,
        total,
        pages: Math.ceil(total / limit)
    });
});

exports.getDonationDetails = catchAsync(async (req, res) => {
    const donation = await Donation.findById(req.params.id)
        .populate('donor', 'name email phone')
        .populate('assignedNGO', 'name email phone address')
        .populate('deliveryPartner', 'name phone');

    if (!donation) {
        throw new AppError('Donation not found', 404);
    }

    res.status(200).json(donation);
});

// Content Management - Adding delete function
exports.deleteContent = catchAsync(async (req, res) => {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
        throw new AppError('Content not found', 404);
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Feedback Management - Adding missing functions
exports.getFeedback = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find()
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');

    const total = await Feedback.countDocuments();

    res.status(200).json({
        feedback,
        total,
        pages: Math.ceil(total / limit)
    });
});

exports.getFeedbackDetails = catchAsync(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id)
        .populate('user', 'name email')
        .populate('donation', 'title status');

    if (!feedback) {
        throw new AppError('Feedback not found', 404);
    }

    res.status(200).json(feedback);
});

exports.updateFeedbackStatus = catchAsync(async (req, res) => {
    const feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
            adminResponse: req.body.response,
            resolvedAt: req.body.status === 'resolved' ? Date.now() : undefined
        },
        { new: true }
    );

    if (!feedback) {
        throw new AppError('Feedback not found', 404);
    }

    // Emit socket event for real-time update
    if (req.io) {
        req.io.emit('feedbackStatusUpdate', {
            feedbackId: feedback._id,
            status: feedback.status,
            response: feedback.adminResponse
        });
    }

    res.status(200).json(feedback);
});

// System Health & Metrics
exports.getSystemHealth = catchAsync(async (req, res) => {
    const metrics = {
        cpu: process.cpuUsage(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        activeConnections: req.app.get('activeConnections') || 0
    };

    const health = {
        database: mongoose.connection.readyState === 1,
        server: true,
        metrics
    };

    res.status(200).json(health);
});

exports.getRealTimeMetrics = catchAsync(async (req, res) => {
    const [activeUsers, activeDonations, pendingVerifications] = await Promise.all([
        User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 5 * 60 * 1000) } }),
        Donation.countDocuments({ status: 'active' }),
        NGO.countDocuments({ verificationStatus: 'pending' })
    ]);

    res.status(200).json({
        activeUsers,
        activeDonations,
        pendingVerifications,
        timestamp: new Date()
    });
});

// Enhanced Error Handling
exports.handleAdminError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production error response
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!'
            });
        }
    }
};

exports.addContent = async (req, res) => {
    const { content } = req.body;
    try {
        const newContent = await Content.create({ content });
        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({ message: 'Error adding content', error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find()
            .select('-password')
            .lean();

        // Fetch all NGOs with valid user references
        const ngos = await NGO.find()
            .populate({
                path: 'user',
                select: '-password'
            })
            .lean();

        // Create a map of NGO data by user ID for quick lookup
        const ngoMap = new Map();
        ngos.forEach(ngo => {
            if (ngo.user && ngo.user._id) {
                ngoMap.set(ngo.user._id.toString(), ngo);
            }
        });

        // Enhance user data with NGO information
        const enhancedUsers = users.map(user => {
            // Base user data with defaults
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status || 'active',
                verified: user.verified || false,
                phone: user.phone || '',
                address: user.address || '',
                createdAt: user.createdAt
            };

            // If user is an NGO, add NGO-specific data
            if (user.role === 'ngo') {
                const ngoData = ngoMap.get(user._id.toString());
                if (ngoData) {
                    return {
                        ...userData,
                        registrationNumber: ngoData.registrationNumber || 'Not provided',
                        verified: ngoData.verified || false,
                        ngoId: ngoData._id
                    };
                }
            }

            return userData;
        });

        // Filter users based on role
        const donors = enhancedUsers.filter(user => user.role === 'donor');
        const ngoUsers = enhancedUsers.filter(user => user.role === 'ngo');

        res.json({
            success: true,
            data: {
                donors,
                ngos: ngoUsers
            }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isNGO } = req.body;

        if (isNGO) {
            const ngo = await NGO.findOne({ user: userId });
            if (!ngo) {
                return res.status(404).json({
                    success: false,
                    message: 'NGO not found'
                });
            }
            ngo.verified = true;
            await ngo.save();
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { verified: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying user',
            error: error.message
        });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.status = status;
        await user.save();

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message
        });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate({
                path: 'donor',
                select: 'name email'
            })
            .populate({
                path: 'assignedNGO',
                select: 'name registrationNumber'
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: donations
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching donations'
        });
    }
};

const getVerifiedNGOs = async (req, res) => {
    try {
        const ngos = await NGO.find({ verified: true })
            .populate({
                path: 'user',
                select: 'name email'
            });

        // Transform the data to match the expected format
        const formattedNGOs = ngos.map(ngo => ({
            _id: ngo._id,
            name: ngo.user?.name || 'Unknown NGO',
            email: ngo.user?.email,
            registrationNumber: ngo.registrationNumber
        }));

        res.json({
            success: true,
            data: formattedNGOs
        });
    } catch (error) {
        console.error('Error fetching NGOs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching NGOs'
        });
    }
};

const assignDonation = async (req, res) => {
    try {
        const { donationId } = req.params;
        const { ngoId } = req.body;

        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        const ngo = await NGO.findById(ngoId);
        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        donation.assignedNGO = ngoId;
        donation.status = 'assigned';
        await donation.save();

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        console.error('Error assigning donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning donation'
        });
    }
};

const updateDonationStatus = async (req, res) => {
    try {
        const { donationId } = req.params;
        const { status } = req.body;

        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        donation.status = status;
        await donation.save();

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        console.error('Error updating donation status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating donation status'
        });
    }
};

const getBroadcasts = async (req, res) => {
    try {
        const broadcasts = await Broadcast.find()
            .sort({ createdAt: -1 })
            .populate('sender', 'name');

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
        const { title, message, recipients, urgency } = req.body;

        const broadcast = await Broadcast.create({
            title,
            message,
            recipients,
            urgency,
            sender: req.user._id
        });

        // Emit socket event for real-time notifications
        const io = req.app.get('io');
        
        // Determine target users based on recipients
        let targetUsers = [];
        if (recipients === 'all') {
            targetUsers = await User.find({ _id: { $ne: req.user._id } });
        } else if (recipients === 'donors') {
            targetUsers = await User.find({ role: 'donor' });
        } else if (recipients === 'ngos') {
            targetUsers = await User.find({ role: 'ngo' });
        }

        // Emit to specific users
        targetUsers.forEach(user => {
            if (user.socketId) {
                io.to(user.socketId).emit('newBroadcast', {
                    broadcast: {
                        _id: broadcast._id,
                        title: broadcast.title,
                        message: broadcast.message,
                        urgency: broadcast.urgency,
                        createdAt: broadcast.createdAt
                    }
                });
            }
        });

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

const getAdminAnalytics = async (req, res) => {
    try {
        const timeframe = req.query.timeframe || 'month';
        
        // Calculate date range
        const now = new Date();
        let startDate;
        switch (timeframe) {
            case 'week':
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        }

        // Get donations timeline
        const timeline = await Donation.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    donations: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get food type distribution
        const foodTypes = await Donation.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$foodType",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate current period metrics
        const currentPeriod = await Donation.countDocuments({
            createdAt: { $gte: startDate }
        });

        // Calculate previous period for growth rate
        const previousStartDate = new Date(startDate - (now - startDate));
        const previousPeriod = await Donation.countDocuments({
            createdAt: { $gte: previousStartDate, $lt: startDate }
        });

        const growthRate = previousPeriod === 0 
            ? 100 
            : ((currentPeriod - previousPeriod) / previousPeriod) * 100;

        res.json({
            success: true,
            data: {
                timeline: timeline.map(t => ({
                    date: t._id,
                    donations: t.donations
                })),
                foodTypes: foodTypes.reduce((acc, type) => {
                    acc[type._id] = type.count;
                    return acc;
                }, {}),
                totalDonations: currentPeriod,
                growthRate: Math.round(growthRate * 100) / 100,
                impactMetrics: {
                    peopleServed: currentPeriod * 3, // Assuming each donation serves 3 people
                    foodWastePrevented: currentPeriod * 2.5 // In kg
                }
            }
        });
    } catch (error) {
        console.error('Error in admin analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin analytics'
        });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    verifyUser,
    updateUserStatus,
    getAllDonations,
    getVerifiedNGOs,
    assignDonation,
    updateDonationStatus,
    getAnalytics,
    getBroadcasts,
    createBroadcast,
    getAdminAnalytics
};