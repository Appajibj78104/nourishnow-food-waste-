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
        let token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            console.log('No token or invalid token format:', token);
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Remove Bearer from string
        token = token.split(' ')[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decoded successfully:', decoded);
            
            // Get user from token
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
                console.log('User not found for token:', decoded.userId);
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Add user to request
            req.user = user;
            next();
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
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

module.exports = { protect, restrictTo };
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
