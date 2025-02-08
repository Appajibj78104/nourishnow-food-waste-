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
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

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
    const [timeframe, setTimeframe] = useState('month');
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
            const response = await adminService.getAnalytics(timeframe);
            if (response.success) {
                setAnalyticsData(response.data);
            }
        } catch (error) {
            console.error('Error in analytics:', error);
            setError(error.message || 'Failed to fetch analytics data');
            toast.error(error.message || 'Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-gray-400 mt-2">System-wide analytics and metrics</p>
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

            {analyticsData && (
                <>
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h3 className="text-gray-400">Total Donations</h3>
                            <p className="text-2xl font-bold text-white mt-2">
                                {analyticsData.totalDonations}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h3 className="text-gray-400">Growth Rate</h3>
                            <p className="text-2xl font-bold text-white mt-2">
                                {analyticsData.growthRate}%
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h3 className="text-gray-400">People Served</h3>
                            <p className="text-2xl font-bold text-white mt-2">
                                {analyticsData.impactMetrics.peopleServed}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h3 className="text-gray-400">Food Waste Prevented (kg)</h3>
                            <p className="text-2xl font-bold text-white mt-2">
                                {analyticsData.impactMetrics.foodWastePrevented}
                            </p>
                        </motion.div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4">Donation Timeline</h2>
                            <Line
                                data={{
                                    labels: analyticsData.timeline.map(t => t.date),
                                    datasets: [
                                        {
                                            label: 'Donations',
                                            data: analyticsData.timeline.map(t => t.donations),
                                            borderColor: 'rgb(59, 130, 246)',
                                            tension: 0.4
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: { color: 'rgb(156, 163, 175)' }
                                        },
                                        x: {
                                            ticks: { color: 'rgb(156, 163, 175)' }
                                        }
                                    }
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-xl p-6"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4">Food Types Distribution</h2>
                            <Pie
                                data={{
                                    labels: Object.keys(analyticsData.foodTypes),
                                    datasets: [
                                        {
                                            data: Object.values(analyticsData.foodTypes),
                                            backgroundColor: [
                                                'rgb(59, 130, 246)',
                                                'rgb(16, 185, 129)',
                                                'rgb(239, 68, 68)',
                                                'rgb(245, 158, 11)'
                                            ]
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { color: 'rgb(156, 163, 175)' }
                                        }
                                    }
                                }}
                            />
                        </motion.div>
                    </div>
                    </>
                )}
        </div>
    );
};

export default Analytics; 