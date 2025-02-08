<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
=======
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DonationList from './components/DonationList';
<<<<<<< HEAD
import { getDonorDonations } from './services/donorService';
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
import EditDonationModal from './components/EditDonationModal';
import { getDonorDonations, deleteDonation } from './services/donorService';
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)

const DonationHistory = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD
<<<<<<< HEAD
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
=======

    useEffect(() => {
        fetchDonations();
    }, []);
=======
    const [editingDonation, setEditingDonation] = useState(null);
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)

    const fetchDonations = async () => {
        try {
            const data = await getDonorDonations();
            setDonations(data);
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast.error('Failed to fetch donations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleEdit = (donationId) => {
        const donation = donations.find(d => d._id === donationId);
        setEditingDonation(donation);
    };

    const handleDelete = async (donationId) => {
        if (window.confirm('Are you sure you want to delete this donation?')) {
            try {
                await deleteDonation(donationId);
                toast.success('Donation deleted successfully');
                fetchDonations();
            } catch (error) {
                console.error('Error deleting donation:', error);
                toast.error('Failed to delete donation');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Donation History</h1>
            <DonationList 
                donations={donations} 
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======

            {editingDonation && (
                <EditDonationModal
                    donation={editingDonation}
                    onClose={() => setEditingDonation(null)}
                    onUpdate={fetchDonations}
                />
            )}
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
        </div>
    );
};

export default DonationHistory; 