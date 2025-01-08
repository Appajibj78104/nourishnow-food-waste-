import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfo } from 'react-icons/fa';
import { format } from 'date-fns';

const NotificationSystem = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        // Listen for different types of notifications
        socket.on('newDonation', handleNewDonation);
        socket.on('donationStatusChanged', handleDonationStatus);
        socket.on('urgentAlert', handleUrgentAlert);
        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newDonation');
            socket.off('donationStatusChanged');
            socket.off('urgentAlert');
            socket.off('newMessage');
        };
    }, [socket]);

    const handleNewDonation = (data) => {
        addNotification({
            type: 'donation',
            title: 'New Donation Available',
            message: `${data.donation.foodType} available for pickup`,
            icon: <FaInfo />,
            color: 'blue',
            data: data.donation
        });
    };

    const handleDonationStatus = (data) => {
        addNotification({
            type: 'status',
            title: 'Donation Status Updated',
            message: `Donation #${data.donationId} is now ${data.status}`,
            icon: <FaCheck />,
            color: 'green',
            data
        });
    };

    const handleUrgentAlert = (data) => {
        addNotification({
            type: 'urgent',
            title: 'Urgent Alert',
            message: data.message,
            icon: <FaExclamationTriangle />,
            color: 'red',
            data
        });
    };

    const handleNewMessage = (data) => {
        addNotification({
            type: 'message',
            title: 'New Message',
            message: `New message from ${data.sender.name}`,
            icon: <FaInfo />,
            color: 'purple',
            data
        });
    };

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        socket.emit('markNotificationRead', notificationId);
    };

    const removeNotification = (notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        if (!notifications.find(n => n.id === notificationId)?.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const getNotificationStyle = (type) => {
        switch (type) {
            case 'urgent':
                return 'bg-red-500/10 border-red-500/20';
            case 'donation':
                return 'bg-blue-500/10 border-blue-500/20';
            case 'status':
                return 'bg-green-500/10 border-green-500/20';
            case 'message':
                return 'bg-purple-500/10 border-purple-500/20';
            default:
                return 'bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
            >
                <FaBell className="text-gray-300 w-6 h-6" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-96 max-h-[80vh] bg-[#1F2937] rounded-xl shadow-lg border border-white/10 overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => {
                                        setNotifications(prev =>
                                            prev.map(n => ({ ...n, read: true }))
                                        );
                                        setUnreadCount(0);
                                        socket.emit('markAllNotificationsRead');
                                    }}
                                    className="text-sm text-blue-400 hover:text-blue-300"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto max-h-[60vh]">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-gray-400 text-center">
                                    No notifications
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`p-4 border-b border-white/10 ${
                                            notification.read ? 'opacity-60' : ''
                                        } ${getNotificationStyle(notification.type)}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start space-x-3">
                                                <div className={`mt-1 text-${notification.color}-400`}>
                                                    {notification.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-gray-300 text-sm">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        {format(notification.timestamp, 'HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-blue-400 hover:text-blue-300"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => removeNotification(notification.id)}
                                                    className="text-gray-400 hover:text-gray-300"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem; 