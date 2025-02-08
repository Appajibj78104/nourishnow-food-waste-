import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';

const CreateDonation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        foodType: 'cooked',
        quantity: '',
        quantityUnit: 'servings',
        description: '',
        pickupAddress: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        preferredPickupTime: {
            start: '',
            end: ''
        },
        images: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            
            // Append basic fields
            Object.keys(formData).forEach(key => {
                if (key !== 'images' && key !== 'pickupAddress' && key !== 'preferredPickupTime') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append address
            Object.keys(formData.pickupAddress).forEach(key => {
                formDataToSend.append(`pickupAddress[${key}]`, formData.pickupAddress[key]);
            });

            // Append pickup times
            formDataToSend.append('preferredPickupTime[start]', formData.preferredPickupTime.start);
            formDataToSend.append('preferredPickupTime[end]', formData.preferredPickupTime.end);

            // Append images
            formData.images.forEach(image => {
                formDataToSend.append('images', image);
            });

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/donations`,
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data) {
                navigate('/donor/dashboard');
            }
        } catch (error) {
            console.error('Error creating donation:', error);
=======
import { toast } from 'react-toastify';
import { createDonation } from './services/donorService';

const CreateDonation = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        foodType: 'cooked',
        quantity: '',
        unit: 'servings',
        expiryDate: '',
        pickupTime: '',
        description: '',
        pickupAddress: {
            street: '',
            district: '',
            state: '',
            pincode: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('pickupAddress.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                pickupAddress: {
                    ...prev.pickupAddress,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createDonation(formData);
            toast.success('Donation created successfully!');
            navigate('/donor/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating donation');
        } finally {
            setIsLoading(false);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        }
    };

    return (
<<<<<<< HEAD
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Donation</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Food Type */}
                <div>
                    <label className="block mb-2">Food Type</label>
                    <select
                        value={formData.foodType}
                        onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                        className="w-full p-2 border rounded"
                    >
                        <option value="cooked">Cooked Food</option>
                        <option value="packaged">Packaged Food</option>
                        <option value="raw">Raw Food</option>
                    </select>
                </div>

                {/* Quantity */}
                <div>
                    <label className="block mb-2">Quantity</label>
                    <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Address Fields */}
                <div className="space-y-2">
                    <h3 className="font-bold">Pickup Address</h3>
                    <input
                        type="text"
                        placeholder="Street"
                        value={formData.pickupAddress.street}
                        onChange={(e) => setFormData({
                            ...formData,
                            pickupAddress: {...formData.pickupAddress, street: e.target.value}
                        })}
                        className="w-full p-2 border rounded"
                    />
                    {/* Add other address fields similarly */}
                </div>

                {/* Pickup Time */}
                <div className="space-y-2">
                    <h3 className="font-bold">Preferred Pickup Time</h3>
                    <input
                        type="datetime-local"
                        value={formData.preferredPickupTime.start}
                        onChange={(e) => setFormData({
                            ...formData,
                            preferredPickupTime: {...formData.preferredPickupTime, start: e.target.value}
                        })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block mb-2">Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setFormData({...formData, images: Array.from(e.target.files)})}
                        className="w-full p-2 border rounded"
=======
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Create New Donation</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Food Type */}
                <div>
                    <label className="text-white">Food Type</label>
                    <select
                        name="foodType"
                        value={formData.foodType}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                    >
                        <option value="cooked">Cooked Food</option>
                        <option value="packaged">Packaged Food</option>
                        <option value="raw">Raw Food</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Quantity */}
                <div>
                    <label className="text-white">Quantity (servings)</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                        required
                    />
                </div>

                {/* Unit */}
                <div>
                    <label className="text-white">Unit</label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                        required
                    >
                        <option value="servings">Servings</option>
                        <option value="kgs">Kilograms</option>
                        <option value="items">Items</option>
                        <option value="packages">Packages</option>
                        <option value="meals">Meals</option>
                    </select>
                </div>

                {/* Expiry Date */}
                <div>
                    <label className="text-white">Expiry Date</label>
                    <input
                        type="datetime-local"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                        required
                    />
                </div>

                {/* Pickup Time */}
                <div>
                    <label className="text-white">Pickup Time</label>
                    <input
                        type="datetime-local"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                        required
                    />
                </div>

                {/* Address Fields */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Pickup Address</h3>
                    
                    <div>
                        <label className="text-white">Street Address</label>
                        <input
                            type="text"
                            name="pickupAddress.street"
                            value={formData.pickupAddress.street}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                            required
                            placeholder="Enter street address"
                        />
                    </div>

                    <div>
                        <label className="text-white">District</label>
                        <input
                            type="text"
                            name="pickupAddress.district"
                            value={formData.pickupAddress.district}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                            required
                            placeholder="Enter district"
                        />
                    </div>

                    <div>
                        <label className="text-white">State</label>
                        <input
                            type="text"
                            name="pickupAddress.state"
                            value={formData.pickupAddress.state}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                            required
                            placeholder="Enter state"
                        />
                    </div>

                    <div>
                        <label className="text-white">Pincode</label>
                        <input
                            type="text"
                            name="pickupAddress.pincode"
                            value={formData.pickupAddress.pincode}
                            onChange={handleChange}
                            pattern="\d{6}"
                            maxLength="6"
                            className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                            required
                            placeholder="Enter 6-digit pincode"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="text-white">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600"
                        rows="4"
<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
                        placeholder="Add any additional details about the donation"
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
<<<<<<< HEAD
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Donation
=======
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? 'Creating...' : 'Create Donation'}
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                </button>
            </form>
        </div>
    );
};

export default CreateDonation; 