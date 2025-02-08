import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import adminInventoryService from '../../services/adminInventoryService';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [ngos, setNGOs] = useState([]);
    const [showNGOInventories, setShowNGOInventories] = useState(false);
    const [newItem, setNewItem] = useState({
        foodType: '',
        quantity: 0,
        unit: 'kg',
        storageLocation: '',
        expiryDate: '',
        temperature: 0,
        notes: '',
        assignedNGOId: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchInventory();
        fetchStats();
        fetchNGOs();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await adminInventoryService.getInventory();
            if (response.success) {
                setInventory(response.data);
            } else {
                toast.error('Failed to fetch inventory');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminInventoryService.getInventoryStats();
            setStats(response.data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchNGOs = async () => {
        try {
            const response = await adminInventoryService.getNGOs();
            if (response.success) {
                setNGOs(response.data);
            } else {
                toast.error('Failed to fetch NGOs');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!newItem.foodType.trim()) {
            errors.foodType = 'Food type is required';
        }
        if (!newItem.quantity || newItem.quantity <= 0) {
            errors.quantity = 'Valid quantity is required';
        }
        if (!newItem.storageLocation.trim()) {
            errors.storageLocation = 'Storage location is required';
        }
        if (!newItem.expiryDate) {
            errors.expiryDate = 'Expiry date is required';
        }
        if (!newItem.temperature) {
            errors.temperature = 'Temperature is required';
        }
        return errors;
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const formattedItem = {
                ...newItem,
                quantity: Number(newItem.quantity),
                temperature: Number(newItem.temperature),
                assignedNGO: newItem.assignedNGOId || null
            };

            const response = await adminInventoryService.addInventoryItem(formattedItem);
            
            if (response.success) {
                toast.success('Item added successfully');
                setShowAddModal(false);
                setNewItem({
                    foodType: '',
                    quantity: 0,
                    unit: 'kg',
                    storageLocation: '',
                    expiryDate: '',
                    temperature: 0,
                    notes: '',
                    assignedNGOId: ''
                });
                fetchInventory();
                fetchStats();
            } else {
                toast.error(response.message || 'Failed to add item');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to add item');
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await adminInventoryService.deleteInventoryItem(id);
                toast.success('Item deleted successfully');
                fetchInventory();
                fetchStats();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
                <p className="text-gray-400 mt-2">Monitor and manage food storage</p>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h3 className="text-gray-400">Total Items</h3>
                        <p className="text-2xl font-bold text-white mt-2">{stats.totalItems}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h3 className="text-gray-400">Expiring Soon</h3>
                        <p className="text-2xl font-bold text-yellow-500 mt-2">{stats.expiringItems}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h3 className="text-gray-400">Expired Items</h3>
                        <p className="text-2xl font-bold text-red-500 mt-2">{stats.expiredItems}</p>
                    </motion.div>
                </div>
            )}

            {/* Toggle View */}
            <div className="mb-6 flex justify-between items-center">
                <button
                    onClick={() => setShowNGOInventories(!showNGOInventories)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                >
                    {showNGOInventories ? 'Show Admin Inventory' : 'Show NGO Inventories'}
                </button>

                {!showNGOInventories && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add New Item
                    </button>
                )}
            </div>

            {/* Inventory Table */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left">Food Type</th>
                            <th className="px-6 py-3 text-left">Quantity</th>
                            <th className="px-6 py-3 text-left">Location</th>
                            <th className="px-6 py-3 text-left">
                                {showNGOInventories ? 'NGO Name' : 'Assigned NGO'}
                            </th>
                            <th className="px-6 py-3 text-left">Expiry Date</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            {!showNGOInventories && (
                                <th className="px-6 py-3 text-left">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {inventory && (showNGOInventories ? 
                            inventory.ngoInventories : 
                            inventory.adminInventory
                        )?.map((item) => (
                            <tr key={item._id} className="border-t border-gray-700">
                                <td className="px-6 py-4">{item.foodType}</td>
                                <td className="px-6 py-4">{item.quantity} {item.unit}</td>
                                <td className="px-6 py-4">{item.storageLocation}</td>
                                <td className="px-6 py-4">
                                    {showNGOInventories ? (
                                        <div>
                                            <p>{item.ngoName}</p>
                                            <p className="text-sm text-gray-400">{item.ngoEmail}</p>
                                        </div>
                                    ) : (
                                        item.assignedNGO?.name || 'None'
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(item.expiryDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        item.status === 'good' ? 'bg-green-500/10 text-green-500' :
                                        item.status === 'expiring_soon' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-red-500/10 text-red-500'
                                    }`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </td>
                                {!showNGOInventories && (
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteItem(item._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Item</h2>
                        <form onSubmit={handleAddItem}>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Food Type"
                                        className={`w-full px-4 py-2 bg-gray-700 rounded-lg text-white ${
                                            formErrors.foodType ? 'border border-red-500' : ''
                                        }`}
                                        value={newItem.foodType}
                                        onChange={(e) => {
                                            setNewItem({ ...newItem, foodType: e.target.value });
                                            setFormErrors({ ...formErrors, foodType: '' });
                                        }}
                                    />
                                    {formErrors.foodType && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.foodType}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            className={`w-full px-4 py-2 bg-gray-700 rounded-lg text-white ${
                                                formErrors.quantity ? 'border border-red-500' : ''
                                            }`}
                                            value={newItem.quantity}
                                            onChange={(e) => {
                                                setNewItem({ ...newItem, quantity: e.target.value });
                                                setFormErrors({ ...formErrors, quantity: '' });
                                            }}
                                        />
                                        {formErrors.quantity && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>
                                        )}
                                    </div>
                                    <select
                                        className="w-1/2 px-4 py-2 bg-gray-700 rounded-lg text-white"
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="liters">liters</option>
                                        <option value="pieces">pieces</option>
                                    </select>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Storage Location"
                                        className={`w-full px-4 py-2 bg-gray-700 rounded-lg text-white ${
                                            formErrors.storageLocation ? 'border border-red-500' : ''
                                        }`}
                                        value={newItem.storageLocation}
                                        onChange={(e) => {
                                            setNewItem({ ...newItem, storageLocation: e.target.value });
                                            setFormErrors({ ...formErrors, storageLocation: '' });
                                        }}
                                    />
                                    {formErrors.storageLocation && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.storageLocation}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="date"
                                        className={`w-full px-4 py-2 bg-gray-700 rounded-lg text-white ${
                                            formErrors.expiryDate ? 'border border-red-500' : ''
                                        }`}
                                        value={newItem.expiryDate}
                                        onChange={(e) => {
                                            setNewItem({ ...newItem, expiryDate: e.target.value });
                                            setFormErrors({ ...formErrors, expiryDate: '' });
                                        }}
                                    />
                                    {formErrors.expiryDate && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        placeholder="Temperature (°C)"
                                        className={`w-full px-4 py-2 bg-gray-700 rounded-lg text-white ${
                                            formErrors.temperature ? 'border border-red-500' : ''
                                        }`}
                                        value={newItem.temperature}
                                        onChange={(e) => {
                                            setNewItem({ ...newItem, temperature: e.target.value });
                                            setFormErrors({ ...formErrors, temperature: '' });
                                        }}
                                    />
                                    {formErrors.temperature && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.temperature}</p>
                                    )}
                                </div>

                                <textarea
                                    placeholder="Notes (Optional)"
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                                    value={newItem.notes}
                                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                                />

                                <select
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                                    value={newItem.assignedNGOId}
                                    onChange={(e) => setNewItem({ ...newItem, assignedNGOId: e.target.value })}
                                >
                                    <option value="">Select NGO (Optional)</option>
                                    {ngos.map(ngo => (
                                        <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setFormErrors({});
                                    }}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory; 