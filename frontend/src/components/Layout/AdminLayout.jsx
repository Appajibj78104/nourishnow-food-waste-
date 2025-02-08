import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800">
                <div className="flex flex-col h-full">
                    {/* Logo/Header */}
                    <div className="p-4">
                        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/admin/dashboard"
                                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/users"
                                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                                >
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/donations"
                                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                                >
                                    Donations
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/inventory"
                                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                                >
                                    Inventory
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/analytics"
                                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                                >
                                    Analytics
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/settings"
                                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                                >
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/broadcast"
                                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                                >
                                    Broadcast
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout; 