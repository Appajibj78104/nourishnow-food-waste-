import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHandHoldingHeart, FaBuilding, FaUtensils, FaPeopleCarry, FaTruck, FaBoxOpen, FaCheckCircle } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{value || '0'}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await adminService.getDashboardStats();
                console.log('Dashboard stats:', response); // Debug log
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError(error.message || 'Failed to load dashboard statistics');
                toast.error(error.message || 'Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Donations',
            value: stats?.totalDonations,
            icon: FaHandHoldingHeart,
            color: 'bg-blue-500/10 text-blue-500'
        },
        {
            title: 'Total NGOs',
            value: stats?.totalNGOs,
            icon: FaBuilding,
            color: 'bg-purple-500/10 text-purple-500'
        },
        {
            title: 'Total Donors',
            value: stats?.totalDonors,
            icon: FaUsers,
            color: 'bg-green-500/10 text-green-500'
        },
        {
            title: 'Meals Provided',
            value: stats?.mealsProvided,
            icon: FaUtensils,
            color: 'bg-yellow-500/10 text-yellow-500'
        },
        {
            title: 'People Served',
            value: stats?.peopleServed,
            icon: FaPeopleCarry,
            color: 'bg-pink-500/10 text-pink-500'
        },
        {
            title: 'Pending Pickups',
            value: stats?.pendingPickups,
            icon: FaBoxOpen,
            color: 'bg-orange-500/10 text-orange-500'
        },
        {
            title: 'Active Pickups',
            value: stats?.activePickups,
            icon: FaTruck,
            color: 'bg-teal-500/10 text-teal-500'
        },
        {
            title: 'Success Rate',
            value: `${stats?.successRate || 0}%`,
            icon: FaCheckCircle,
            color: 'bg-emerald-500/10 text-emerald-500'
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Overview of platform statistics and metrics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard; 