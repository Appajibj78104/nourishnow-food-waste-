const express = require('express');
const router = express.Router();
const { protect, ngo } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/fileMiddleware');
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
    getAnalytics,
    getDashboardStats,
    getAvailableDonations,
    getVolunteers,
    updateDonationStatus,
    getNGOAnalytics,
    getNGOStats
} = require('../controllers/ngoController');
const Donation = require('../models/Donation');
const User = require('../models/User');
const {
    getInventory: getInventoryController,
    addInventoryItem: addInventoryItemController,
    updateInventoryItem: updateInventoryItemController,
    deleteInventoryItem: deleteInventoryItemController
} = require('../controllers/inventoryController');
const {
    getBroadcasts: getBroadcastsController,
    createBroadcast: createBroadcastController,
    deleteBroadcast: deleteBroadcastController
} = require('../controllers/broadcastController');

// Protect all NGO routes
router.use(protect);
router.use(ngo);

// Dashboard and Profile
router.get('/dashboard', getDashboardData);
router.get('/dashboard-stats', getDashboardStats);
router.put('/profile', upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'bankDetails', maxCount: 1 }
]), updateProfile);

// Donations
router.get('/donations', protect, ngo, async (req, res) => {
    try {
        const ngoId = req.user._id;
        const donations = await Donation.find({
            $or: [
                { assignedNGO: ngoId },
                { status: 'pending', assignedNGO: null }
            ]
        }).populate({
            path: 'donor',
            select: 'name email phone'
        }).sort('-createdAt');

        res.json({
            success: true,
            data: donations
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching donations',
            error: error.message
        });
    }
});
router.get('/nearby-donations', getNearbyDonations);
router.post('/donations/:id/accept', protect, ngo, async (req, res) => {
    try {
        const donation = await Donation.findOneAndUpdate(
            { _id: req.params.id, status: 'pending' },
            { 
                status: 'accepted',
                assignedNGO: req.user._id
            },
            { new: true }
        ).populate('donor', 'name email phone');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or already accepted'
            });
        }

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        console.error('Error accepting donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting donation'
        });
    }
});
router.post('/donations/:id/reject', rejectDonation);

// Inventory
router.get('/inventory', getInventory);
router.post('/inventory', addInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);

// Broadcasts
router.get('/broadcasts', protect, getBroadcasts);
router.post('/broadcasts', protect, createBroadcast);
router.delete('/broadcasts/:id', deleteBroadcast);

// Analytics
router.get('/dashboard/analytics', getNGOAnalytics);
router.get('/stats', getNGOStats);

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/volunteers', getVolunteers);
router.get('/available-donations', getAvailableDonations);

// Assign volunteer to donation
router.post('/donations/:id/assign-volunteer', protect, ngo, async (req, res) => {
    try {
        const { volunteerName } = req.body;
        
        if (!volunteerName) {
            return res.status(400).json({
                success: false,
                message: 'Volunteer name is required'
            });
        }

        const donation = await Donation.findOne({ 
            _id: req.params.id,
            assignedNGO: req.user._id,
            status: 'accepted'
        });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or cannot be assigned'
            });
        }

        donation.assignedVolunteer = {
            name: volunteerName,
            assignedAt: new Date()
        };
        donation.status = 'assigned';
        
        await donation.save();
        await donation.populate('donor', 'name email phone');

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        console.error('Error assigning volunteer:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning volunteer'
        });
    }
});

// Get active donations/pickups
router.get('/donations/active', protect, ngo, async (req, res) => {
    try {
        const ngoId = req.user._id;
        const donations = await Donation.find({
            assignedNGO: ngoId,
            status: { $in: ['accepted', 'assigned'] },  // Only get accepted and assigned donations
            // Explicitly exclude completed donations
            $or: [
                { status: { $ne: 'completed' } },
                { status: { $exists: false } }
            ]
        })
        .populate('donor', 'name email phone')
        .sort('-createdAt');

        res.json({
            success: true,
            data: donations
        });
    } catch (error) {
        console.error('Error fetching active donations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching active donations'
        });
    }
});

// Complete donation
router.post('/donations/:id/complete', protect, ngo, async (req, res) => {
    try {
        const donation = await Donation.findOneAndUpdate(
            { 
                _id: req.params.id,
                assignedNGO: req.user._id,
                status: 'assigned'
            },
            { 
                status: 'completed',
                completionDetails: {
                    completedAt: new Date(),
                    completedBy: req.user._id
                }
            },
            { new: true }
        ).populate('donor', 'name email phone');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or cannot be completed'
            });
        }

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        io.to(`ngo:${donation.assignedNGO}`).emit('donationStatusUpdated', {
            donationId: donation._id,
            status: donation.status
        });

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        console.error('Error completing donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing donation'
        });
    }
});

module.exports = router;