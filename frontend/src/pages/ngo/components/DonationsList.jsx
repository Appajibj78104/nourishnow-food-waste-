import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { acceptDonation, rejectDonation, updateDonationStatus } from '../services/ngoService';

const DonationsList = ({ donations, onStatusUpdate }) => {
    const [rejectReason, setRejectReason] = useState('');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleAccept = async (donationId) => {
        try {
            await acceptDonation(donationId);
            toast.success('Donation accepted successfully');
            onStatusUpdate();
        } catch (error) {
            console.error('Accept donation error:', error);
            toast.error(error.message || 'Failed to accept donation');
        }
    };

    const handleReject = async () => {
        try {
            if (!rejectReason.trim()) {
                toast.error('Please provide a reason for rejection');
                return;
            }

            await rejectDonation(selectedDonation, rejectReason);
            toast.success('Donation rejected successfully');
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedDonation(null);
            onStatusUpdate();
        } catch (error) {
            console.error('Reject donation error:', error);
            toast.error(error.message || 'Failed to reject donation');
        }
    };

    const handleStatusUpdate = async (donationId, newStatus) => {
        try {
            await updateDonationStatus(donationId, newStatus);
            toast.success(`Donation marked as ${newStatus}`);
            onStatusUpdate();
        } catch (error) {
            toast.error('Failed to update donation status');
        }
    };

    if (!donations || donations.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                No donations found
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
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                {donation.donor?.name || 'Anonymous Donor'}
                                {donation.donor && (
                                    <span className="text-sm text-gray-400">
                                        ({donation.donor.email})
                                    </span>
                                )}
                            </h3>
                            <p className="text-gray-400 mt-1">
                                {donation.foodType} - {donation.quantity} units
                            </p>
                            <p className="text-gray-400">
                                Expires: {format(new Date(donation.expiryDate), 'PPp')}
                            </p>
                            <p className="text-gray-400">
                                Pickup: {format(new Date(donation.pickupTime), 'PPp')}
                            </p>
                            <p className="text-gray-400 mt-2">
                                Address: {donation.pickupAddress ? 
                                    `${donation.pickupAddress.street}, ${donation.pickupAddress.district}, ${donation.pickupAddress.state}, ${donation.pickupAddress.pincode}` 
                                    : 'No address provided'}
                            </p>
                            {donation.donor?.phone && (
                                <p className="text-gray-400">
                                    Contact: {donation.donor.phone}
                                </p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            {donation.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleAccept(donation._id)}
                                        className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDonation(donation._id);
                                            setShowRejectModal(true);
                                        }}
                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                                    >
                                        <FaTimes />
                                    </button>
                                </>
                            )}
                            {donation.status === 'accepted' && (
                                <button
                                    onClick={() => handleStatusUpdate(donation._id, 'picked_up')}
                                    className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"
                                >
                                    <FaTruck />
                                </button>
                            )}
                            {donation.status === 'picked_up' && (
                                <button
                                    onClick={() => handleStatusUpdate(donation._id, 'completed')}
                                    className="p-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20"
                                >
                                    <FaCheckCircle />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Reject Donation
                        </h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4"
                            rows="3"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                    setSelectedDonation(null);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationsList; 