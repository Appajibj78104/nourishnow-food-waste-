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
const Donation = require('../models/Donation');

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
    .delete(protect, deleteDonation);

router.patch('/:id/status', protect, updateDonationStatus);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)

// Update donation
router.put('/:id', protect, async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donation not found' 
            });
        }

        // Check if user owns this donation
        if (donation.donor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this donation' 
            });
        }

        // Only allow updates if donation is in pending status
        if (donation.status !== 'pending') {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot update donation that is not in pending status' 
            });
        }

        const updatedDonation = await Donation.findByIdAndUpdate(
            req.params.id,
            {
                foodType: req.body.foodType,
                quantity: req.body.quantity,
                quantityUnit: req.body.quantityUnit,
                expiryDate: req.body.expiryDate,
                pickupTime: req.body.pickupTime,
                description: req.body.description
            },
            { new: true }
        );

        res.json({
            success: true,
            data: updatedDonation
        });
    } catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating donation' 
        });
    }
});

module.exports = router;