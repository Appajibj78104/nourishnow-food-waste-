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
        foodType: '',
        quantity: '',
        expiryDate: '',
        pickupTime: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate form data
            if (!formData.foodType || !formData.quantity || !formData.expiryDate || !formData.pickupTime) {
                throw new Error('Please fill in all required fields');
            }

            console.log('Submitting donation with data:', formData);
            const response = await createDonation(formData);
            
            toast.success('Donation created successfully!');
            navigate('/donor/dashboard');
        } catch (error) {
            console.error('Error creating donation:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to create donation');
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
            <h2 className="text-2xl font-bold mb-6">Create New Donation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">Food Type</label>
                    <select
                        name="foodType"
                        value={formData.foodType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Food Type</option>
                        <option value="cooked">Cooked Food</option>
                        <option value="packaged">Packaged Food</option>
                        <option value="raw">Raw Ingredients</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Quantity (servings)</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block mb-2">Expiry Date</label>
                    <input
                        type="datetime-local"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Pickup Time</label>
                    <input
                        type="datetime-local"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="4"
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                    />
                </div>

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