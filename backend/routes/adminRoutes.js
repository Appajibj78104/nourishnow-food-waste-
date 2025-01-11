const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { 
    getDashboardStats,
    getRecentActivity,
    getUsers,
    getUserDetails,
    updateUserStatus,
    getNGOVerificationRequests,
    verifyNGO,
    getDonationStats,
    getActiveDonations,
    getCompletedDonations,
    getDonationDetails,
    getAnalytics,
    updateSystemSettings,
    getFeedback,
    getFeedbackDetails,
    getContent,
    updateContent,
    createContent,
    addContent
} = require('../controllers/adminController');

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-activity', getRecentActivity);

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/status', updateUserStatus);

// NGO Management
router.get('/ngo/verification-requests', getNGOVerificationRequests);
router.patch('/ngo/:id/verify', verifyNGO);

// Donation Management
router.get('/donations/stats', getDonationStats);
router.get('/donations/active', getActiveDonations);
router.get('/donations/completed', getCompletedDonations);
router.get('/donations/:id', getDonationDetails);

// Analytics
router.get('/analytics', getAnalytics);

// Settings
router.patch('/settings', updateSystemSettings);

// Feedback
router.get('/feedback', getFeedback);
router.get('/feedback/:id', getFeedbackDetails);

// Content
router.get('/content', getContent);
router.post('/content', addContent);
// router.patch('/content/:id', updateContent); // TODO: Add this route when we have a content management system    

module.exports = router; 