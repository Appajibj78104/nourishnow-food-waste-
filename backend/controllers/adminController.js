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

// Dashboard Stats
exports.getDashboardStats = catchAsync(async (req, res) => {
    const stats = {
        users: await User.countDocuments(),
        activeUsers: await User.countDocuments({ status: 'active' }),
        ngos: await NGO.countDocuments({ verificationStatus: 'verified' }),
        pendingVerifications: await NGO.countDocuments({ verificationStatus: 'pending' }),
        totalDonations: await Donation.countDocuments(),
        activeDonations: await Donation.countDocuments({ status: 'active' }),
        completedDonations: await Donation.countDocuments({ status: 'completed' })
    };

    res.status(200).json(stats);
});

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
    const timeRange = req.query.timeRange || 'month';
    let dateFilter = {};

    switch (timeRange) {
        case 'week':
            dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
            break;
        case 'month':
            dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
            break;
        case 'year':
            dateFilter = { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
            break;
    }

    const [donationStats, userStats, ngoStats] = await Promise.all([
        Donation.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]),
        User.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]),
        NGO.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$verificationStatus',
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    res.status(200).json({
        donationStats,
        userStats,
        ngoStats
    });
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