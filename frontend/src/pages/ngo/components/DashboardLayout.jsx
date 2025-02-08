import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
    FaHome, 
    FaTruck, 
    FaBoxes, 
    FaChartBar, 
    FaComments, 
    FaBroadcastTower, 
    FaCog,
    FaHandHoldingHeart 
} from 'react-icons/fa';
import { useNGO } from '../../../context/NGOContext';
import NotificationCenter from './NotificationCenter';

const DashboardLayout = () => {
    const { user } = useNGO();

    const menuItems = [
        { path: 'dashboard', label: 'Overview', icon: FaHome },
        { path: 'donations', label: 'Donations', icon: FaHandHoldingHeart },
        { path: 'pickups', label: 'Pickups', icon: FaTruck },
        { path: 'inventory', label: 'Inventory', icon: FaBoxes },
        { path: 'analytics', label: 'Analytics', icon: FaChartBar },
        { path: 'broadcasts', label: 'Broadcasts', icon: FaBroadcastTower },
        { path: 'chat', label: 'Chat', icon: FaComments },
        { path: 'settings', label: 'Settings', icon: FaCog }
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 min-h-screen p-4">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">NourishNow</h1>
                        <p className="text-gray-400 text-sm mt-1">{user?.name}</p>
                    </div>
                    <nav className="space-y-2">
                        {menuItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-300 hover:bg-gray-700'
                                    }`
                                }
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="p-8">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <NotificationCenter />
            </div>
        </div>
    );
};

export default DashboardLayout; 