import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useSocket } from '../../../context/SocketContext';
import { 
    FaHandHoldingHeart, 
    FaUsers, 
    FaTruck, 
    FaChartLine,
    FaClock,
    FaRoute,
    FaCheckCircle
} from 'react-icons/fa';

const StatCard = ({ icon: Icon, label, value, prefix = '', suffix = '', loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
    >
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
                <Icon className="text-blue-400 text-xl" />
            </div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <h3 className="text-2xl font-bold text-white">
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-700 animate-pulse rounded" />
                    ) : (
                        <CountUp
                            start={0}
                            end={value}
                            duration={2}
                            separator=","
                            prefix={prefix}
                            suffix={suffix}
                        />
                    )}
                </h3>
            </div>
        </div>
    </motion.div>
);

const NGOStats = ({ stats, loading }) => {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('statsUpdate', (newStats) => {
            // Handle real-time stats updates
            console.log('Received new stats:', newStats);
        });

        return () => {
            socket.off('statsUpdate');
        };
    }, [socket]);

    const statCards = [
        { icon: FaHandHoldingHeart, label: 'Total Donations', value: stats?.totalDonations || 0 },
        { icon: FaUsers, label: 'People Served', value: stats?.peopleServed || 0 },
        { icon: FaTruck, label: 'Active Pickups', value: stats?.activePickups || 0 },
        { icon: FaChartLine, label: 'Success Rate', value: stats?.successRate || 0, suffix: '%' },
        { icon: FaClock, label: 'Pending Pickups', value: stats?.pendingPickups || 0 },
        { icon: FaRoute, label: 'Active Deliveries', value: stats?.activeDeliveries || 0 },
        { icon: FaCheckCircle, label: 'Completed Today', value: stats?.completedToday || 0 }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
                <StatCard
                    key={index}
                    icon={card.icon}
                    label={card.label}
                    value={card.value}
                    prefix={card.prefix}
                    suffix={card.suffix}
                    loading={loading}
                />
            ))}
        </div>
    );
};

export default NGOStats;