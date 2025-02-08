import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaBox, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useSocket } from '../../../context/SocketContext';

const DeliveryTracker = ({ delivery }) => {
    const [status, setStatus] = useState(delivery.status);
    const [currentLocation, setCurrentLocation] = useState(delivery.currentLocation);
    const [eta, setEta] = useState(delivery.estimatedArrival);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on(`delivery:${delivery._id}:update`, (data) => {
            setStatus(data.status);
            setCurrentLocation(data.currentLocation);
            setEta(data.estimatedArrival);
        });

        return () => {
            socket.off(`delivery:${delivery._id}:update`);
        };
    }, [socket, delivery._id]);

    const getStatusColor = () => {
        switch (status) {
            case 'picked_up': return 'text-blue-400';
            case 'in_transit': return 'text-yellow-400';
            case 'delivered': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    const getProgressWidth = () => {
        switch (status) {
            case 'picked_up': return '33%';
            case 'in_transit': return '66%';
            case 'delivered': return '100%';
            default: return '0%';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Delivery #{delivery._id.substring(0, 8)}
                    </h3>
                    <p className="text-gray-400">
                        {delivery.foodType} - {delivery.quantity} units
                    </p>
                </div>
                <div className={`flex items-center ${getStatusColor()}`}>
                    <FaTruck className="mr-2" />
                    <span>{status.replace('_', ' ').toUpperCase()}</span>
                </div>
            </div>

            {/* Progress Timeline */}
            <div className="relative pt-8">
                <div className="flex justify-between mb-4">
                    {['Picked Up', 'In Transit', 'Delivered'].map((step, index) => (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index <= getDeliveryStep() ? 'bg-blue-500' : 'bg-gray-600'
                            }`}>
                                {getStepIcon(index)}
                            </div>
                            <span className="text-sm text-gray-400 mt-2">{step}</span>
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: getProgressWidth() }}
                        className="h-full bg-blue-500 rounded-full"
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Delivery Details */}
            <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-300">
                    <FaClock className="mr-2" />
                    <span>ETA: {new Date(eta).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center text-gray-300">
                    <FaTruck className="mr-2" />
                    <span>Current Location: {currentLocation}</span>
                </div>
            </div>
        </motion.div>
    );
};

const getDeliveryStep = (status) => {
    switch (status) {
        case 'picked_up': return 0;
        case 'in_transit': return 1;
        case 'delivered': return 2;
        default: return -1;
    }
};

const getStepIcon = (step) => {
    switch (step) {
        case 0: return <FaBox className="text-white" />;
        case 1: return <FaTruck className="text-white" />;
        case 2: return <FaCheckCircle className="text-white" />;
        default: return <FaClock className="text-white" />;
    }
};

export default DeliveryTracker;