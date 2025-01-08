import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaBox, FaUsers, FaHandHoldingHeart, 
    FaClock, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';

const Overview = () => {
    // Quick Stats Data
    const stats = [
        { 
            icon: FaBox,
            label: 'Total Donations',
            value: '1,234',
            change: '+12%',
            color: 'blue'
        },
        {
            icon: FaUsers,
            label: 'People Served',
            value: '5,678',
            change: '+8%',
            color: 'emerald'
        },
        {
            icon: FaHandHoldingHeart,
            label: 'Active Donors',
            value: '45',
            change: '+5%',
            color: 'purple'
        }
    ];

    // Chart Data
    const donationTrends = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Donations Received',
            data: [65, 59, 80, 81, 56, 55],
            fill: true,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
        }]
    };

    const foodDistribution = {
        labels: ['Rice', 'Vegetables', 'Fruits', 'Cooked Food', 'Others'],
        datasets: [{
            data: [30, 25, 15, 20, 10],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(107, 114, 128, 0.8)'
            ]
        }]
    };

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                                <stat.icon className={`text-${stat.color}-400 text-xl`} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className={`text-${stat.color}-400 text-sm`}>
                                    {stat.change} this month
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Donation Trends</h3>
                    <Line data={donationTrends} options={{
                        responsive: true,
                        scales: {
                            y: {
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                ticks: { color: 'white' }
                            },
                            x: {
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                ticks: { color: 'white' }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: { color: 'white' }
                            }
                        }
                    }} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Food Distribution</h3>
                    <Doughnut data={foodDistribution} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { color: 'white' }
                            }
                        }
                    }} />
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
            >
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {/* Activity items */}
                </div>
            </motion.div>
        </div>
    );
};

export default Overview; 