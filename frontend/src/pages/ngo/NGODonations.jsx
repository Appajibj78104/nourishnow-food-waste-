import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NGODonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/ngo/donations`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setDonations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching donations:', error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (donationId, status) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/donations/${donationId}/status`,
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            fetchDonations();
        } catch (error) {
            console.error('Error updating donation status:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Donations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {donations.map(donation => (
                    <div key={donation._id} className="bg-white p-4 rounded shadow">
                        <h2 className="font-bold">{donation.foodType}</h2>
                        <p>Quantity: {donation.quantity} {donation.quantityUnit}</p>
                        <p>Status: {donation.status}</p>
                        {donation.status === 'pending' && (
                            <button
                                onClick={() => handleStatusUpdate(donation._id, 'accepted')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                            >
                                Accept
                            </button>
                        )}
                        {donation.status === 'accepted' && (
                            <button
                                onClick={() => handleStatusUpdate(donation._id, 'completed')}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                            >
                                Complete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NGODonations; 