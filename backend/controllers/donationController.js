const Donation = require('../models/Donation');

const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate('donor', 'name')
            .populate('assignedNGO', 'name');
        res.json(donations);
    } catch (error) {
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

module.exports = {
    getDonations,
    getDonationById,
    updateDonationStatus
};