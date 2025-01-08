import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { format } from 'date-fns';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const DonationNotifications = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        // Listen for new notifications
        socket.on('notification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        // Listen for donation status updates
        socket.on('donationStatusUpdate', (update) => {
            const notification = {
                type: 'status',
                message: `Donation ${update.donationId} status changed to ${update.status}`,
                timestamp: new Date(),
                actionUrl: `/donations/${update.donationId}`,
                status: update.status
            };
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        // Listen for urgent notifications
        socket.on('urgentNotification', (notification) => {
            setNotifications(prev => [{
                ...notification,
                type: 'urgent',
                timestamp: new Date()
            }, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.off('notification');
            socket.off('donationStatusUpdate');
            socket.off('urgentNotification');
        };
    }, [socket]);

    const getNotificationIcon = (type, status) => {
        switch (type) {
            case 'urgent':
                return <FaExclamationCircle className="text-red-500" />;
            case 'status':
                return status === 'completed' 
                    ? <FaCheckCircle className="text-green-500" />
                    : <FaInfoCircle className="text-blue-500" />;
            default:
                return <FaBell className="text-gray-400" />;
        }
    };

    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    return (
        <div className="relative">
            {/* Notification Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <FaBell className="text-gray-400" />
                    <span className="text-white font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                    {notifications.map((notification, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className={`bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 ${
                                notification.type === 'urgent' ? 'border-red-500/50' : ''
                            }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                    {getNotificationIcon(notification.type, notification.status)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white">{notification.message}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-400">
                                            {format(new Date(notification.timestamp), 'PPp')}
                                        </span>
                                        {notification.actionUrl && (
                                            <a
                                                href={notification.actionUrl}
                                                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                                            >
                                                View Details →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                    <div className="text-center py-8">
                        <FaBell className="text-gray-600 text-4xl mx-auto mb-2" />
                        <p className="text-gray-400">No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationNotifications; 