const Broadcast = require('../models/Broadcast');

// Get broadcasts
const getBroadcasts = async (req, res) => {
    try {
        console.log('Fetching broadcasts for NGO:', req.user._id);
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
        res.json({
            success: true,
            data: broadcasts
        });
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching broadcasts'
        });
    }
};

// Create broadcast
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

        const broadcast = await Broadcast.create({
            title,
            message,
            recipients,
            sender: req.user._id,
            urgency: 'normal'
        });

        // Get all target users for real-time notification
        const io = req.app.get('io');

        // Emit to appropriate rooms based on recipients
        if (recipients === 'all') {
            io.to('admin-broadcasts').to('donor-broadcasts').emit('newBroadcast', {
                broadcast: {
                    ...broadcast.toObject(),
                    sender: {
                        _id: req.user._id,
                        name: req.user.name,
                        role: 'ngo'
                    }
                }
            });
        } else if (recipients === 'donors') {
            io.to('donor-broadcasts').emit('newBroadcast', {
                broadcast: {
                    ...broadcast.toObject(),
                    sender: {
                        _id: req.user._id,
                        name: req.user.name,
                        role: 'ngo'
                    }
                }
            });
        } else if (recipients === 'admin') {
            io.to('admin-broadcasts').emit('newBroadcast', {
                broadcast: {
                    ...broadcast.toObject(),
                    sender: {
                        _id: req.user._id,
                        name: req.user.name,
                        role: 'ngo'
                    }
                }
            });
        }

        res.status(201).json({
            success: true,
            data: broadcast
        });
    } catch (error) {
        console.error('Error creating broadcast:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating broadcast'
        });
    }
};

// Delete a broadcast
const deleteBroadcast = async (req, res) => {
    try {
        const broadcast = await Broadcast.findOneAndDelete({
            _id: req.params.id,
            ngo: req.user._id
        });

        if (!broadcast) {
            return res.status(404).json({
                success: false,
                message: 'Broadcast not found'
            });
        }

        res.json({
            success: true,
            message: 'Broadcast deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting broadcast:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting broadcast',
            error: error.message
        });
    }
};

module.exports = {
    getBroadcasts,
    createBroadcast,
    deleteBroadcast
}; 