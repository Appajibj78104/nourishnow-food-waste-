import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
<<<<<<< HEAD
import { FaEdit, FaTrash, FaClock, FaCheckCircle, FaTruck } from 'react-icons/fa';
=======
import { FaEdit, FaTrash, FaClock, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
import { FaEdit, FaTrash, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaChevronDown } from 'react-icons/fa';
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
import { format } from 'date-fns';

const DonationList = ({ donations, showActions = false, onEdit, onDelete }) => {
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [filter, setFilter] = useState('all');

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
            case 'accepted': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
            case 'completed': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
            case 'cancelled': return 'bg-red-400/10 text-red-400 border-red-400/20';
            default: return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
<<<<<<< HEAD
<<<<<<< HEAD
            case 'pending': return FaClock;
            case 'accepted': return FaTruck;
            case 'completed': return FaCheckCircle;
            default: return FaClock;
=======
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'pending':
                return <FaClock className="text-yellow-500" />;
            case 'accepted':
                return <FaTruck className="text-blue-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaClock className="text-gray-500" />;
=======
            case 'completed': return <FaCheckCircle />;
            case 'pending': return <FaClock />;
            case 'accepted': return <FaTruck />;
            case 'cancelled': return <FaTimesCircle />;
            default: return <FaClock />;
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'PPp');
        } catch (error) {
            return 'Invalid Date';
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        }
    };

    const filteredDonations = donations.filter(donation => 
        filter === 'all' ? true : donation.status === filter
    );

    return (
        <div className="space-y-6">
            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Your Donations
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Manage and track your contributions
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

<<<<<<< HEAD
            <div className="space-y-4">
                <AnimatePresence>
<<<<<<< HEAD
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
=======
                    {donations.map((donation, index) => (
=======
            {/* Donations Grid/List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="wait">
                    {filteredDonations.map((donation, index) => (
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
                        <motion.div
                            key={donation._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="group backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    {/* Status Badge */}
                                    <div className={`px-4 py-2 rounded-xl border ${getStatusColor(donation.status)} flex items-center space-x-2`}>
                                        {getStatusIcon(donation.status)}
                                        <span className="capitalize">{donation.status}</span>
                                    </div>

                                    {/* Actions */}
                                    {showActions && donation.status === 'pending' && (
                                        <div className="flex items-center space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => onEdit(donation._id)}
                                                className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                            >
                                                <FaEdit />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => onDelete(donation._id)}
                                                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                            >
                                                <FaTrash />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>

                                {/* Main Content */}
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-white">
                                        {donation.quantity} {donation.quantityUnit} of {donation.foodType}
                                    </h3>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Expiry Date</p>
                                            <p className="text-white">{formatDate(donation.expiryDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Pickup Time</p>
                                            <p className="text-white">{formatDate(donation.pickupTime)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                <AnimatePresence>
                                    {selectedDonation === donation._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 pt-4 border-t border-white/10"
                                        >
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Description</p>
                                                    <p className="text-white mt-1">
                                                        {donation.description || 'No description provided'}
                                                    </p>
                                                </div>
                                                {donation.assignedNGO && (
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Assigned NGO</p>
                                                        <p className="text-white mt-1">{donation.assignedNGO.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Toggle Details Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDonation(
                                        selectedDonation === donation._id ? null : donation._id
                                    )}
                                    className="mt-4 flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    <span>{selectedDonation === donation._id ? 'Show less' : 'Show more'}</span>
                                    <FaChevronDown
                                        className={`transform transition-transform duration-300 ${
                                            selectedDonation === donation._id ? 'rotate-180' : ''
                                        }`}
                                    />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredDonations.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-gray-400">No donations found</p>
                    </motion.div>
                )}
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
            </div>
        </div>
    );
};

export default DonationList;
