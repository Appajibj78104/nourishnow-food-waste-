import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
    FaHome, FaHandHoldingHeart, FaHistory, 
    FaCog, FaComments, FaBell, FaSignOutAlt, FaUser 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const DonorDashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [notifications] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const menuItems = [
        { path: '/donor/dashboard', icon: FaHome, label: 'Overview' },
        { path: '/donor/create', icon: FaHandHoldingHeart, label: 'Create Donation' },
        { path: '/donor/history', icon: FaHistory, label: 'History' },
        { path: '/donor/chat', icon: FaComments, label: 'Chat' },
        { path: '/donor/settings', icon: FaCog, label: 'Settings' }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            {/* Top Navigation */}
            <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/donor/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                                NourishNow
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-full hover:bg-white/5 transition-colors relative"
                                >
                                    <FaBell className="text-gray-300 text-xl" />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {notifications.length}
                                        </span>
                                    )}
                                </motion.button>
                            </div>

                            {/* Profile Menu */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                                        <span className="text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </motion.button>

                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800 border border-white/10 shadow-lg py-1 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="text-sm text-white font-medium">{user?.name}</p>
                                            <p className="text-xs text-gray-400">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center space-x-2"
                                        >
                                            <FaSignOutAlt />
                                            <span>Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-64 min-h-[calc(100vh-4rem)] bg-gray-800/50 backdrop-blur-lg border-r border-white/10"
                >
                    <nav className="mt-8 px-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center space-x-2 px-4 py-3 rounded-xl mb-2 transition-all duration-200
                                    ${location.pathname === item.path 
                                        ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg' 
                                        : 'text-gray-300 hover:bg-white/5'}
                                `}
                            >
                                <item.icon className={location.pathname === item.path ? 'text-white' : 'text-gray-400'} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </motion.div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboardLayout; 