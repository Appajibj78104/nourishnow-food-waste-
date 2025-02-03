const express = require('express');
<<<<<<< HEAD
const { protect } = require('../middleware/authMiddleware');
const {
    getDonations,
    getDonationById,
    updateDonationStatus
} = require('../controllers/donationController');

const router = express.Router();

router.use(protect);

router.get('/', getDonations);
router.get('/:id', getDonationById);
router.patch('/:id/status', updateDonationStatus);
=======
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/fileMiddleware');
const {
    getDonations,
    getDonationById,
    createDonation,
    updateDonation,
    deleteDonation,
    updateDonationStatus,
    getDonationStats,
    getDonorDonations
} = require('../controllers/donationController');

// Test auth route (place this first)
router.get('/test-auth', protect, (req, res) => {
    res.json({
        success: true,
        message: 'Authentication working',
        user: req.user
    });
});

// Get all donations for the logged-in donor
router.get('/my-donations', protect, getDonorDonations);

// Stats route
router.get('/stats', protect, getDonationStats);

// Other routes
router.route('/')
    .get(protect, getDonations)
    .post(protect, upload.array('images', 5), createDonation);

router.route('/:id')
    .get(protect, getDonationById)
    .put(protect, updateDonation)
    .delete(protect, deleteDonation);

router.patch('/:id/status', protect, updateDonationStatus);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)

module.exports = router;