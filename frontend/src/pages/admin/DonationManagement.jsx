import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaTruck, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const DonationManagement = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ngos, setNgos] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        fetchDonations();
        fetchNGOs();
    }, []);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllDonations();
            if (response.success) {
                setDonations(response.data || []);
            } else {
                toast.error('Failed to fetch donations');
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast.error('Failed to fetch donations');
        } finally {
            setLoading(false);
        }
    };

    const fetchNGOs = async () => {
        try {
            const response = await adminService.getVerifiedNGOs();
            if (response.success) {
                setNgos(response.data || []);
            } else {
                toast.error('Failed to fetch NGOs');
            }
        } catch (error) {
            console.error('Error fetching NGOs:', error);
            toast.error('Failed to fetch NGOs');
        }
    };

    const handleAssignNGO = async (donationId, ngoId) => {
        try {
            const response = await adminService.assignDonation(donationId, ngoId);
            if (response.success) {
                toast.success('Donation assigned successfully');
                fetchDonations();
            } else {
                toast.error('Failed to assign donation');
            }
        } catch (error) {
            console.error('Error assigning donation:', error);
            toast.error('Failed to assign donation');
        }
    };

    const handleUpdateStatus = async (donationId, status) => {
        try {
            const response = await adminService.updateDonationStatus(donationId, status);
            if (response.success) {
                toast.success('Status updated successfully');
                fetchDonations();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredDonations = selectedStatus === 'all' 
        ? donations 
        : donations.filter(donation => donation.status === selectedStatus);

    const statusColors = {
        pending: 'text-yellow-500 bg-yellow-500/10',
        assigned: 'text-blue-500 bg-blue-500/10',
        accepted: 'text-blue-500 bg-blue-500/10',
        completed: 'text-green-500 bg-green-500/10',
        cancelled: 'text-red-500 bg-red-500/10'
    };

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
                    Donation & Pickup Management
                </h1>
                <p className="text-gray-400 mt-2">Monitor and manage donations and pickups</p>
            </div>

            <div className="mb-6 flex space-x-4">
                {['all', 'pending', 'assigned', 'accepted', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                            selectedStatus === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="p-4">Donor</th>
                                <th className="p-4">Food Items</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Assigned NGO</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonations.map((donation) => (
                                <motion.tr
                                    key={donation._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-gray-700/50"
                                >
                                    <td className="p-4">
                                        {donation.donor?.name || 'Unknown Donor'}
                                        <div className="text-sm text-gray-400">
                                            {donation.donor?.email || 'No email'}
                                        </div>
                                    </td>
                                    <td className="p-4">{donation.foodItems}</td>
                                    <td className="p-4">{donation.quantity} kg</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[donation.status]}`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {donation.status === 'pending' ? (
                                            <select
                                                onChange={(e) => handleAssignNGO(donation._id, e.target.value)}
                                                className="bg-gray-700 text-white rounded-lg p-2"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Select NGO</option>
                                                {ngos.map((ngo) => (
                                                    <option key={ngo._id} value={ngo._id}>
                                                        {ngo.name || ngo.user?.name || 'Unknown NGO'}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            donation.assignedNGO?.name || 'Not assigned'
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            {donation.status === 'pending' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(donation._id, 'accepted')}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                                    title="Accept Donation"
                                                >
                                                    <FaTruck />
                                                </button>
                                            )}
                                            {donation.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(donation._id, 'completed')}
                                                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                    title="Mark as Completed"
                                                >
                                                    <FaCheck />
                                                </button>
                                            )}
                                            {['pending', 'accepted'].includes(donation.status) && (
                                                <button
                                                    onClick={() => handleUpdateStatus(donation._id, 'cancelled')}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                                    title="Cancel Donation"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DonationManagement; 