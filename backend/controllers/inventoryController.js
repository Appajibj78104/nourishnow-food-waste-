const Inventory = require('../models/Inventory');

// Get all inventory items for an NGO
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({ ngo: req.user._id });
        res.json({
            success: true,
            data: inventory
        });
    } catch (error) {
        console.error('Error in getInventory:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory',
            error: error.message
        });
    }
};

// Add new inventory item
const addInventoryItem = async (req, res) => {
    try {
        const newItem = new Inventory({
            ...req.body,
            ngo: req.user._id
        });
        await newItem.save();
        res.status(201).json({
            success: true,
            data: newItem
        });
    } catch (error) {
        console.error('Error in addInventoryItem:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding inventory item',
            error: error.message
        });
    }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
    try {
        const updatedItem = await Inventory.findOneAndUpdate(
            { _id: req.params.id, ngo: req.user._id },
            req.body,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            data: updatedItem
        });
    } catch (error) {
        console.error('Error in updateInventoryItem:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating inventory item',
            error: error.message
        });
    }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
    try {
        const deletedItem = await Inventory.findOneAndDelete({
            _id: req.params.id,
            ngo: req.user._id
        });

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteInventoryItem:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting inventory item',
            error: error.message
        });
    }
};

module.exports = {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
};