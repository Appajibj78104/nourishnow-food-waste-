import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaClock, FaCheckCircle, FaTruck } from 'react-icons/fa';
import { format } from 'date-fns';

const DonationList = ({ donations, showActions = false, onEdit, onDelete }) => {
    const [selectedDonation, setSelectedDonation] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-amber-400';
            case 'accepted': return 'text-blue-400';
            case 'completed': return 'text-emerald-400';
            case 'cancelled': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return FaClock;
            case 'accepted': return FaTruck;
            case 'completed': return FaCheckCircle;
            default: return FaClock;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Your Donations
                </h2>
                <div className="flex space-x-2">
                    <select 
                        className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm"
                        onChange={(e) => {/* Handle filter */}}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {donations.map((donation, index) => {
                        const StatusIcon = getStatusIcon(donation.status);
                        return (
                            <motion.div
                                key={donation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl bg-white/5 ${getStatusColor(donation.status)}`}>
                                            <StatusIcon className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">
                                                {donation.type} - {donation.quantity} units
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                Pickup: {format(new Date(donation.pickupDate), 'PPp')}
                                            </p>
                                        </div>
                                    </div>

                                    {showActions && (
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => onEdit(donation.id)}
                                                className="p-2 rounded-xl bg-white/5 text-blue-400 hover:bg-white/10 transition-colors"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => onDelete(donation.id)}
                                                className="p-2 rounded-xl bg-white/5 text-red-400 hover:bg-white/10 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Expandable Details */}
                                <AnimatePresence>
                                    {selectedDonation === donation.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 pt-4 border-t border-white/10"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Description:</p>
                                                    <p className="text-white">{donation.description}</p>
                                                </div>
                                                {donation.images?.length > 0 && (
                                                    <div className="flex space-x-2">
                                                        {donation.images.map((image, i) => (
                                                            <img
                                                                key={i}
                                                                src={image}
                                                                alt={`Donation ${i + 1}`}
                                                                className="w-20 h-20 rounded-lg object-cover"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={() => setSelectedDonation(
                                        selectedDonation === donation.id ? null : donation.id
                                    )}
                                    className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {selectedDonation === donation.id ? 'Show less' : 'Show more'}
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DonationList;
