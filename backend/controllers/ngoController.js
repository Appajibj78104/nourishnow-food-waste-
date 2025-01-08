const NGO = require('../models/NGO');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Broadcast = require('../models/Broadcast');

// Register NGO
const registerNGO = async (req, res) => {
    try {
        const ngo = await NGO.create({
            user: req.user.id,
            ...req.body
        });
        res.status(201).json(ngo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Donations
const getDonations = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const donations = await Donation.find({ assignedNGO: ngo._id })
            .populate('donor', 'name email')
            .sort('-createdAt');

        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Dashboard Data
const getDashboardData = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const stats = {
            totalDonations: await Donation.countDocuments({ assignedNGO: ngo._id }),
            pendingDonations: await Donation.countDocuments({ assignedNGO: ngo._id, status: 'pending' }),
            completedDonations: await Donation.countDocuments({ assignedNGO: ngo._id, status: 'completed' })
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const ngo = await NGO.findOneAndUpdate(
            { user: req.user.id },
            req.body,
            { new: true }
        );
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        res.json(ngo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Nearby Donations
const getNearbyDonations = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const donations = await Donation.find({
            status: 'pending',
            assignedNGO: null
        }).populate('donor', 'name email');

        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Accept Donation
const acceptDonation = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            {
                status: 'accepted',
                assignedNGO: ngo._id
            },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reject Donation
const rejectDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            {
                status: 'pending',
                assignedNGO: null
            },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Broadcasts
const getBroadcasts = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const broadcasts = await Broadcast.find({ ngo: ngo._id })
            .sort('-createdAt');

        res.json(broadcasts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create Broadcast
const createBroadcast = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const broadcast = await Broadcast.create({
            ngo: ngo._id,
            ...req.body,
            expiresAt: req.body.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24 hours
        });

        res.status(201).json(broadcast);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Broadcast
const deleteBroadcast = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const broadcast = await Broadcast.findOneAndDelete({
            _id: req.params.id,
            ngo: ngo._id
        });

        if (!broadcast) {
            return res.status(404).json({ message: 'Broadcast not found' });
        }

        res.json({ message: 'Broadcast deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Inventory
const getInventory = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        res.json(ngo.inventory || []);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add Inventory Item
const addInventoryItem = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        ngo.inventory = ngo.inventory || [];
        ngo.inventory.push(req.body);
        await ngo.save();
        res.status(201).json(ngo.inventory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Inventory Item
const updateInventoryItem = async (req, res) => {
    try {
        const ngo = await NGO.findOneAndUpdate(
            { user: req.user.id, 'inventory._id': req.params.id },
            { $set: { 'inventory.$': req.body } },
            { new: true }
        );
        if (!ngo) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(ngo.inventory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Inventory Item
const deleteInventoryItem = async (req, res) => {
    try {
        const ngo = await NGO.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { inventory: { _id: req.params.id } } },
            { new: true }
        );
        if (!ngo) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(ngo.inventory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Analytics
const getAnalytics = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user: req.user.id });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }
        res.json(ngo.stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
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
};
