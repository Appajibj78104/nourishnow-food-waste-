import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const DonationSuccessCard = ({ show, onClose, donation }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <div className="bg-gray-800/90 backdrop-blur-lg border border-green-500/20 rounded-2xl p-6 shadow-xl w-96">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500/20 rounded-full p-2">
                                    <FaCheckCircle className="text-2xl text-green-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                    Donation Created!
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-gray-300">
                                    <span className="text-green-400 font-semibold">
                                        {donation?.quantity} {donation?.quantityUnit}
                                    </span>{' '}
                                    of {donation?.foodType} food
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Pickup scheduled for: {new Date(donation?.pickupTime).toLocaleString()}
                                </p>
                            </div>

                            <div className="text-sm text-gray-400">
                                Thank you for your generous donation! NGOs will be notified and can now accept your donation.
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DonationSuccessCard; 