import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { addInventoryItem, updateInventoryItem } from '../../../services/ngoService';
import { toast } from 'react-toastify';

const InventoryForm = ({ item, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        itemName: '',
        quantity: '',
        unit: '',
        category: '',
        expiryDate: '',
        storageLocation: '',
        minimumQuantity: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                itemName: item.itemName || '',
                quantity: item.quantity || '',
                unit: item.unit || '',
                category: item.category || '',
                expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
                storageLocation: item.storageLocation || '',
                minimumQuantity: item.minimumQuantity || ''
            });
        }
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (item) {
                await updateInventoryItem(item._id, formData);
                toast.success('Item updated successfully');
            } else {
                await addInventoryItem(formData);
                toast.success('Item added successfully');
            }
            onSubmit();
        } catch (error) {
            toast.error(item ? 'Failed to update item' : 'Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        'Dry Goods',
        'Fresh Produce',
        'Dairy',
        'Meat',
        'Beverages',
        'Others'
    ];

    const units = [
        'kg',
        'liters',
        'pieces',
        'packets',
        'boxes'
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gray-800 rounded-2xl p-6 w-full max-w-md relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>

                <h2 className="text-xl font-bold text-white mb-6">
                    {item ? 'Edit Item' : 'Add New Item'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Item Name
                        </label>
                        <input
                            type="text"
                            value={formData.itemName}
                            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Unit
                            </label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                                required
                            >
                                <option value="">Select Unit</option>
                                {units.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Storage Location
                        </label>
                        <input
                            type="text"
                            value={formData.storageLocation}
                            onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Minimum Quantity Alert
                        </label>
                        <input
                            type="number"
                            value={formData.minimumQuantity}
                            onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : item ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default InventoryForm; 