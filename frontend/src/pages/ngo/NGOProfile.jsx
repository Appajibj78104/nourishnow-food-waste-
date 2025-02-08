import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaIdCard, FaFileAlt, FaUpload } from 'react-icons/fa';
import { useNGO } from '../../context/NGOContext';
import { updateNGOProfile } from '../../services/ngoService';
import { toast } from 'react-toastify';

const NGOProfile = () => {
    const { user, updateUser } = useNGO();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        registrationNumber: user?.registrationNumber || '',
        darpanId: user?.darpanId || '',
        panNumber: user?.panNumber || '',
        description: user?.description || '',
        establishedYear: user?.establishedYear || '',
        operatingAreas: user?.operatingAreas || [],
        servingCapacity: user?.servingCapacity || '',
        documents: user?.documents || {
            registrationCertificate: null,
            panCard: null,
            bankDetails: null
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedProfile = await updateNGOProfile(formData);
            updateUser(updatedProfile);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (type, file) => {
        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('type', type);

            const response = await fetch('/api/ngo/upload-document', {
                method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    documents: {
                        ...prev.documents,
                        [type]: data.url
                    }
                }));
                toast.success('Document uploaded successfully');
            }
        } catch (error) {
            toast.error('Failed to upload document');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Profile Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        NGO Profile
                    </h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
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
                                    src={user?.profilePicture || '/ngo-default-logo.png'} 
                                    alt="NGO Logo" 
                                    className="w-full h-full object-cover"
                                />
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer">
                                        <FaUpload className="text-white text-xl" />
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload('profilePicture', e.target.files[0])}
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="text-center mt-4">
                                <h3 className="text-xl font-semibold text-white">{formData.name}</h3>
                                <p className="text-gray-400 text-sm">Established {formData.establishedYear}</p>
                            </div>
                        </motion.div>

                        {/* Verification Status */}
                        <motion.div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-white font-semibold mb-4">Verification Status</h3>
                            <div className={`px-4 py-2 rounded-lg ${
                                user?.verificationStatus === 'verified' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : user?.verificationStatus === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                            }`}>
                                {user?.verificationStatus?.toUpperCase() || 'PENDING'}
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-white font-semibold mb-4">Organization Stats</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Donations Received</p>
                                    <p className="text-2xl font-bold text-white">
                                        {user?.stats?.totalDonationsReceived || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">People Served</p>
                                    <p className="text-2xl font-bold text-white">
                                        {user?.stats?.peopleServed || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Active Donors</p>
                                    <p className="text-2xl font-bold text-white">
                                        {user?.stats?.activeDonors || 0}
                                    </p>
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

                                {/* Additional Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            <FaIdCard className="inline-block mr-2" />
                                            DARPAN ID
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.darpanId}
                                            onChange={(e) => setFormData({...formData, darpanId: e.target.value})}
                                            disabled={!isEditing}
                                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2 disabled:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            <FaIdCard className="inline-block mr-2" />
                                            PAN Number
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.panNumber}
                                            onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
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

                                {/* Documents Section */}
                                {isEditing && (
                                    <div className="space-y-4">
                                        <h3 className="text-white font-semibold">Documents</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {['registrationCertificate', 'panCard', 'bankDetails'].map((docType) => (
                                                <div key={docType} className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-300">
                                                        {docType.split(/(?=[A-Z])/).join(' ')}
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleFileUpload(docType, e.target.files[0])}
                                                            className="hidden"
                                                            id={`file-${docType}`}
                                                        />
                                                        <label
                                                            htmlFor={`file-${docType}`}
                                                            className="flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10"
                                                        >
                                                            <FaUpload className="mr-2" />
                                                            Upload
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Save Button */}
                                {isEditing && (
                                    <div className="flex justify-end">
                        <button
                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                                )}
                </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NGOProfile; 