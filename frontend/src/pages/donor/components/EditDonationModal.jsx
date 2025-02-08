import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { updateDonation } from '../services/donorService';

const EditDonationModal = ({ donation, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        foodType: donation.foodType || '',
        quantity: donation.quantity || '',
        quantityUnit: donation.quantityUnit || '',
        expiryDate: donation.expiryDate?.split('T')[0] || '',
        pickupTime: donation.pickupTime?.split('T')[0] || '',
        description: donation.description || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDonation(donation._id, formData);
            toast.success('Donation updated successfully');
            onUpdate(); // Refresh the donations list
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating donation:', error);
            toast.error('Failed to update donation');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-4 text-white">Edit Donation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Food Type</label>
                        <select
                            name="foodType"
                            value={formData.foodType}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="cooked">Cooked Food</option>
                            <option value="packaged">Packaged Food</option>
                            <option value="raw">Raw Ingredients</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Unit</label>
                            <select
                                name="quantityUnit"
                                value={formData.quantityUnit}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                                required
                            >
                                <option value="">Select Unit</option>
                                <option value="kg">Kilograms</option>
                                <option value="servings">Servings</option>
                                <option value="packets">Packets</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Expiry Date</label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Pickup Time</label>
                            <input
                                type="datetime-local"
                                name="pickupTime"
                                value={formData.pickupTime}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                        >
                            Update Donation
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditDonationModal; 