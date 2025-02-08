import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import { FaChartLine, FaUsers, FaHandHoldingHeart } from 'react-icons/fa';
import { getAnalytics } from '../../../services/ngoService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [timeframe, setTimeframe] = useState('week');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await getAnalytics(timeframe);
            setAnalyticsData(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const lineChartData = {
        labels: analyticsData?.timeline?.map(item => item.date) || [],
        datasets: [
            {
                label: 'Donations Received',
                data: analyticsData?.timeline?.map(item => item.donations) || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4
            }
        ]
    };

    const barChartData = {
        labels: ['Food Types'],
        datasets: [
            {
                label: 'Cooked',
                data: [analyticsData?.foodTypes?.cooked || 0],
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            },
            {
                label: 'Packaged',
                data: [analyticsData?.foodTypes?.packaged || 0],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            },
            {
                label: 'Raw',
                data: [analyticsData?.foodTypes?.raw || 0],
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Donations"
                    value={analyticsData?.totalDonations || 0}
                    icon={FaHandHoldingHeart}
                    change={analyticsData?.donationGrowth || 0}
                />
                <StatsCard
                    title="People Served"
                    value={analyticsData?.peopleServed || 0}
                    icon={FaUsers}
                    change={analyticsData?.peopleServedGrowth || 0}
                />
                <StatsCard
                    title="Active Donors"
                    value={analyticsData?.activeDonors || 0}
                    icon={FaChartLine}
                    change={analyticsData?.donorGrowth || 0}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Donation Trends</h3>
                    <Line data={lineChartData} options={chartOptions} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Food Type Distribution</h3>
                    <Bar data={barChartData} options={chartOptions} />
                </motion.div>
            </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, change }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
                <Icon className="text-2xl text-blue-400" />
            </div>
        </div>
        <div className={`mt-2 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}% from last period
        </div>
    </motion.div>
);

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: 'white'
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'white'
            }
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'white'
            }
        }
    }
};

export default Analytics;