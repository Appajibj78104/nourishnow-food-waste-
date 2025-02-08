const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const User = require('../models/User.js');

 const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

 const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Not authorized to access this route' 
            });
=======
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Protect routes - Authentication
const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }

        // Check if user is disabled (except for admin)
        if (req.user.status === 'disabled' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been disabled. Please contact support.'
            });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

// Restrict to certain roles - Authorization
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ['admin', 'lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        }
        next();
    };
};
<<<<<<< HEAD
module.exports = { protect, authorize };
=======

<<<<<<< HEAD
module.exports = { protect, restrictTo };
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as admin'
        });
    }
};

// Add this middleware for donor-specific routes
const donor = (req, res, next) => {
    if (req.user && req.user.role === 'donor') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as donor'
        });
    }
};

const ngo = (req, res, next) => {
    if (req.user && req.user.role === 'ngo') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as NGO'
        });
    }
};

module.exports = { protect, restrictTo, admin, donor, ngo };
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
