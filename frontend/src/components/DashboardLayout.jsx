import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../services/authService';

const DashboardLayout = () => {
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 shadow-md">
                    <div className="flex justify-between items-center px-6 py-4">
                        <h1 className="text-xl font-semibold text-white">NGO Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 