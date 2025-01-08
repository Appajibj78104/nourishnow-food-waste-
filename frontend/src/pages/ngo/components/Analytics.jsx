import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    // Mock data
    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Food Collected (kg)',
                data: [300, 450, 380, 500, 420, 550],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const foodTypeData = {
        labels: ['Rice', 'Vegetables', 'Fruits', 'Cooked Food', 'Others'],
        datasets: [
            {
                data: [30, 25, 15, 20, 10],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ]
            }
        ]
    };

    const impactData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'People Fed',
                data: [1200, 1400, 1100, 1600],
                backgroundColor: 'rgba(16, 185, 129, 0.8)'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'white' }
            },
            title: {
                display: true,
                color: 'white'
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'white' }
            },
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'white' }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: 'white' }
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Analytics Dashboard
            </h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Collections', value: '2,500 kg' },
                    { label: 'People Fed', value: '5,300+' },
                    { label: 'Active Donors', value: '45' },
                    { label: 'Success Rate', value: '98%' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Collections */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Monthly Collections</h3>
                    <Line data={monthlyData} options={chartOptions} />
                </motion.div>

                {/* Food Type Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Food Type Distribution</h3>
                    <Doughnut data={foodTypeData} options={pieOptions} />
                </motion.div>

                {/* Weekly Impact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10 md:col-span-2"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Weekly Impact</h3>
                    <Bar data={impactData} options={chartOptions} />
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics; 