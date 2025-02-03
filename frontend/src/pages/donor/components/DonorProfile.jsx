<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaBriefcase, FaFacebook, FaTwitter, FaLinkedin, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { updateProfile } from '../services/donorService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DonorProfile = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        organization: {
            name: user?.organization?.name || '',
            position: user?.organization?.position || ''
        },
        socialLinks: {
            facebook: user?.socialLinks?.facebook || '',
            twitter: user?.socialLinks?.twitter || '',
            linkedin: user?.socialLinks?.linkedin || ''
        },
        preferences: {
            notifications: {
                email: user?.preferences?.notifications?.email ?? true,
                push: user?.preferences?.notifications?.push ?? true
            },
            privacySettings: {
                showProfile: user?.preferences?.privacySettings?.showProfile ?? true,
                showDonations: user?.preferences?.privacySettings?.showDonations ?? true
            }
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateProfile(formData);
            
            // Update global auth context
            updateUser(response.data);
            
            // Update local form data
            setFormData(prev => ({
                ...prev,
                ...response.data
            }));
            
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FaUser },
        { id: 'organization', label: 'Organization', icon: FaBuilding },
        { id: 'social', label: 'Social Links', icon: FaFacebook },
        { id: 'preferences', label: 'Preferences', icon: FaBell }
    ];

    const ProfileHeader = () => (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                    <p className="text-gray-400">{user?.email}</p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
                <FaSignOutAlt className="mr-2" />
                Logout
            </button>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
                <ProfileHeader />
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
                    >
                        <FaEdit className="mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </motion.button>
                </div>

                <div className="flex space-x-4 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <tab.icon className="mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Name</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaUser className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="Your name"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.name}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Email</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaEnvelope className="text-gray-400 mr-3" />
                                    <span className="text-white">{formData.email}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Phone</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaPhone className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="Your phone number"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.phone || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Address</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="Your address"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.address || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'organization' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Organization Name</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaBuilding className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="organization.name"
                                            value={formData.organization.name}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="Organization name"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.organization.name || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Position</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaBriefcase className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="organization.position"
                                            value={formData.organization.position}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="Your position"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.organization.position || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Facebook</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaFacebook className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            name="socialLinks.facebook"
                                            value={formData.socialLinks.facebook}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="Facebook profile URL"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.socialLinks.facebook || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Twitter</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaTwitter className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            name="socialLinks.twitter"
                                            value={formData.socialLinks.twitter}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="Twitter profile URL"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.socialLinks.twitter || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">LinkedIn</label>
                                <div className="flex items-center bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                                    <FaLinkedin className="text-gray-400 mr-3" />
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            name="socialLinks.linkedin"
                                            value={formData.socialLinks.linkedin}
                                            onChange={handleChange}
                                            className="bg-transparent text-white w-full focus:outline-none"
                                            placeholder="LinkedIn profile URL"
                                        />
                                    ) : (
                                        <span className="text-white">{formData.socialLinks.linkedin || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white font-semibold mb-4">Notification Settings</h3>
                                <div className="space-y-3">
                                    {isEditing ? (
                                        <>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    name="preferences.notifications.email"
                                                    checked={formData.preferences.notifications.email}
                                                    onChange={handleChange}
                                                    className="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
                                                />
                                                <span className="text-gray-300">Email Notifications</span>
                                            </label>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    name="preferences.notifications.push"
                                                    checked={formData.preferences.notifications.push}
                                                    onChange={handleChange}
                                                    className="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
                                                />
                                                <span className="text-gray-300">Push Notifications</span>
                                            </label>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-300">
                                                Email Notifications: {formData.preferences.notifications.email ? 'Enabled' : 'Disabled'}
                                            </p>
                                            <p className="text-gray-300">
                                                Push Notifications: {formData.preferences.notifications.push ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-4">Privacy Settings</h3>
                                <div className="space-y-3">
                                    {isEditing ? (
                                        <>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    name="preferences.privacySettings.showProfile"
                                                    checked={formData.preferences.privacySettings.showProfile}
                                                    onChange={handleChange}
                                                    className="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
                                                />
                                                <span className="text-gray-300">Show Profile to Others</span>
                                            </label>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    name="preferences.privacySettings.showDonations"
                                                    checked={formData.preferences.privacySettings.showDonations}
                                                    onChange={handleChange}
                                                    className="form-checkbox text-blue-500 rounded bg-gray-700 border-gray-600"
                                                />
                                                <span className="text-gray-300">Show Donations History</span>
                                            </label>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-300">
                                                Profile Visibility: {formData.preferences.privacySettings.showProfile ? 'Public' : 'Private'}
                                            </p>
                                            <p className="text-gray-300">
                                                Donations Visibility: {formData.preferences.privacySettings.showDonations ? 'Public' : 'Private'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-end"
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-500"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </motion.div>
                    )}
                </form>
            </div>
        </motion.div>
    );
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
};

export default DonorProfile; 