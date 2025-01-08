import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';
import { FaTruck, FaClock, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const DonationTracker = ({ donation, user }) => {
    const [status, setStatus] = useState(donation.status);
    const [location, setLocation] = useState(donation.currentLocation);
    const [eta, setEta] = useState(donation.estimatedArrival);
    const { socket } = useSocket(user?.token);

    useEffect(() => {
        if (!socket) return;

        socket.on(`donation:${donation._id}:update`, (data) => {
            setStatus(data.status);
            setLocation(data.currentLocation);
            setEta(data.estimatedArrival);
        });

        return () => {
            socket.off(`donation:${donation._id}:update`);
        };
    }, [socket, donation._id]);

    const getStatusColor = () => {
        switch (status) {
            case 'pending': return 'text-yellow-400';
            case 'in_transit': return 'text-blue-400';
            case 'delivered': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                    Donation #{donation._id.substring(0, 8)}
                </h3>
                <span className={`flex items-center ${getStatusColor()}`}>
                    <FaTruck className="mr-2" />
                    {status.replace('_', ' ').toUpperCase()}
                </span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                    <FaClock className="mr-2" />
                    <span>ETA: {new Date(eta).toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Progress Timeline */}
            <div className="mt-6">
                <div className="flex justify-between mb-2">
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${status === 'pending' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                        <span className="text-xs text-gray-400 mt-1">Accepted</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${status === 'in_transit' ? 'bg-blue-400' : status === 'delivered' ? 'bg-green-400' : 'bg-gray-600'}`} />
                        <span className="text-xs text-gray-400 mt-1">In Transit</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${status === 'delivered' ? 'bg-green-400' : 'bg-gray-600'}`} />
                        <span className="text-xs text-gray-400 mt-1">Delivered</span>
                    </div>
                </div>
                <div className="relative h-1 bg-gray-600 rounded">
                    <motion.div
                        className="absolute h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded"
                        initial={{ width: '0%' }}
                        animate={{
                            width: status === 'pending' ? '33%' :
                                   status === 'in_transit' ? '66%' :
                                   status === 'delivered' ? '100%' : '0%'
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default DonationTracker; 