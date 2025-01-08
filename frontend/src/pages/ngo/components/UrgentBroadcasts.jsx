import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBroadcastTower, FaPlus, FaMapMarkerAlt, FaClock, FaTrash } from 'react-icons/fa';

const UrgentBroadcasts = () => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBroadcast, setNewBroadcast] = useState({
        title: '',
        description: '',
        location: '',
        requiredBy: '',
        foodType: '',
        quantity: ''
    });

    // Mock data
    useEffect(() => {
        const mockBroadcasts = [
            {
                id: 1,
                title: "Urgent Need: Rice and Lentils",
                description: "Need rice and lentils for community kitchen",
                location: "Central Community Center",
                requiredBy: "2024-03-21",
                foodType: "Dry Rations",
                quantity: "100 kg",
                responses: 2,
                status: "active"
            },
            {
                id: 2,
                title: "Fresh Vegetables Needed",
                description: "Requiring fresh vegetables for tomorrow's meal service",
                location: "South District Kitchen",
                requiredBy: "2024-03-20",
                foodType: "Vegetables",
                quantity: "50 kg",
                responses: 5,
                status: "active"
            }
        ];
        setBroadcasts(mockBroadcasts);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const broadcast = {
            id: broadcasts.length + 1,
            ...newBroadcast,
            responses: 0,
            status: 'active'
        };
        setBroadcasts([broadcast, ...broadcasts]);
        setShowAddModal(false);
        setNewBroadcast({
            title: '',
            description: '',
            location: '',
            requiredBy: '',
            foodType: '',
            quantity: ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Urgent Broadcasts
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>New Broadcast</span>
                </button>
            </div>

            {/* Broadcasts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {broadcasts.map((broadcast) => (
                    <motion.div
                        key={broadcast.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                                    <FaBroadcastTower className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{broadcast.title}</h3>
                                    <p className="text-gray-400 text-sm">{broadcast.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {/* Handle delete */}}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-400">
                                <FaMapMarkerAlt className="mr-2" />
                                {broadcast.location}
                            </div>
                            <div className="flex items-center text-gray-400">
                                <FaClock className="mr-2" />
                                Required by: {new Date(broadcast.requiredBy).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div>
                                <span className="text-emerald-400 font-semibold">{broadcast.responses}</span>
                                <span className="text-gray-400 ml-1">responses</span>
                            </div>
                            <div className="flex space-x-2">
                                <span className="px-2 py-1 rounded-full bg-white/5 text-white text-sm">
                                    {broadcast.foodType}
                                </span>
                                <span className="px-2 py-1 rounded-full bg-white/5 text-white text-sm">
                                    {broadcast.quantity}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add Broadcast Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111827] rounded-2xl shadow-xl max-w-md w-full p-6 border border-white/10"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">New Urgent Broadcast</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newBroadcast.title}
                                    onChange={(e) => setNewBroadcast({...newBroadcast, title: e.target.value})}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={newBroadcast.description}
                                    onChange={(e) => setNewBroadcast({...newBroadcast, description: e.target.value})}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Food Type</label>
                                    <input
                                        type="text"
                                        value={newBroadcast.foodType}
                                        onChange={(e) => setNewBroadcast({...newBroadcast, foodType: e.target.value})}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                                    <input
                                        type="text"
                                        value={newBroadcast.quantity}
                                        onChange={(e) => setNewBroadcast({...newBroadcast, quantity: e.target.value})}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={newBroadcast.location}
                                    onChange={(e) => setNewBroadcast({...newBroadcast, location: e.target.value})}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Required By</label>
                                <input
                                    type="date"
                                    value={newBroadcast.requiredBy}
                                    onChange={(e) => setNewBroadcast({...newBroadcast, requiredBy: e.target.value})}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                                >
                                    Broadcast
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UrgentBroadcasts; 