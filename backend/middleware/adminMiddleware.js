const AppError = require('../utils/appError');
const Settings = require('../models/Settings');
const catchAsync = require('../utils/catchAsync');

exports.checkMaintenanceMode = catchAsync(async (req, res, next) => {
    const settings = await Settings.findOne();
    if (settings?.systemMaintenanceMode && req.user.role !== 'admin') {
        throw new AppError('System is under maintenance. Please try again later.', 503);
    }
    next();
});

exports.validateSettingsUpdate = (req, res, next) => {
    const { donationExpiryHours, maxDonationDistance, minimumDonationQuantity } = req.body;

    if (donationExpiryHours && (donationExpiryHours < 1 || donationExpiryHours > 72)) {
        throw new AppError('Donation expiry hours must be between 1 and 72', 400);
    }

    if (maxDonationDistance && (maxDonationDistance < 1 || maxDonationDistance > 100)) {
        throw new AppError('Maximum donation distance must be between 1 and 100 km', 400);
    }

    if (minimumDonationQuantity && minimumDonationQuantity < 1) {
        throw new AppError('Minimum donation quantity must be at least 1', 400);
    }

    next();
};

exports.validateContentUpdate = (req, res, next) => {
    const { type, title, content } = req.body;

    if (!title || title.trim().length < 3) {
        throw new AppError('Title must be at least 3 characters long', 400);
    }

    if (!content || content.trim().length < 10) {
        throw new AppError('Content must be at least 10 characters long', 400);
    }

    if (type && !['faq', 'announcement', 'policy'].includes(type)) {
        throw new AppError('Invalid content type', 400);
    }

    next();
};

exports.logAdminAction = (req, res, next) => {
    console.log(`Admin Action: ${req.user.email} - ${req.method} ${req.originalUrl}`);
    next();
}; 