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
import { toast } from 'react-toastify';

const DonationForm = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        foodType: '',
        quantity: '',
        expiryDate: '',
        pickupTime: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            // Validate required fields
            const requiredFields = ['foodType', 'quantity', 'expiryDate', 'pickupTime'];
            for (const field of requiredFields) {
                if (!formData[field]) {
                    throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                }
            }

            // Validate dates
            const now = new Date();
            const expiry = new Date(formData.expiryDate);
            const pickup = new Date(formData.pickupTime);

            if (expiry < now) {
                throw new Error('Expiry date cannot be in the past');
            }

            if (pickup < now) {
                throw new Error('Pickup time cannot be in the past');
            }

            if (pickup > expiry) {
                throw new Error('Pickup time must be before expiry date');
            }

            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error.message || 'Failed to save donation');
        } finally {
            setLoading(false);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        }
    };

    return (
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
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 max-w-lg w-full mx-4 border border-gray-700"
            >
                <h2 className="text-2xl font-bold text-white mb-6">
                    {initialData ? 'Edit Donation' : 'Create New Donation'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
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
                    </div>

                    <div>
<<<<<<< HEAD
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
=======
                        <label className="block text-gray-300 mb-2">Description (Optional)</label>
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
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
                </form>
            </motion.div>
        </div>
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
