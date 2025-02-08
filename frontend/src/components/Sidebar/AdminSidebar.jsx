import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBoxes, FaChartBar, FaBroadcastTower, FaWarehouse, FaCog } from 'react-icons/fa';

const AdminSidebar = () => {
    const menuItems = [
        {
            title: 'Overview Dashboard',
            icon: FaChartLine,
            path: '/admin/dashboard'
        },
        {
            title: 'User Management',
            icon: FaUsers,
            path: '/admin/users'
        },
        {
            title: 'Donation & Pickup',
            icon: FaBoxes,
            path: '/admin/donations'
        },
        {
            title: 'Analytics & Reports',
            icon: FaChartBar,
            path: '/admin/analytics'
        },
        {
            title: 'Broadcast',
            icon: FaBroadcastTower,
            path: '/admin/broadcast'
        },
        {
            title: 'Inventory',
            icon: FaWarehouse,
            path: '/admin/inventory'
        },
        {
            title: 'Settings',
            icon: FaCog,
            path: '/admin/settings'
        }
    ];

    return (
        <div className="w-64 bg-gray-800 h-screen flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2 p-4">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default AdminSidebar; 