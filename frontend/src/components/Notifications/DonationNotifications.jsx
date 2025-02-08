import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';
import { acceptDonation, rejectDonation } from '../../services/ngoService';
import { toast } from 'react-toastify';

const DonationNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('newDonation', (donation) => {
            setNotifications(prev => [{
                id: Date.now(),
                type: 'donation',
                data: donation,
                timestamp: new Date(),
                read: false
            }, ...prev]);
        });

        return () => {
            socket.off('newDonation');
        };
    }, [socket]);

    const handleAccept = async (donationId) => {
        try {
            await acceptDonation(donationId);
            removeNotification(donationId);
            toast.success('Donation accepted successfully');
        } catch (error) {
            toast.error('Failed to accept donation');
        }
    };

    const handleReject = async (donationId) => {
        try {
            await rejectDonation(donationId);
            removeNotification(donationId);
            toast.success('Donation rejected');
        } catch (error) {
            toast.error('Failed to reject donation');
        }
    };

    const removeNotification = (donationId) => {
        setNotifications(prev => prev.filter(n => n.data._id !== donationId));
    };

    return (
        <div className="space-y-4">
            {notifications.map(notification => (
                <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-white font-medium">
                                New Donation Available
                            </h3>
                            <p className="text-sm text-gray-400">
                                {notification.data.foodType} - {notification.data.quantity} units
                            </p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                <FaClock className="mr-1" />
                                {new Date(notification.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleAccept(notification.data._id)}
                                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            >
                                <FaCheck />
                            </button>
                            <button
                                onClick={() => handleReject(notification.data._id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}

            {notifications.length === 0 && (
                <div className="text-center text-gray-400">
                    No new notifications
                </div>
            )}
        </div>
    );
};

export default DonationNotifications;