import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { assignVolunteer, updateDonationStatus, completeDonation } from '../services/ngoService';

const PickupsList = ({ donations, onStatusUpdate }) => {
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [volunteerName, setVolunteerName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAssignVolunteer = async () => {
        if (!volunteerName.trim()) {
            toast.error('Please enter volunteer name');
            return;
        }
        
        setLoading(true);
        try {
            const result = await assignVolunteer(selectedDonation._id, volunteerName.trim());
            if (result.success) {
                toast.success('Volunteer assigned successfully');
                setShowAssignModal(false);
                setSelectedDonation(null);
                setVolunteerName('');
                onStatusUpdate(); // Refresh the list
            } else {
                throw new Error(result.message || 'Failed to assign volunteer');
            }
        } catch (error) {
            console.error('Error assigning volunteer:', error);
            toast.error(error.message || 'Failed to assign volunteer');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (donationId, newStatus) => {
        try {
            setLoading(true);
            if (newStatus === 'completed') {
                await completeDonation(donationId);
            } else {
                await updateDonationStatus(donationId, newStatus);
            }
            toast.success(`Donation ${newStatus === 'completed' ? 'completed successfully' : 'marked as picked up'}`);
            onStatusUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (donationId) => {
        try {
            setLoading(true);
            await completeDonation(donationId);
            toast.success('Donation marked as completed');
            onStatusUpdate(); // Refresh the list
        } catch (error) {
            toast.error(error.message || 'Error completing donation');
        } finally {
            setLoading(false);
        }
    };

    if (!donations || donations.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                No active donations found
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {donations.map((donation) => (
                <motion.div
                    key={donation._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-semibold text-white">
                                {donation.donor.name} ({donation.donor.email})
                            </h3>
                            <p className="text-gray-400">
                                {donation.foodType} - {donation.quantity} {donation.unit}
                            </p>
                            <p className="text-gray-400">
                                Pickup Time: {format(new Date(donation.pickupTime), 'PPp')}
                            </p>
                            <p className="text-gray-400">
                                Address: {donation.pickupAddress.street}, {donation.pickupAddress.district}
                            </p>
                            {donation.assignedVolunteer && (
                                <p className="text-emerald-400 mt-2">
                                    Assigned to: {donation.assignedVolunteer.name}
                                </p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            {!donation.assignedVolunteer ? (
                                <button
                                    onClick={() => {
                                        setSelectedDonation(donation);
                                        setShowAssignModal(true);
                                    }}
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    <FaUserPlus className="mr-2" />
                                    Assign Volunteer
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleComplete(donation._id)}
                                    disabled={loading}
                                    className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    <FaCheckCircle className="mr-2" />
                                    {loading ? 'Completing...' : 'Complete'}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Assign Volunteer Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-800 rounded-xl p-6 w-96">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Assign Volunteer
                        </h3>
                        <input
                            type="text"
                            value={volunteerName}
                            onChange={(e) => setVolunteerName(e.target.value)}
                            placeholder="Enter volunteer name"
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedDonation(null);
                                    setVolunteerName('');
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignVolunteer}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                            >
                                {loading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickupsList; 