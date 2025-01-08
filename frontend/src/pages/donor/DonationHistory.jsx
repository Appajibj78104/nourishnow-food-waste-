import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DonationHistory = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/donations/donor/me`,
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

        fetchDonations();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-white">Donation History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map(donation => (
                    <div key={donation._id} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-2">{donation.foodType}</h3>
                        <p className="text-gray-300">Quantity: {donation.quantity} {donation.quantityUnit}</p>
                        <p className="text-gray-300">Status: {donation.status}</p>
                        <p className="text-gray-300">Created: {new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonationHistory; 