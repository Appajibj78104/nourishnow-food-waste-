import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        }
    };

    return (
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
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Donation
                </button>
            </form>
        </div>
    );
};

export default CreateDonation; 