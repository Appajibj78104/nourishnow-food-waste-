import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';

const Pickups = () => {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();

    useEffect(() => {
        fetchPickups();
        
        if (socket) {
            socket.on('pickupUpdate', (updatedPickup) => {
                setPickups(prev => prev.map(pickup => 
                    pickup._id === updatedPickup._id ? updatedPickup : pickup
                ));
            });

            return () => socket.off('pickupUpdate');
        }
    }, [socket]);

    const fetchPickups = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/ngo/pickups`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setPickups(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pickups:', error);
            setLoading(false);
        }
    };

    const updatePickupStatus = async (pickupId, status) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/ngo/pickups/${pickupId}/status`,
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchPickups();
        } catch (error) {
            console.error('Error updating pickup status:', error);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-white">Active Pickups</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pickups.map(pickup => (
                    <motion.div
                        key={pickup._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {pickup.donation.foodType}
                                </h3>
                                <p className="text-gray-400">
                                    {pickup.donation.quantity} {pickup.donation.quantityUnit}
                                </p>
                            </div>
                            <StatusBadge status={pickup.status} />
                        </div>

                        <div className="space-y-2 text-sm text-gray-400">
                            <p className="flex items-center">
                                <FaClock className="mr-2" />
                                Pickup Time: {new Date(pickup.scheduledTime).toLocaleString()}
                            </p>
                            <p className="flex items-center">
                                <FaTruck className="mr-2" />
                                Address: {pickup.donation.pickupAddress.street}
                            </p>
                        </div>

                        {pickup.status === 'scheduled' && (
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => updatePickupStatus(pickup._id, 'in_progress')}
                                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Start Pickup
                                </button>
                            </div>
                        )}

                        {pickup.status === 'in_progress' && (
                            <button
                                onClick={() => updatePickupStatus(pickup._id, 'completed')}
                                className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            >
                                Complete Pickup
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'scheduled': return 'bg-yellow-500';
            case 'in_progress': return 'bg-blue-500';
            case 'completed': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor()}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default Pickups; 