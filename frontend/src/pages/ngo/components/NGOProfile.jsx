import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaIdCard, FaFileAlt } from 'react-icons/fa';

const NGOProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user || {
        name: '',
        email: '',
        phone: '',
        address: '',
        registrationNumber: '',
        taxId: '',
        description: '',
        establishedYear: '',
        operatingAreas: '',
        capacity: '',
        documents: {
            registration: null,
            tax: null
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // API call to update profile
        console.log('Updated profile:', formData);
        setIsEditing(false);
    };

    const handleFileUpload = (type, file) => {
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [type]: file
            }
        }));
    };

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    NGO Profile
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
                {/* Left Column - Organization Info */}
                <div className="space-y-6">
                    <motion.div 
                        className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden border-2 border-white/20">
                            <img 
                                src={user?.logo || '/ngo-default-logo.png'} 
                                alt="NGO Logo" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                            <p className="text-gray-400 text-sm">Established {formData.establishedYear}</p>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white font-semibold mb-4">Organization Stats</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 text-sm">Total Donations Received</p>
                                <p className="text-2xl font-bold text-white">1,234</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">People Served</p>
                                <p className="text-2xl font-bold text-white">5,678</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Donors</p>
                                <p className="text-2xl font-bold text-white">89</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Profile Details */}
                <div className="md:col-span-2">
                    <motion.div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaBuilding className="inline-block mr-2" />
                                        Organization Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 disabled:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaEnvelope className="inline-block mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-gray-400 px-4 py-2"
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaPhone className="inline-block mr-2" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 disabled:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        <FaIdCard className="inline-block mr-2" />
                                        Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.registrationNumber}
                                        onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 disabled:text-gray-400"
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
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    disabled={!isEditing}
                                    rows="3"
                                    className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 disabled:text-gray-400"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    <FaFileAlt className="inline-block mr-2" />
                                    Organization Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    disabled={!isEditing}
                                    rows="4"
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

export default NGOProfile; 