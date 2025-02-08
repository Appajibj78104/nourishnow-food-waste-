import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaTruck, FaBoxes, FaChartBar, FaComments, FaBroadcastTower, FaCog, FaUsers, FaCheckCircle, FaClock, FaSignOutAlt } from 'react-icons/fa';
import { ErrorBoundary } from 'react-error-boundary';
import { useSocket } from '../../context/SocketContext';
import { getDashboardStats } from './services/ngoService';
import { toast } from 'react-toastify';
import { logout } from '../../services/authService';

// Import components
import NGOStats from './components/NGOStats';
import DonationMap from './components/DonationMap';
import DonationScheduler from './components/DonationScheduler';
import InventoryManager from './components/InventoryManager';
import NotificationCenter from './components/NotificationCenter';
import Overview from './components/Overview';
import RealTimeDashboard from './components/RealTimeDashboard';

// Import services
import { getDonations, getVolunteers } from './services/ngoService';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="text-center p-6 bg-red-50 rounded-lg">
            <h2 className="text-red-600 text-xl font-bold mb-4">Something went wrong:</h2>
            <pre className="text-red-500 mb-4">{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Try again
            </button>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-6 rounded-xl border border-gray-700"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="text-xl" />
            </div>
        </div>
    </motion.div>
);

const NGODashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState({
        donations: [],
        stats: null,
        volunteers: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        fetchDashboardData();
        
        // Only set up socket listeners if socket exists
        if (!socket) return;

        socket.on('donationStatusUpdated', ({ donationId, status }) => {
            // Handle donation status updates
            setDashboardData(prev => ({
                ...prev,
                donations: prev.donations.map(donation => 
                    donation._id === donationId 
                        ? { ...donation, status } 
                        : donation
                )
            }));
        });

        socket.on('newDonation', (donation) => {
            // Handle new donations
            setDashboardData(prev => ({
                ...prev,
                donations: [donation, ...prev.donations]
            }));
        });

        return () => {
            if (socket) {
                socket.off('donationStatusUpdated');
                socket.off('newDonation');
            }
        };
    }, [socket]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const statsRes = await getDashboardStats();
            console.log('Dashboard stats response:', statsRes); // For debugging
            
            if (!statsRes.success) {
                throw new Error(statsRes.message || 'Failed to fetch dashboard data');
            }
            
            setDashboardData({
                stats: statsRes.data,
                donations: [],
                volunteers: []
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data');
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-red-500 text-center p-4">
                    Error: {error}
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <NGOStats stats={dashboardData.stats} loading={loading} />
                        <RealTimeDashboard donations={dashboardData.donations || []} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DonationMap donations={dashboardData.donations || []} />
                            <DonationScheduler 
                                donations={dashboardData.donations.filter(d => d.status === 'pending')}
                                volunteers={dashboardData.volunteers || []}
                            />
                        </div>
                    </div>
                );
            case 'inventory':
                return <InventoryManager />;
            case 'pickups':
                return (
                    <DonationScheduler 
                        donations={dashboardData.donations || []}
                        volunteers={dashboardData.volunteers || []}
                        fullWidth
                    />
                );
            default:
                return <Overview />;
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={fetchDashboardData}
        >
            <div className="min-h-screen bg-gray-900">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
                
                <div className="flex">
                    <div className="flex-1 p-8">
                        <div className="max-w-7xl mx-auto">
                            {renderContent()}
                        </div>
                    </div>
                    <NotificationCenter />
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default NGODashboard;