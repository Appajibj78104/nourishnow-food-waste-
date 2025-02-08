const User = require('../models/User');
//import NGO from '../models/NGO.js';
const NGO = require('../models/NGO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { uploadToCloudinary } = require('../utils/cloudinary.js');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
dotenv.config();

<<<<<<< HEAD
// Register NGO
 const register = async (req, res) => {
    try {
        const {
            email,
            password,
            name,
            registrationNumber,
            darpanId,
            panNumber,
            phone,
            address,
            servingCapacity,
            operatingAreas,
            establishedYear
        } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
=======
// Register user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

<<<<<<< HEAD
        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

<<<<<<< HEAD
        // Create user
        user = new User({
            email,
            password,
            role: 'ngo'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Handle document uploads
        const documents = {};
        if (req.files) {
            for (const [key, file] of Object.entries(req.files)) {
                const result = await uploadToCloudinary(file.path);
                documents[key] = result.secure_url;
            }
        }

        // Create NGO profile
        const ngo = new NGO({
            user: user._id,
            name,
            registrationNumber,
            darpanId,
            panNumber,
            phone,
            address,
            servingCapacity,
            operatingAreas: operatingAreas.split(',').map(area => area.trim()),
            establishedYear,
            documents
        });

        await ngo.save();
=======
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password hashed during registration');

        // Create user with hashed password
        user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
=======
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user first
        const user = await User.create({
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role
        });

<<<<<<< HEAD
        await user.save();
        console.log('User saved successfully');
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

<<<<<<< HEAD
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                ngoProfile: ngo
=======
        // If user is NGO, create NGO profile
=======
        // If role is NGO, create simple NGO profile
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
        if (role === 'ngo') {
            try {
                await NGO.create({
                    user: user._id,
                    name: name
                });
            } catch (ngoError) {
                // If NGO creation fails, delete the user
                await User.findByIdAndDelete(user._id);
                console.error('NGO creation error:', ngoError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create NGO profile'
                });
            }
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            token,
<<<<<<< HEAD
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
<<<<<<< HEAD
        res.status(500).json({ message: 'Server error', error: error.message });
=======
        res.status(500).json({ 
=======
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // If user was created, clean it up
        if (error.code === 11000) {
            const email = error.keyValue?.email;
            return res.status(400).json({
                success: false,
                message: `Account with email ${email} already exists`
            });
        }

        return res.status(500).json({
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
            success: false,
            message: 'Registration failed'
        });
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    }
};

// Login
<<<<<<< HEAD
<<<<<<< HEAD
 const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Get NGO profile if user is NGO
        let ngoProfile = null;
        if (user.role === 'ngo') {
            ngoProfile = await NGO.findOne({ user: user._id });
        }

        // Generate JWT
=======
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        // Find user with password
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
<<<<<<< HEAD
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                ngoProfile
=======
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
            }
        });

    } catch (error) {
<<<<<<< HEAD
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
=======
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        throw new AppError('Invalid credentials', 401);
    }

    // Check if user is disabled
    if (user.status === 'disabled') {
        throw new AppError('Your account has been disabled. Please contact support.', 403);
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    // Remove password from response
    user.password = undefined;

    res.json({
        success: true,
        token,
        user
    });
});

// Check Auth Status
<<<<<<< HEAD
 const checkAuthStatus = async (req, res) => {
=======
const checkAuthStatus = async (req, res) => {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let ngoProfile = null;
        if (user.role === 'ngo') {
            ngoProfile = await NGO.findOne({ user: user._id });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                ngoProfile
            }
        });

    } catch (error) {
        console.error('Auth Status Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

<<<<<<< HEAD
 const logout = async (req, res) => {
=======
const logout = async (req, res) => {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token found' });
        }

        // Add token to blacklist in database
        await BlacklistedToken.create({ token });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

<<<<<<< HEAD
 const refreshToken = async (req, res) => {
=======
const refreshToken = async (req, res) => {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Get user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generate new refresh token
        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        console.error('Refresh Token Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

<<<<<<< HEAD
 const forgotPassword = async (req, res) => {
=======
const forgotPassword = async (req, res) => {
<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email content
        const message = `
            You are receiving this email because you (or someone else) has requested to reset your password.
            Please click on the following link to reset your password:
            ${resetUrl}
            If you did not request this, please ignore this email.
        `;

        // Send email
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
=======
    // Implement forgot password logic
    res.status(501).json({
        success: false,
        message: 'Not implemented yet'
    });
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
};

<<<<<<< HEAD
 const resetPassword = async (req, res) => {
=======
const resetPassword = async (req, res) => {
<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        const { token, password } = req.body;

        // Find user by reset token and check expiry
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Generate new JWT
        const newToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Password reset successful',
            token: newToken
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
=======
    // Implement reset password logic
    res.status(501).json({
        success: false,
        message: 'Not implemented yet'
    });
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
};

// Add BlacklistedToken model to handle logout
const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60 // Automatically delete after 7 days
    }
});

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

// Add this middleware to check for blacklisted tokens
<<<<<<< HEAD
 const checkTokenBlacklist = async (req, res, next) => {
=======
const checkTokenBlacklist = async (req, res, next) => {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token found' });
        }

        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
<<<<<<< HEAD
 const getMe = async (req, res) => {
=======

// Get current user
const getMe = async (req, res) => {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user data',
            error: error.message
        });
    }
};

<<<<<<< HEAD
// Update user profile
<<<<<<< HEAD
 const updateProfile = async (req, res) => {
=======
=======
// Update profile
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
const updateProfile = async (req, res) => {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
<<<<<<< HEAD
=======

>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
module.exports = { register, login, checkAuthStatus, logout, refreshToken, forgotPassword, resetPassword, checkTokenBlacklist, getMe, updateProfile };
