import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const UserManagement = () => {
    const [users, setUsers] = useState({ donors: [], ngos: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('donors');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId, isNGO = false) => {
        try {
            await adminService.verifyUser(userId, isNGO);
            toast.success('User verified successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to verify user');
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
            await adminService.updateUserStatus(userId, newStatus);
            toast.success(`User ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error(error.message || 'Failed to update user status');
        }
    };

    const UserTable = ({ users, isNGO = false }) => (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
                <thead className="bg-gray-700/50">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Status</th>
                        {isNGO && <th className="p-4">Registration</th>}
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <motion.tr
                            key={user._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-gray-700/50"
                        >
                            <td className="p-4">{user.name}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    user.status === 'active' 
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'bg-red-500/20 text-red-500'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            {isNGO && (
                                <td className="p-4">
                                    {user.registrationNumber || 'Not provided'}
                                </td>
                            )}
                            <td className="p-4">
                                <div className="flex space-x-2">
                                    {(!user.verified && isNGO) && (
                                        <button
                                            onClick={() => handleVerify(user._id, true)}
                                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                            title="Verify NGO"
                                        >
                                            <FaCheck />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleToggleStatus(user._id, user.status)}
                                        className={`p-2 rounded-lg ${
                                            user.status === 'active'
                                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                        }`}
                                        title={user.status === 'active' ? 'Disable User' : 'Enable User'}
                                    >
                                        {user.status === 'active' ? <FaTimes /> : <FaCheck />}
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    User Management
                </h1>
                <p className="text-gray-400 mt-2">Manage donors and NGOs</p>
            </div>

            <div className="mb-6">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('donors')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'donors'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                        Donors
                    </button>
                    <button
                        onClick={() => setActiveTab('ngos')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'ngos'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                        NGOs
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
                {activeTab === 'donors' ? (
                    <UserTable users={users.donors || []} />
                ) : (
                    <UserTable users={users.ngos || []} isNGO={true} />
                )}
            </div>
        </div>
    );
};

export default UserManagement; 