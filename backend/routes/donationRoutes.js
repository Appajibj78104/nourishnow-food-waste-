const express = require('express');
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

module.exports = router;