const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
    registerNGO,
    getDashboardData,
    updateProfile,
    getNearbyDonations,
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getDonations,
    acceptDonation,
    rejectDonation,
    getBroadcasts,
    createBroadcast,
    deleteBroadcast,
    getAnalytics
} = require('../controllers/ngoController');

const router = express.Router();

router.use(protect);

// Registration and Profile
router.post('/register', registerNGO);
router.get('/dashboard', getDashboardData);
router.put('/profile', updateProfile);
router.get('/nearby-donations', getNearbyDonations);

// Inventory Management
router.get('/inventory', getInventory);
router.post('/inventory', addInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);

// Donation Management
router.get('/donations', getDonations);
router.post('/donations/:id/accept', acceptDonation);
router.post('/donations/:id/reject', rejectDonation);

// Broadcasts
router.get('/broadcasts', getBroadcasts);
router.post('/broadcasts', createBroadcast);
router.delete('/broadcasts/:id', deleteBroadcast);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router; 