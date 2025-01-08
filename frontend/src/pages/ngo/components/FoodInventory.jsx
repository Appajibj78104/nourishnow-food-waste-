import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaExclamationTriangle, FaPlus } from 'react-icons/fa';

const FoodInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // Mock data - replace with actual API call
    useEffect(() => {
        const mockInventory = [
            {
                id: 1,
                type: "Rice",
                quantity: "50 kg",
                receivedDate: "2024-03-19",
                expiryDate: "2024-06-19",
                status: "good",
                source: "Food Bank Donation"
            },
            // Add more mock data
        ];
        setInventory(mockInventory);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Food Inventory
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>Add Item</span>
                </button>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                            <FaBox className="text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Items</p>
                            <p className="text-2xl font-bold text-white">150</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <FaBox className="text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Available</p>
                            <p className="text-2xl font-bold text-white">120</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400">
                            <FaExclamationTriangle className="text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Expiring Soon</p>
                            <p className="text-2xl font-bold text-white">30</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Inventory List */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-400 text-sm">
                            <th className="px-6 py-3">Item</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Received Date</th>
                            <th className="px-6 py-3">Expiry Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Source</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {inventory.map((item) => (
                            <motion.tr
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-white"
                            >
                                <td className="px-6 py-4">{item.type}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.receivedDate}</td>
                                <td className="px-6 py-4">{item.expiryDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        item.status === 'good' ? 'bg-emerald-500/20 text-emerald-400' : 
                                        'bg-amber-500/20 text-amber-400'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{item.source}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FoodInventory; 