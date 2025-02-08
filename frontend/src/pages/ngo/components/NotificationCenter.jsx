import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { useSocket } from '../../../context/SocketContext';
import { toast } from 'react-toastify';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('newDonation', (donation) => {
            addNotification({
                type: 'donation',
                title: 'New Donation Available',
                message: `${donation.quantity} ${donation.foodType} available for pickup`,
                data: donation
            });
        });

        socket.on('scheduleUpdate', (schedule) => {
            addNotification({
                type: 'schedule',
                title: 'Schedule Update',
                message: `Pickup schedule ${schedule.status}`,
                data: schedule
            });
        });

        socket.on('volunteerUpdate', (data) => {
            addNotification({
                type: 'volunteer',
                title: 'Volunteer Update',
                message: data.message,
                data: data
            });
        });

        socket.on('notification', (notification) => {
            setNotifications(prev => [...prev, notification]);
            toast.info(notification.message);
        });

        return () => {
            if (socket) {
                socket.off('newDonation');
                socket.off('scheduleUpdate');
                socket.off('volunteerUpdate');
                socket.off('notification');
            }
        };
    }, [socket]);

    const addNotification = (notification) => {
        setNotifications(prev => [{
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification
        }, ...prev]);
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <>
            {/* Notification Bell */}
            <div className="fixed right-6 top-6">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <FaBell className="text-white text-xl" />
                    {notifications.some(n => !n.read) && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                </button>
            </div>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        className="fixed right-0 top-0 w-96 h-full backdrop-blur-lg bg-gray-900/95 border-l border-white/10 overflow-y-auto"
                    >
                        <div className="p-4 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/5"
                                >
                                    <FaTimes className="text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-white/10">
                            {notifications.map(notification => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 ${notification.read ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-white font-medium">
                                                {notification.title}
                                            </h4>
                                            <p className="text-sm text-gray-400">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(notification.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-1 rounded-full hover:bg-white/10"
                                            >
                                                <FaCheck className="text-green-400" />
                                            </button>
                                            <button
                                                onClick={() => removeNotification(notification.id)}
                                                className="p-1 rounded-full hover:bg-white/10"
                                            >
                                                <FaTimes className="text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NotificationCenter;