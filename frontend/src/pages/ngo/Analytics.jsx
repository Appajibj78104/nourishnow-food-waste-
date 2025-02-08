import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { FaChartLine, FaChartPie, FaList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAnalytics } from '../../services/ngoService';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [timeframe, setTimeframe] = useState('week');
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAnalytics(timeframe);
            if (response.success) {
                setAnalyticsData(response.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError(error.message || 'Failed to fetch analytics data');
            toast.error(error.message || 'Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    const lineChartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: 'rgb(156, 163, 175)' }
            },
            x: {
                ticks: { color: 'rgb(156, 163, 175)' }
            }
        },
        plugins: {
            legend: {
                labels: { color: 'rgb(156, 163, 175)' }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: 'rgb(156, 163, 175)' }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    NGO Analytics
                </h1>
                <p className="text-gray-400 mt-2">Track your NGO's performance and impact</p>
            </div>

            {/* Timeframe Selection */}
            <div className="mb-6">
                <div className="flex space-x-2">
                    {['week', 'month', 'year'].map((option) => (
                        <button
                            key={option}
                            onClick={() => setTimeframe(option)}
                            className={`px-4 py-2 rounded-lg capitalize ${
                                timeframe === option
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-300'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData && Object.entries(analyticsData.overview).map(([key, value]) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h3 className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <p className="text-2xl font-bold text-white mt-2">{value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            {analyticsData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Daily Donations</h2>
                        <Line
                            data={{
                                labels: Object.keys(analyticsData.dailyDonations),
                                datasets: [{
                                    label: 'Donations',
                                    data: Object.values(analyticsData.dailyDonations),
                                    borderColor: 'rgb(59, 130, 246)',
                                    tension: 0.4
                                }]
                            }}
                            options={lineChartOptions}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Food Categories</h2>
                        <Pie
                            data={{
                                labels: Object.keys(analyticsData.foodCategories),
                                datasets: [{
                                    data: Object.values(analyticsData.foodCategories),
                                    backgroundColor: [
                                        'rgb(59, 130, 246)',
                                        'rgb(16, 185, 129)',
                                        'rgb(239, 68, 68)',
                                        'rgb(245, 158, 11)'
                                    ]
                                }]
                            }}
                            options={pieChartOptions}
                        />
                    </motion.div>
                </div>
            )}

            {/* Recent Donations Table */}
            {analyticsData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gray-800 rounded-xl p-6"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Donations</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-gray-300">
                            <thead>
                                <tr className="text-left">
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Food Type</th>
                                    <th className="pb-4">Quantity</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData.recentDonations.map((donation) => (
                                    <tr key={donation._id}>
                                        <td className="py-2">
                                            {new Date(donation.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-2">{donation.foodType}</td>
                                        <td className="py-2">{donation.quantity}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                donation.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                donation.status === 'accepted' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                                {donation.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Analytics;