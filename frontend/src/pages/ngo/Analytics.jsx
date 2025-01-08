import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { FaChartLine, FaChartBar, FaUsers, FaBox } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week');
    const [stats, setStats] = useState({
        donationTrends: [],
        foodTypeDistribution: [],
        summary: {
            totalDonations: 0,
            activeDonors: 0,
            completedPickups: 0,
            foodSaved: 0
        }
    });

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/ngo/analytics?timeRange=${timeRange}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                <div className="flex space-x-2">
                    {['week', 'month', 'year'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg ${
                                timeRange === range
                                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard
                    icon={FaChartLine}
                    title="Total Donations"
                    value={stats.summary.totalDonations}
                    trend="+12%"
                />
                <SummaryCard
                    icon={FaUsers}
                    title="Active Donors"
                    value={stats.summary.activeDonors}
                    trend="+5%"
                />
                <SummaryCard
                    icon={FaBox}
                    title="Completed Pickups"
                    value={stats.summary.completedPickups}
                    trend="+8%"
                />
                <SummaryCard
                    icon={FaChartBar}
                    title="Food Saved (kg)"
                    value={stats.summary.foodSaved}
                    trend="+15%"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donation Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                >
                    <h2 className="text-lg font-semibold text-white mb-4">Donation Trends</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.donationTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="donations" 
                                    stroke="#3B82F6" 
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Food Type Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                >
                    <h2 className="text-lg font-semibold text-white mb-4">Food Type Distribution</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.foodTypeDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="type" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                                <Bar 
                                    dataKey="quantity" 
                                    fill="#10B981"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SummaryCard = ({ icon: Icon, title, value, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
                <Icon className="text-xl text-emerald-500" />
            </div>
        </div>
        <p className={`text-sm mt-2 ${
            trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}>
            {trend} from last period
        </p>
    </motion.div>
);

export default Analytics; 