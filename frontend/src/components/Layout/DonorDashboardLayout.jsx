import React, { useState } from 'react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Link, useLocation } from 'react-router-dom';
=======
import { Link, useLocation, Outlet } from 'react-router-dom';
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
import { 
    FaHome, FaHandHoldingHeart, FaHistory, 
    FaCog, FaComments, FaBell, FaBullhorn 
} from 'react-icons/fa';

<<<<<<< HEAD
const DonorDashboardLayout = ({ children }) => {
=======
const DonorDashboardLayout = () => {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);

    const menuItems = [
        { path: '/donor/dashboard', icon: FaHome, label: 'Overview' },
        { path: '/donor/create', icon: FaHandHoldingHeart, label: 'Create Donation' },
        { path: '/donor/history', icon: FaHistory, label: 'History' },
        { path: '/donor/chat', icon: FaComments, label: 'Chat' },
        { path: '/donor/settings', icon: FaCog, label: 'Settings' },
        { path: '/donor/broadcasts', icon: FaBullhorn, label: 'Broadcasts' }
    ];

    return (
        <div className="min-h-screen bg-[#111827] text-white">
            {/* Top Navigation */}
            <nav className="bg-[#1F2937] border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/donor/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                NourishNow
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="p-2 rounded-full hover:bg-white/5">
                                    <FaBell className="text-gray-300" />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="relative">
                                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/5">
                                    <img 
                                        src="/default-avatar.png" 
                                        alt="Profile" 
                                        className="w-8 h-8 rounded-full"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-[#1F2937] border-r border-white/10">
                    <nav className="mt-8 px-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center space-x-2 px-4 py-3 rounded-xl mb-2
                                    ${location.pathname === item.path 
                                        ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white' 
                                        : 'text-gray-300 hover:bg-white/5'}
                                `}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
<<<<<<< HEAD
                        {children}
=======
                        <Outlet />
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboardLayout; 