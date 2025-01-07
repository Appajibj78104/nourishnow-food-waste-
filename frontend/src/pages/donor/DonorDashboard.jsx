import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBox, FaHistory, FaCog, FaPlus, FaTrophy } from 'react-icons/fa';
import QuickStats from './components/QuickStats';
import DonationList from './components/DonationList';
import DonationForm from './components/DonationForm';
import { getDonorStats, getDonations } from './services/donorService';
import DonorProfile from './components/DonorProfile';
import Leaderboard from './components/Leaderboard';
import ImpactChart from './components/ImpactChart';
import { useTranslation } from 'react-i18next';

const DonorDashboard = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);
                const [donationsData, statsData] = await Promise.all([
                    getDonations(),
                    getDonorStats()
                ]);
                setDonations(donationsData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const menuItems = [
        { id: 'overview', label: t('Overview'), icon: FaBox },
        { id: 'donations', label: t('Donations'), icon: FaHistory },
        { id: 'profile', label: t('Profile'), icon: FaCog },
        { id: 'leaderboard', label: t('Leaderboard'), icon: FaTrophy }
    ];

    // Add New Donation Button
    const AddDonationButton = () => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDonationForm(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-emerald-500 p-4 rounded-full shadow-lg text-white"
        >
            <FaPlus className="text-xl" />
        </motion.button>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#111827]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111827] text-white relative">
            {/* Background with overlay */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#111827]/80 to-[#111827] z-10" />
                <img
                    src="/images/volunteers.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                    Welcome, {user?.name}
                                </h1>
                                <p className="mt-2 text-gray-300">
                                    Making a difference through your generous donations
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 rounded-full bg-white/10 backdrop-blur-lg">
                                    <FaUser className="h-6 w-6 text-gray-300" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-64 flex-shrink-0"
                    >
                        <nav className="space-y-2">
                            {menuItems.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        activeTab === id
                                            ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                                            : 'text-gray-300 hover:bg-white/5'
                                    }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 backdrop-blur-lg bg-white/10 rounded-2xl border border-white/10"
                    >
                        {activeTab === 'overview' && (
                            <div className="p-6 space-y-6">
                                <QuickStats stats={stats} />
                                <ImpactChart donations={donations} />
                                <DonationList donations={donations} />
                            </div>
                        )}

                        {activeTab === 'donations' && (
                            <div className="p-6">
                                <DonationList 
                                    donations={donations} 
                                    showActions={true}
                                    onEdit={(id) => {/* Handle edit */}}
                                    onDelete={(id) => {/* Handle delete */}}
                                />
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="p-6">
                                <DonorProfile user={user} />
                            </div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div className="p-6">
                                <Leaderboard />
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* Floating Add Donation Button */}
            <AddDonationButton />

            {/* Donation Form Modal */}
            {showDonationForm && (
                <DonationForm
                    onClose={() => setShowDonationForm(false)}
                    onSubmit={(donation) => {
                        setDonations([...donations, donation]);
                        setShowDonationForm(false);
                    }}
                />
            )}
        </div>
    );
};

export default DonorDashboard;