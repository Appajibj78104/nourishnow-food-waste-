const Donation = require('../models/Donation');
<<<<<<< HEAD

const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
=======
const Donor = require('../models/Donor');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const getDonations = async (req, res) => {
    try {
        console.log('Getting donations for user:', req.user._id);
        const donations = await Donation.find({ donor: req.user._id })
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
            .populate('donor', 'name')
            .populate('assignedNGO', 'name');
        res.json(donations);
    } catch (error) {
<<<<<<< HEAD
=======
        console.error('Error getting donations:', error);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        res.status(500).json({ message: error.message });
    }
};

const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('donor', 'name')
            .populate('assignedNGO', 'name');
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDonationStatus = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

<<<<<<< HEAD
module.exports = {
    getDonations,
    getDonationById,
    updateDonationStatus
=======
// Get donations for specific donor
const getDonorDonations = async (req, res) => {
    try {
        console.log('Fetching donations for donor:', req.user._id);
        const donations = await Donation.find({ donor: req.user._id })
            .sort({ createdAt: -1 })
            .populate('assignedNGO', 'name');
        
        console.log('Found donations:', donations.length);
        res.json(donations);
    } catch (error) {
        console.error('Error fetching donor donations:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching donations',
            error: error.message 
        });
    }
};

// Create donation
const createDonation = async (req, res) => {
    try {
        console.log('Creating donation - User:', req.user._id);
        console.log('Request body:', req.body);

        // Validate required fields
        const requiredFields = ['foodType', 'quantity', 'expiryDate', 'pickupTime'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Parse and validate dates
        const expiryDate = new Date(req.body.expiryDate);
        const pickupTime = new Date(req.body.pickupTime);

        if (isNaN(expiryDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid expiry date'
            });
        }

        if (isNaN(pickupTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pickup time'
            });
        }

        const donation = new Donation({
            donor: req.user._id,
            foodType: req.body.foodType,
            quantity: parseInt(req.body.quantity),
            quantityUnit: req.body.quantityUnit || 'servings',
            expiryDate: expiryDate,
            pickupTime: pickupTime,
            description: req.body.description || '',
            status: 'pending',
            location: req.body.location || {}
        });

        const savedDonation = await donation.save();
        console.log('Donation saved successfully:', savedDonation);

        res.status(201).json({
            success: true,
            data: savedDonation
        });
    } catch (error) {
        console.error('Error creating donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating donation',
            error: error.message
        });
    }
};

// Update donation
const updateDonation = async (req, res) => {
    try {
        console.log('Updating donation:', req.params.id);
        console.log('User:', req.user._id);
        console.log('Update data:', req.body);

        // Find donation and check ownership
        const donation = await Donation.findOne({
            _id: req.params.id,
            donor: req.user._id
        });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or you do not have permission to update it'
            });
        }

        // Check if donation is in pending status
        if (donation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending donations can be updated'
            });
        }

        // Update allowed fields
        const allowedUpdates = ['foodType', 'quantity', 'expiryDate', 'pickupTime', 'description'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                donation[field] = req.body[field];
            }
        });

        await donation.save();

        res.json({
            success: true,
            data: donation
        });
    } catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating donation',
            error: error.message
        });
    }
};

// Delete donation
const deleteDonation = async (req, res) => {
    try {
        console.log('Deleting donation:', req.params.id);
        console.log('User:', req.user._id);

        // Find donation and check ownership
        const donation = await Donation.findOne({
            _id: req.params.id,
            donor: req.user._id
        });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found or you do not have permission to delete it'
            });
        }

        // Check if donation is in pending status
        if (donation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending donations can be deleted'
            });
        }

        // Delete the donation
        await donation.deleteOne();

        res.json({
            success: true,
            message: 'Donation deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting donation:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting donation',
            error: error.message
        });
    }
};

// Add this function to your existing controller
const getDonationStats = async (req, res) => {
    try {
        console.log('Getting stats for user:', req.user._id);
        const donations = await Donation.find({ donor: req.user._id });
        
        const stats = {
            total: donations.length,
            pending: donations.filter(d => d.status === 'pending').length,
            completed: donations.filter(d => d.status === 'completed').length,
            impact: donations.reduce((acc, curr) => acc + parseInt(curr.quantity), 0)
        };

        res.json(stats);
    } catch (error) {
        console.error('Error getting donation stats:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching donation statistics'
        });
    }
};

module.exports = {
    getDonations,
    getDonationById,
    updateDonationStatus,
    getDonorDonations,
    createDonation,
    updateDonation,
    deleteDonation,
    getDonationStats
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
};