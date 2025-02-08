import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaClock, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';

const statusColors = {
    pending: 'text-yellow-500 bg-yellow-500/10',
    accepted: 'text-blue-500 bg-blue-500/10',
    picked_up: 'text-purple-500 bg-purple-500/10',
    in_transit: 'text-orange-500 bg-orange-500/10',
    delivered: 'text-green-500 bg-green-500/10',
    completed: 'text-emerald-500 bg-emerald-500/10',
    cancelled: 'text-red-500 bg-red-500/10'
};

const statusIcons = {
    pending: FaClock,
    picked_up: FaTruck,
    delivered: FaCheckCircle
};

const DonationHistory = ({ donations, onEdit, onDelete }) => {
    const [filter, setFilter] = useState('all');

    const filteredDonations = donations.filter(donation => {
        if (filter === 'all') return true;
        return donation.status === filter;
    });

    return (
        <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg ${
                        filter === 'all' ? 'bg-blue-500' : 'bg-gray-700'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg ${
                        filter === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700'
                    }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('picked_up')}
                    className={`px-4 py-2 rounded-lg ${
                        filter === 'picked_up' ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-700'
                    }`}
                >
                    Picked Up
                </button>
                <button
                    onClick={() => setFilter('delivered')}
                    className={`px-4 py-2 rounded-lg ${
                        filter === 'delivered' ? 'bg-green-500/20 text-green-500' : 'bg-gray-700'
                    }`}
                >
                    Delivered
                </button>
            </div>

            {/* Donations List */}
            <div className="grid gap-4">
                {filteredDonations.map(donation => {
                    const StatusIcon = statusIcons[donation.status] || FaClock;
                    
                    return (
                        <motion.div
                            key={donation._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <StatusIcon className={statusColors[donation.status]} />
                                        {donation.foodType} - {donation.quantity} {donation.unit}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs ${statusColors[donation.status]}`}>
                                        {donation.status}
                                    </span>
                                </div>
                                {donation.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(donation)}
                                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => onDelete(donation._id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="text-sm text-gray-400 space-y-1">
                                <p>Pickup: {format(new Date(donation.pickupTime), 'PPp')}</p>
                                <p>Location: {donation.pickupAddress.street}, {donation.pickupAddress.district}</p>
                                {donation.assignedNGO && (
                                    <p>Assigned to: {donation.assignedNGO.name}</p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {filteredDonations.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No donations found
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationHistory; 