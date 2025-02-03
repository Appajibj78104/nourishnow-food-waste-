const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    getDonorProfile,
    updateProfile,
    getDonorStats,
    getDonorLeaderboard
} = require('../controllers/donorController');

// Protect all routes
router.use(protect);

// Donor profile routes
router.route('/profile')
    .get(getDonorProfile)
    .put(upload.single('profilePicture'), updateProfile);

// Donor statistics routes
router.get('/stats', getDonorStats);

// Leaderboard route
router.get('/leaderboard', getDonorLeaderboard);

module.exports = router; 