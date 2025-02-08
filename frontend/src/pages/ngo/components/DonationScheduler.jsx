import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaCalendarAlt, FaUserFriends, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createSchedule, acceptDonation } from '../../../services/scheduleService';

const DonationScheduler = ({ donations = [], volunteers = [], fullWidth = false }) => {
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [pickupTime, setPickupTime] = useState('');
    const [loading, setLoading] = useState(false);

    // Ensure donations is an array
    const pendingDonations = Array.isArray(donations) ? donations : [];

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await createSchedule({
                donationId: selectedDonation._id,
                volunteers: selectedVolunteers,
                pickupTime
            });
            toast.success('Pickup scheduled successfully');
            resetForm();
        } catch (error) {
            toast.error('Failed to schedule pickup');
        }
    };

    const handleAcceptPickup = async (donationId) => {
        setLoading(true);
        try {
            await acceptDonation(donationId);
            toast.success('Pickup accepted successfully');
            // Optionally, you can refresh the donations list here
        } catch (error) {
            toast.error('Failed to accept pickup');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedDonation(null);
        setSelectedVolunteers([]);
        setPickupTime('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10 ${
                fullWidth ? 'w-full' : ''
            }`}
        >
            <h2 className="text-xl font-bold text-white mb-6">Pending Pickups</h2>
            <div className="space-y-4">
                {pendingDonations.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">No pending donations available</div>
                ) : (
                    pendingDonations.map(donation => (
                        <div key={donation._id} className="p-4 rounded-lg bg-white/10 border border-white/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-white font-medium">{donation.foodType}</h4>
                                    <p className="text-sm text-gray-400">Quantity: {donation.quantity}</p>
                                    <p className="text-xs text-gray-500">Location: {donation.location?.address || 'Not specified'}</p>
                                    <p className="text-xs text-gray-500">Donor: {donation.donor?.name || 'Unknown'}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleAcceptPickup(donation._id)}
                                        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                                    >
                                        Accept Pickup
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default DonationScheduler;