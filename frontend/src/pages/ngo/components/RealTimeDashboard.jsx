import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../../context/SocketContext';
import { useNGO } from '../../../context/NGOContext';
import DonationNotifications from '../../../components/Notifications/DonationNotifications';
import ChatWindow from '../../../components/Chat/ChatWindow';

const RealTimeDashboard = ({ user }) => {
    const [activeChats, setActiveChats] = useState([]);
    const [realtimeStats, setRealtimeStats] = useState({
        activeDonations: 0,
        pendingPickups: 0,
        ongoingDeliveries: 0
    });
    const { socket } = useSocket();
    const { updateDashboardData } = useNGO();

    useEffect(() => {
        if (!socket) return;

        socket.on('statsUpdate', (newStats) => {
            setRealtimeStats(prev => ({
                ...prev,
                ...newStats
            }));
        });

        socket.on('newDonation', () => {
            updateDashboardData();
        });

        return () => {
            socket.off('statsUpdate');
            socket.off('newDonation');
        };
    }, [socket, updateDashboardData]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 grid grid-cols-3 gap-4"
            >
                <StatsCard
                    title="Active Donations"
                    value={realtimeStats.activeDonations}
                />
                <StatsCard
                    title="Pending Pickups"
                    value={realtimeStats.pendingPickups}
                />
                <StatsCard
                    title="Ongoing Deliveries"
                    value={realtimeStats.ongoingDeliveries}
                />
            </motion.div>

            {/* Chat Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10"
            >
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Active Chats</h2>
                </div>
                <div className="h-[400px]">
                    {activeChats.length > 0 ? (
                        <ChatWindow chat={activeChats[0]} user={user} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No active chats
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10"
            >
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Notifications</h2>
                </div>
                <div className="p-4">
                    <DonationNotifications user={user} />
                </div>
            </motion.div>
        </div>
    );
};

const StatsCard = ({ title, value }) => (
    <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
    </div>
);

export default RealTimeDashboard; 