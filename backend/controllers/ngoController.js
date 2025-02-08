const NGO = require('../models/NGO');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Broadcast = require('../models/Broadcast');
const Inventory = require('../models/Inventory');

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
        const { id } = req.params;
        const ngoId = req.user._id;

        // Find and update the donation
        const donation = await Donation.findOneAndUpdate(
            { _id: id, status: 'pending' },
            {
                $set: {
                    status: 'accepted',
                    assignedNGO: ngoId
                }
            },
            { new: true }
        ).populate('donor', 'name email phone');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or cannot be accepted'
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
            message: 'Error accepting donation',
            error: error.message
        });
    }
};

// Reject Donation
const rejectDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Find and update the donation
        const donation = await Donation.findOneAndUpdate(
            { _id: id, status: 'pending' },
            {
                $set: {
                    status: 'rejected',
                    rejectionReason: reason,
                    assignedNGO: null
                }
            },
            { new: true }
        ).populate('donor', 'name email phone');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or cannot be rejected'
            });
        }

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        console.error('Error rejecting donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting donation',
            error: error.message
        });
    }
};

// Get Broadcasts
const getBroadcasts = async (req, res) => {
    try {
        console.log('Fetching broadcasts for NGO:', req.user._id);
        // Find broadcasts where NGO is sender OR where NGO is in recipients
        const broadcasts = await Broadcast.find({
            $or: [
                { sender: req.user._id },
                { recipients: { $in: ['all', 'ngos'] } }
            ]
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'name role')
        .lean();

        console.log('Found broadcasts:', broadcasts.length);

        // Add default values for missing fields
        const processedBroadcasts = broadcasts.map(broadcast => ({
            ...broadcast,
            sender: broadcast.sender || {
                _id: null,
                name: 'Unknown User',
                role: 'unknown'
            }
        }));

        res.json({
            success: true,
            data: processedBroadcasts
        });
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching broadcasts'
        });
    }
};

// Create Broadcast
const createBroadcast = async (req, res) => {
    try {
        const { title, message, recipients } = req.body;

        // Validate recipients
        if (!['all', 'donors', 'admin'].includes(recipients)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid recipient type'
            });
        }

        // Create broadcast with sender information
        const broadcast = await Broadcast.create({
            title,
            message,
            recipients,
            sender: req.user._id,
            urgency: 'normal'
        });

        // Populate sender information for the response
        const populatedBroadcast = await Broadcast.findById(broadcast._id)
            .populate('sender', 'name role')
            .lean();

        // Get the io instance
        const io = req.app.get('io');

        // Prepare broadcast data for socket emission
        const broadcastData = {
            ...populatedBroadcast,
            sender: {
                _id: req.user._id,
                name: req.user.name,
                role: 'ngo'
            }
        };

        // Emit to appropriate rooms based on recipients
        if (recipients === 'all') {
            io.to('admin-broadcasts').to('donor-broadcasts').emit('newBroadcast', {
                broadcast: broadcastData
            });
        } else if (recipients === 'donors') {
            io.to('donor-broadcasts').emit('newBroadcast', {
                broadcast: broadcastData
            });
        } else if (recipients === 'admin') {
            io.to('admin-broadcasts').emit('newBroadcast', {
                broadcast: broadcastData
            });
        }

        res.status(201).json({
            success: true,
            data: populatedBroadcast
        });
    } catch (error) {
        console.error('Error creating broadcast:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating broadcast'
        });
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
        const ngoId = req.user._id;
        const inventory = await Inventory.find({ ngo: ngoId })
            .sort({ createdAt: -1 });

        // Update status for each item based on expiry date
        const updatedInventory = inventory.map(item => {
            const now = new Date();
            const daysUntilExpiry = Math.ceil((item.expiryDate - now) / (1000 * 60 * 60 * 24));
            
            let status = 'good';
            if (daysUntilExpiry <= 0) {
                status = 'expired';
            } else if (daysUntilExpiry <= 3) {
                status = 'expiring_soon';
            }

            if (status !== item.status) {
                item.status = status;
                item.save();
            }

            return item;
        });

        res.json({
            success: true,
            data: updatedInventory
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory'
        });
    }
};

