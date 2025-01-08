import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaClock, FaTruck } from 'react-icons/fa';

const PickupRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('pending');

    // Mock data - replace with actual API call
    useEffect(() => {
        const mockRequests = [
            {
                id: 1,
                donorName: "John's Restaurant",
                foodType: "Cooked Food",
                quantity: "20 meals",
                pickupTime: "2024-03-20T14:00:00",
                address: "123 Main St, City",
                status: "pending",
                expiryTime: "2024-03-20T20:00:00"
            },
            // Add more mock data
        ];
        setRequests(mockRequests);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-amber-400';
            case 'accepted': return 'text-blue-400';
            case 'completed': return 'text-emerald-400';
            case 'rejected': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return FaClock;
            case 'accepted': return FaTruck;
            case 'completed': return FaCheck;
            case 'rejected': return FaTimes;
            default: return FaClock;
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        // API call to update status
        console.log(`Updating request ${requestId} to ${newStatus}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Pickup Requests
                </h2>
                <div className="flex space-x-2">
                    <select 
                        className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Requests</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {requests.map((request) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl bg-white/5 ${getStatusColor(request.status)}`}>
                                        <StatusIcon className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{request.donorName}</h3>
                                        <p className="text-gray-400 text-sm">
                                            {request.foodType} - {request.quantity}
                                        </p>
                                    </div>
                                </div>

                                {request.status === 'pending' && (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleStatusChange(request.id, 'accepted')}
                                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(request.id, 'rejected')}
                                            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Request Details */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Pickup Time</p>
                                    <p className="text-white">
                                        {new Date(request.pickupTime).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Expiry Time</p>
                                    <p className="text-white">
                                        {new Date(request.expiryTime).toLocaleString()}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-gray-400">Pickup Address</p>
                                    <p className="text-white">{request.address}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default PickupRequests; 