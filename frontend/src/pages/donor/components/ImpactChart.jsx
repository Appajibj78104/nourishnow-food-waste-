import React from 'react';
<<<<<<< HEAD
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ImpactChart = ({ donations }) => {
    // Process donations data for the chart
    const monthlyData = donations.reduce((acc, donation) => {
        const date = new Date(donation.createdAt);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + Number(donation.quantity);
        return acc;
    }, {});

    const data = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Donations Impact',
                data: Object.values(monthlyData),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            },
            title: {
                display: true,
                text: 'Monthly Donation Trends',
                color: 'white'
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'white'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'white'
                }
            }
        }
    };

    return (
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
            <Line data={data} options={options} />
        </div>
=======
import { motion } from 'framer-motion';

const ImpactChart = ({ stats, loading }) => {
    const successRate = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Your Impact</h2>
                    <p className="text-gray-400">
                        You've helped reduce food waste and feed those in need
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">{successRate}%</p>
                    <p className="text-sm text-gray-400">Success Rate</p>
                </div>
            </div>

            {loading ? (
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-4 w-full bg-gray-700 rounded-full"
                />
            ) : (
                <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${successRate}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    />
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                    <p className="text-sm text-gray-400">Total Donations</p>
                    <p className="text-xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-xl font-bold text-emerald-400">{stats.completed}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-xl font-bold text-amber-400">{stats.pending}</p>
                </div>
            </div>
        </motion.div>
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    );
};

export default ImpactChart; 