// Add Inventory Item
const addInventoryItem = async (req, res) => {
    try {
        const ngoId = req.user._id;
        
        // Validate required fields
        const { foodType, quantity, unit, storageLocation, expiryDate, temperature } = req.body;
        
        if (!foodType || !quantity || !unit || !storageLocation || !expiryDate || !temperature) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const itemData = {
            foodType,
            quantity: Number(quantity),
            unit,
            storageLocation,
            expiryDate: new Date(expiryDate),
            temperature: Number(temperature),
            notes: req.body.notes || '',
            ngo: ngoId,
            status: 'good' // Default status
        };

        // Calculate status based on expiry date
        const now = new Date();
        const daysUntilExpiry = Math.ceil((itemData.expiryDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) {
            itemData.status = 'expired';
        } else if (daysUntilExpiry <= 3) {
            itemData.status = 'expiring_soon';
        }

        const newItem = await Inventory.create(itemData);

        res.status(201).json({
            success: true,
            data: newItem
        });
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error adding inventory item'
        });
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
        const ngoId = req.user._id;
        const itemId = req.params.id;

        const item = await Inventory.findOneAndDelete({
            _id: itemId,
            ngo: ngoId
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        res.json({
            success: true,
            message: 'Inventory item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting inventory item'
        });
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

// Get NGO Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const ngoId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all donations assigned to this NGO
        const donations = await Donation.find({ assignedNGO: ngoId });

        // Calculate statistics
        const stats = {
            totalDonations: donations.length,
            peopleServed: donations.reduce((acc, curr) => {
                return acc + (curr.status === 'completed' ? curr.quantity * 2 : 0); // Assuming each quantity serves 2 people
            }, 0),
            activePickups: donations.filter(d => d.status === 'pickup_in_progress').length,
            successRate: donations.length > 0 
                ? ((donations.filter(d => d.status === 'completed').length / donations.length) * 100).toFixed(1)
                : 0,
            pendingPickups: donations.filter(d => d.status === 'pending').length,
            activeDeliveries: donations.filter(d => d.status === 'in_transit').length,
            completedToday: donations.filter(d => 
                d.status === 'completed' && 
                new Date(d.updatedAt).setHours(0,0,0,0) === today.getTime()
            ).length
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting NGO stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

// Get Available Donations
const getAvailableDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            status: 'pending',
            assignedNGO: null
        }).populate('donor', 'name');

        res.json({
            success: true,
            data: donations
        });
    } catch (error) {
        console.error('Error getting available donations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching available donations',
            error: error.message
        });
    }
};

// Get Volunteers
const getVolunteers = async (req, res) => {
    try {
        const ngoId = req.user._id;
        const volunteers = await User.find({ 
            role: 'volunteer',
            assignedNGO: ngoId 
        }).select('-password');

        res.json({
            success: true,
            data: volunteers
        });
    } catch (error) {
        console.error('Error getting volunteers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching volunteers',
            error: error.message
        });
    }
};

// Function to check if donation exists
const checkDonationExists = async (donationId) => {
    const donation = await Donation.findById(donationId);
    return donation !== null; // Returns true if exists, false otherwise
};

// Example usage in your update function
const updateDonationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Check if donation exists
    const exists = await checkDonationExists(id);
    if (!exists) {
        return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Proceed with updating the donation status
    try {
        const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true });
        res.json({ success: true, data: donation });
    } catch (error) {
        console.error('Error updating donation status:', error);
        res.status(500).json({ success: false, message: 'Error updating donation status' });
    }
};

// Get NGO Analytics
const getNGOAnalytics = async (req, res) => {
    try {
        const timeframe = req.query.timeframe || 'week';
        const ngoId = req.user._id;

        // Calculate date range
        const now = new Date();
        let startDate;
        switch (timeframe) {
            case 'week':
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        }

        // Get donations for this NGO
        const donations = await Donation.find({
            assignedNGO: ngoId,
            createdAt: { $gte: startDate }
        }).populate('donor', 'name');

        // Calculate statistics
        const totalDonations = donations.length;
        const acceptedDonations = donations.filter(d => d.status === 'accepted').length;
        const completedDonations = donations.filter(d => d.status === 'completed').length;
        const pendingDonations = donations.filter(d => d.status === 'pending').length;

        // Calculate food categories
        const foodCategories = donations.reduce((acc, donation) => {
            acc[donation.foodType] = (acc[donation.foodType] || 0) + 1;
            return acc;
        }, {});

        // Calculate daily donation counts
        const dailyDonations = donations.reduce((acc, donation) => {
            const date = donation.createdAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                overview: {
                    totalDonations,
                    acceptedDonations,
                    completedDonations,
                    pendingDonations
                },
                foodCategories,
                dailyDonations,
                recentDonations: donations.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Error fetching NGO analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics'
        });
    }
};

// Get NGO Stats
const getNGOStats = async (req, res) => {
    try {
        const ngoId = req.user._id;
        
        // Get basic stats for the NGO
        const stats = await Donation.aggregate([
            {
                $match: { assignedNGO: ngoId }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching NGO stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching NGO stats'
        });
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
    getAnalytics,
    getDashboardStats,
    getAvailableDonations,
    getVolunteers,
    updateDonationStatus,
    getNGOAnalytics,
    getNGOStats
};
