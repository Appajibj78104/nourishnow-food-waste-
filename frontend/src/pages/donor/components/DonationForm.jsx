<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createDonation } from '../services/donorService';

const DonationForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        type: '',
        quantity: '',
        expiryDate: '',
        pickupDate: '',
        description: '',
        images: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
=======
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
=======
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUtensils, FaBox, FaCarrot, FaQuestionCircle } from 'react-icons/fa';
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
import { toast } from 'react-toastify';

const DonationForm = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        foodType: initialData?.foodType || '',
        quantity: initialData?.quantity || '',
        unit: initialData?.unit || 'kgs',
        expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        pickupTime: initialData?.pickupTime ? new Date(initialData.pickupTime).toISOString().split('T')[0] : '',
        description: initialData?.description || '',
        pickupAddress: {
            street: initialData?.pickupAddress?.street || '',
            district: initialData?.pickupAddress?.district || '',
            state: initialData?.pickupAddress?.state || '',
            pincode: initialData?.pickupAddress?.pincode || ''
        }
    });

    const [loading, setLoading] = useState(false);

<<<<<<< HEAD
    // Initialize form with existing data if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                foodType: initialData.foodType || '',
                quantity: initialData.quantity || '',
                expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().slice(0, 16) : '',
                pickupTime: initialData.pickupTime ? new Date(initialData.pickupTime).toISOString().slice(0, 16) : '',
                description: initialData.description || ''
            });
        }
    }, [initialData]);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
    const foodTypeIcons = {
        cooked: FaUtensils,
        packaged: FaBox,
        raw: FaCarrot,
        other: FaQuestionCircle
    };
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('pickupAddress.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                pickupAddress: {
                    ...prev.pickupAddress,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

<<<<<<< HEAD
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: files
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await createDonation(formData);
            onSubmit(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create donation');
        } finally {
            setIsLoading(false);
=======
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        }
    };

    return (
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111827] rounded-2xl shadow-xl max-w-md w-full p-6 border border-white/10"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        New Donation
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" className="bg-[#111827]">Select type</option>
                            <option value="food" className="bg-[#111827]">Food</option>
                            <option value="clothes" className="bg-[#111827]">Clothes</option>
                            <option value="other" className="bg-[#111827]">Other</option>
=======
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
=======
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    {initialData ? 'Edit Donation' : 'Create New Donation'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Food Type Selection */}
                    <div>
<<<<<<< HEAD
                        <label className="block text-gray-300 mb-2">Food Type</label>
                        <select
                            name="foodType"
                            value={formData.foodType}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Select Food Type</option>
                            <option value="cooked">Cooked Food</option>
                            <option value="packaged">Packaged Food</option>
                            <option value="raw">Raw Ingredients</option>
                            <option value="other">Other</option>
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        </select>
                    </div>

                    <div>
<<<<<<< HEAD
                        <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
=======
                        <label className="block text-gray-300 mb-2">Quantity (servings)</label>
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
<<<<<<< HEAD
                            required
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
=======
                            min="1"
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        />
                    </div>

                    <div>
<<<<<<< HEAD
                        <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
=======
                        <label className="block text-gray-300 mb-2">Expiry Date & Time</label>
                        <input
                            type="datetime-local"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        />
                    </div>

                    <div>
<<<<<<< HEAD
                        <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Date</label>
                        <input
                            type="datetime-local"
                            name="pickupDate"
                            value={formData.pickupDate}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
=======
                        <label className="block text-gray-300 mb-2">Pickup Date & Time</label>
                        <input
                            type="datetime-local"
                            name="pickupTime"
                            value={formData.pickupTime}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        />
=======
                        <label className="text-gray-300 block mb-2">Food Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(foodTypeIcons).map(([type, Icon]) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'foodType', value: type } })}
                                    className={`p-4 rounded-lg border ${
                                        formData.foodType === type
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-gray-600 hover:border-gray-500'
                                    } flex items-center space-x-2`}
                                >
                                    <Icon className="text-gray-400" />
                                    <span className="capitalize text-gray-300">
                                        {type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity and Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-300">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-300">Unit</label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                            >
                                <option value="kgs">Kilograms</option>
                                <option value="items">Items</option>
                                <option value="meals">Meals</option>
                                <option value="packages">Packages</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-300">Expiry Date</label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-300">Pickup Time</label>
                            <input
                                type="datetime-local"
                                name="pickupTime"
                                value={formData.pickupTime}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Pickup Address</h3>
                        
                        <div>
                            <label className="text-gray-300">Street Address</label>
                            <input
                                type="text"
                                name="pickupAddress.street"
                                value={formData.pickupAddress.street}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                                placeholder="Enter street address"
                            />
                        </div>

                        <div>
                            <label className="text-gray-300">District</label>
                            <input
                                type="text"
                                name="pickupAddress.district"
                                value={formData.pickupAddress.district}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                                placeholder="Enter district"
                            />
                        </div>

                        <div>
                            <label className="text-gray-300">State</label>
                            <input
                                type="text"
                                name="pickupAddress.state"
                                value={formData.pickupAddress.state}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                                placeholder="Enter state"
                            />
                        </div>

                        <div>
                            <label className="text-gray-300">Pincode</label>
                            <input
                                type="text"
                                name="pickupAddress.pincode"
                                value={formData.pickupAddress.pincode}
                                onChange={handleChange}
                                pattern="\d{6}"
                                maxLength="6"
                                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                required
                                placeholder="Enter 6-digit pincode"
                            />
                            <small className="text-gray-400">Enter 6-digit pincode</small>
                        </div>
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
                    </div>

                    {/* Description */}
                    <div>
<<<<<<< HEAD
<<<<<<< HEAD
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
=======
                        <label className="block text-gray-300 mb-2">Description (Optional)</label>
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
                        <label className="text-gray-300">Description</label>
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
<<<<<<< HEAD
<<<<<<< HEAD
                            rows="3"
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
=======
                            rows="4"
                            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
<<<<<<< HEAD
                            disabled={isLoading}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create Donation'}
=======
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-3 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (initialData ? 'Update Donation' : 'Create Donation')}
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        </button>
                    </div>
=======
                            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                            rows="3"
                            placeholder="Add any additional details about the donation"
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : initialData ? 'Update Donation' : 'Create Donation'}
                    </motion.button>
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
                </form>
            </motion.div>
        </motion.div>
    );
};

<<<<<<< HEAD
export default DonationForm; 
=======
export default DonationForm;

// Add this CSS to your global styles or component
const styles = `
    input, select, textarea {
        background-color: #1F2937 !important;
        color: white !important;
    }
    
    input::placeholder, textarea::placeholder {
        color: #9CA3AF !important;
    }
    
    input[type="date"], input[type="datetime-local"] {
        color-scheme: dark;
    }
    
    select option {
        background-color: #1F2937 !important;
        color: white !important;
        padding: 8px !important;
    }
    
    select option:hover {
        background-color: #374151 !important;
    }
`;

// Add style tag to the document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet); 
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
