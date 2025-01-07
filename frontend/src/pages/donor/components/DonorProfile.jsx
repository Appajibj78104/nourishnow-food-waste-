import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaMapMarkerAlt, FaIdCard, FaPhone, FaEnvelope, FaMedal } from 'react-icons/fa';

const DonorProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user || {});
    const [badges, setBadges] = useState([
        { name: 'First Donation', icon: '🎉' },
        { name: 'Regular Donor', icon: '⭐' },
        { name: '100 Meals', icon: '🍱' }
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle profile update logic here
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Profile Details
                </h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                    <FaEdit />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Profile Picture & Badges */}
                <div className="space-y-6">
                    <motion.div 
                        className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Profile Picture */}
                        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/20">
                            <img 
                                src={user?.profilePicture || '/default-avatar.png'} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                            <p className="text-gray-400 text-sm">Member since {new Date(user?.createdAt).getFullYear()}</p>
                        </div>
                    </motion.div>

                    {/* Badges Section */}
                    <motion.div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <FaMedal className="text-yellow-400" />
                            Achievements
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {badges.map((badge, index) => (
                                <div key={index} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-2xl mb-1">{badge.icon}</div>
                                    <div className="text-sm text-gray-300">{badge.name}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Profile Details */}
                <div className="md:col-span-2">
                    <motion.div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaEnvelope className="inline-block mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        disabled
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-gray-400 px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaPhone className="inline-block mr-2" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 disabled:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Identity Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaIdCard className="inline-block mr-2" />
                                        Aadhar Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.aadharNumber || ''}
                                        disabled
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-gray-400 px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaIdCard className="inline-block mr-2" />
                                        PAN Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.panNumber || ''}
                                        disabled
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-gray-400 px-4 py-2"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    <FaMapMarkerAlt className="inline-block mr-2" />
                                    Address
                                </label>
                                <textarea
                                    value={formData.address || ''}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    disabled={!isEditing}
                                    rows="3"
                                    className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 disabled:text-gray-400"
                                />
                            </div>

                            {/* Save Button */}
                            {isEditing && (
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DonorProfile; 