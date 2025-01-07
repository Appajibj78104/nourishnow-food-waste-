import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DonationList = ({ donations }) => {
    const [selectedDonation, setSelectedDonation] = useState(null);

    const statusColors = {
        pending: 'yellow',
        picked_up: 'green',
        cancelled: 'red',
        scheduled: 'blue'
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Donations</h2>
            </div>
            <div className="divide-y divide-gray-200">
                <AnimatePresence>
                    {donations.map((donation) => (
                        <motion.div
                            key={donation._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedDonation(donation)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {donation.type}
                                    </h3>
                                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                                        <p>Quantity: {donation.quantity}</p>
                                        <p>Pickup Date: {new Date(donation.pickupDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusColors[donation.status]}-100 text-${statusColors[donation.status]}-800`}>
                                        {donation.status}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Add edit functionality
                                        }}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DonationList;
