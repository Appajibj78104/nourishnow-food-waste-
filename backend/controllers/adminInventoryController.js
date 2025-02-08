const AdminInventory = require('../models/AdminInventory');
const NGO = require('../models/NGO');
const Inventory = require('../models/Inventory'); // NGO's inventory model

// Get all inventory items including NGO inventories
const getInventory = async (req, res) => {
    try {
        // Get admin inventory
        const adminInventory = await AdminInventory.find()
            .populate('assignedNGO', 'name')
            .sort({ createdAt: -1 });

        // Get NGO inventories with populated NGO data
        const ngoInventories = await Inventory.find()
            .populate('ngo', 'name email')
            .sort({ createdAt: -1 });

        // Format NGO inventories to match admin inventory structure
        const formattedNGOInventories = ngoInventories.map(item => ({
            _id: item._id,
            foodType: item.foodType,
            quantity: item.quantity,
            unit: item.unit,
            storageLocation: item.storageLocation,
            expiryDate: item.expiryDate,
            status: item.status,
            isNGOInventory: true,
            ngoName: item.ngo?.name || 'Unknown NGO',
            ngoEmail: item.ngo?.email
        }));

        res.json({
            success: true,
            data: {
                adminInventory,
                ngoInventories: formattedNGOInventories
            }
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory'
        });
    }
};

// Add new inventory item with optional NGO assignment
const addInventoryItem = async (req, res) => {
    try {
        const { assignedNGOId, ...itemData } = req.body;
        
        const newItem = await AdminInventory.create({
            ...itemData,
            assignedNGO: assignedNGOId || null
        });

        const populatedItem = await AdminInventory.findById(newItem._id)
            .populate('assignedNGO', 'name');

        res.status(201).json({
            success: true,
            data: populatedItem
        });
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding inventory item'
        });
    }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
    try {
        const updatedItem = await AdminInventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        res.json({
            success: true,
            data: updatedItem
        });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating inventory item'
        });
    }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
    try {
        const item = await AdminInventory.findByIdAndDelete(req.params.id);
        
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

// Get inventory statistics
const getInventoryStats = async (req, res) => {
    try {
        const totalItems = await AdminInventory.countDocuments();
        const expiringItems = await AdminInventory.countDocuments({ status: 'expiring_soon' });
        const expiredItems = await AdminInventory.countDocuments({ status: 'expired' });
        
        const itemsByType = await AdminInventory.aggregate([
            {
                $group: {
                    _id: '$foodType',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalItems,
                expiringItems,
                expiredItems,
                itemsByType
            }
        });
    } catch (error) {
        console.error('Error fetching inventory stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory statistics'
        });
    }
};

// Get all NGOs for assignment
const getNGOs = async (req, res) => {
    try {
        const ngos = await NGO.find({ status: 'verified' })
            .select('_id name');
        
        res.json({
            success: true,
            data: ngos
        });
    } catch (error) {
        console.error('Error fetching NGOs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching NGOs'
        });
    }
};

module.exports = {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryStats,
    getNGOs
}; 