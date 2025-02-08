import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { FaUser, FaBox, FaHistory, FaCog, FaPlus, FaTrophy } from 'react-icons/fa';
import QuickStats from './components/QuickStats';
import DonationList from './components/DonationList';
import DonationForm from './components/DonationForm';
import { getDonorStats, getDonations } from './services/donorService';
=======
import { FaUser, FaBox, FaHistory, FaCog, FaPlus, FaTrophy, FaSignOutAlt } from 'react-icons/fa';
import QuickStats from './components/QuickStats';
import DonationList from './components/DonationList';
import DonationForm from './components/DonationForm';
<<<<<<< HEAD
import { getDonorStats, getDonations, editDonation, deleteDonation } from './services/donorService';
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
import { getDonorStats, getDonations, editDonation, deleteDonation, getDonorDonations } from './services/donorService';
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
import DonorProfile from './components/DonorProfile';
import Leaderboard from './components/Leaderboard';
import ImpactChart from './components/ImpactChart';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD

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
=======
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DonationSuccessCard from './components/DonationSuccessCard';

const DonorDashboard = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        impact: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [editingDonation, setEditingDonation] = useState(null);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [successDonation, setSuccessDonation] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                const [donationsData, statsData] = await Promise.all([
                    getDonations(),
                    getDonorStats()
                ]);
                setDonations(donationsData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
<<<<<<< HEAD
            } finally {
                setIsLoading(false);
=======
                toast.error('Failed to load dashboard data');
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
            }
        };

        fetchDashboardData();
<<<<<<< HEAD
=======
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const testAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Current token:', token);
                
                const response = await axios.get('/api/donations/test-auth', {
                    headers: {
                        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
                    }
                });
                console.log('Auth test response:', response.data);
            } catch (error) {
                console.error('Auth test failed:', error);
            }
        };
        testAuth();
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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

<<<<<<< HEAD
<<<<<<< HEAD
    if (isLoading) {
=======
    const handleDonationSubmit = (newDonation) => {
        setDonations(prevDonations => [newDonation, ...prevDonations]);
        setShowDonationForm(false);
        // Optionally refresh the stats
        fetchDashboardData();
=======
    const handleDonationSubmit = async (donationData) => {
        try {
            let response;
            if (editingDonation) {
                response = await editDonation(editingDonation._id, donationData);
                setDonations(prevDonations => 
                    prevDonations.map(d => 
                        d._id === editingDonation._id ? response.data : d
                    )
                );
                toast.success('Donation updated successfully');
            } else {
                response = await getDonorDonations(donationData);
                setDonations(prevDonations => [response.data, ...prevDonations]);
                setSuccessDonation(response.data);
                setShowSuccessCard(true);
                setTimeout(() => setShowSuccessCard(false), 5000);
                toast.success('Donation created successfully');
            }
            setShowDonationForm(false);
            setEditingDonation(null);
        } catch (error) {
            console.error('Error saving donation:', error);
            toast.error(error.response?.data?.message || 'Failed to save donation');
        }
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
    };

    const statCards = [
        {
            title: 'Total Donations',
            value: stats.total,
            icon: '📦',
            color: 'from-blue-400 to-blue-600'
        },
        {
            title: 'Meals Provided',
            value: `${stats.impact}+`,
            icon: '🍱',
            color: 'from-green-400 to-green-600'
        },
        {
            title: 'People Impacted',
            value: `${stats.impact * 3}+`,
            icon: '👥',
            color: 'from-purple-400 to-purple-600'
        },
        {
            title: 'Pending Pickups',
            value: stats.pending,
            icon: '⏳',
            color: 'from-orange-400 to-orange-600'
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    const DashboardHeader = () => (
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, <span className="text-cyan-400">{user?.name || 'Donor'}</span>
                    </h1>
                    <p className="text-gray-400">
                        Making a difference through your generous donations
                    </p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
                <FaSignOutAlt className="mr-2" />
                Logout
            </button>
        </div>
    );

    const handleEdit = async (id) => {
        try {
            // Find the donation to edit
            const donationToEdit = donations.find(d => d._id === id);
            if (!donationToEdit) {
                toast.error('Donation not found');
                return;
            }

            // Check if donation is editable (pending status)
            if (donationToEdit.status !== 'pending') {
                toast.error('Only pending donations can be edited');
                return;
            }

            // Set the donation to edit and show the form
            setEditingDonation(donationToEdit);
            setShowDonationForm(true);
        } catch (error) {
            console.error('Error preparing edit:', error);
            toast.error('Failed to prepare donation for editing');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Find the donation to delete
            const donationToDelete = donations.find(d => d._id === id);
            if (!donationToDelete) {
                toast.error('Donation not found');
                return;
            }

            // Check if donation is deletable (pending status)
            if (donationToDelete.status !== 'pending') {
                toast.error('Only pending donations can be deleted');
                return;
            }

            // Show confirmation dialog
            if (window.confirm('Are you sure you want to delete this donation?')) {
                await deleteDonation(id);
                // Update local state
                setDonations(prevDonations => prevDonations.filter(d => d._id !== id));
                toast.success('Donation deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting donation:', error);
            toast.error(error.response?.data?.message || 'Failed to delete donation');
        }
    };

    if (loading) {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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
<<<<<<< HEAD
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
=======
                        <DashboardHeader />
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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
<<<<<<< HEAD
                                <QuickStats stats={stats} />
                                <ImpactChart donations={donations} />
                                <DonationList donations={donations} />
=======
                                <div className="flex flex-col space-y-2">
                                    <h1 className="text-3xl font-bold text-white">
                                        Welcome, <span className="text-cyan-400">{user?.name || 'Donor'}</span>
                                    </h1>
                                    <p className="text-gray-400">
                                        Making a difference through your generous donations
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {statCards.map((card, index) => (
                                        <motion.div
                                            key={card.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <span className="text-4xl">{card.icon}</span>
                                                <div>
                                                    <h3 className="text-white font-semibold">{card.title}</h3>
                                                    <p className="text-2xl font-bold text-white">
                                                        {loading ? (
                                                            <motion.div
                                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                                className="h-8 w-16 bg-white/20 rounded"
                                                            />
                                                        ) : (
                                                            <motion.span
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 100 }}
                                                            >
                                                                {card.value}
                                                            </motion.span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <ImpactChart stats={stats} loading={loading} />
                                </div>
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                            </div>
                        )}

                        {activeTab === 'donations' && (
                            <div className="p-6">
                                <DonationList 
                                    donations={donations} 
                                    showActions={true}
<<<<<<< HEAD
                                    onEdit={(id) => {/* Handle edit */}}
                                    onDelete={(id) => {/* Handle delete */}}
=======
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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
<<<<<<< HEAD
                    onClose={() => setShowDonationForm(false)}
                    onSubmit={(donation) => {
                        setDonations([...donations, donation]);
                        setShowDonationForm(false);
                    }}
=======
                    onClose={() => {
                        setShowDonationForm(false);
                        setEditingDonation(null);
                    }}
                    onSubmit={handleDonationSubmit}
                    initialData={editingDonation}
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                />
            )}

            {showSuccessCard && (
                <DonationSuccessCard
                    show={showSuccessCard}
                    onClose={() => setShowSuccessCard(false)}
                    donation={successDonation}
                />
            )}
            
        </div>
    );
};

export default DonorDashboard;