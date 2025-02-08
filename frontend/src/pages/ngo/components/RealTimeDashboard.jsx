import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../../context/SocketContext';
import { useNGO } from '../../../context/NGOContext';
import DonationNotifications from '../../../components/Notifications/DonationNotifications';
import ChatWindow from '../../../components/Chat/ChatWindow';
import { FaTruck, FaBox, FaUsers } from 'react-icons/fa';

const RealTimeDashboard = ({ donations }) => {
    const [activeChats, setActiveChats] = useState([]);
    const [realtimeStats, setRealtimeStats] = useState({
        activeDonations: 0,
        pendingPickups: 0,
        ongoingDeliveries: 0
    });
    const { socket } = useSocket();
    const { updateDashboardData } = useNGO();

    const pendingDonations = donations.filter(d => d.status === 'pending').length;
    const activeDonations = donations.filter(d => d.status === 'active').length;
    const completedDonations = donations.filter(d => d.status === 'completed').length;

    const stats = [
        {
            title: 'Pending Pickups',
            value: pendingDonations,
            icon: FaBox,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10'
        },
        {
            title: 'Active Deliveries',
            value: activeDonations,
            icon: FaTruck,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10'
        },
        {
            title: 'Completed Today',
            value: completedDonations,
            icon: FaUsers,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10'
        }
    ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-white mt-2">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                            <stat.icon className={`text-xl ${stat.color}`} />
                        </div>
                    </div>
                </motion.div>
            ))}
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