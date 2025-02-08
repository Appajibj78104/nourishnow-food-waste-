const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const { getAnalytics } = require('../controllers/analyticsController');
const { getAdminAnalytics } = require('../controllers/adminController');
const {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryStats,
    getNGOs
} = require('../controllers/adminInventoryController');

// Protect all admin routes
router.use(protect);
router.use(admin);

// Get dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management Routes
router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/verify', adminController.verifyUser);
router.patch('/users/:userId/status', adminController.updateUserStatus);

// Donation Management Routes
router.get('/donations', adminController.getAllDonations);
router.get('/ngos/verified', adminController.getVerifiedNGOs);
router.patch('/donations/:donationId/assign', adminController.assignDonation);
router.patch('/donations/:donationId/status', adminController.updateDonationStatus);

// Analytics Route
router.get('/analytics', getAnalytics);

// Broadcast Routes
router.get('/broadcasts', adminController.getBroadcasts);
router.post('/broadcasts', adminController.createBroadcast);

// Admin Analytics Route
router.get('/dashboard/analytics', getAdminAnalytics);

// Inventory routes
router.get('/inventory', getInventory);
router.post('/inventory', addInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);
router.get('/inventory/stats', getInventoryStats);
router.get('/inventory/ngos', getNGOs);

module.exports = router;