import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDonationById, updateDonation } from './services/donorService';

const EditDonation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        foodType: '',
        quantity: '',
        unit: '',
        expiryDate: '',
        pickupTime: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const donation = await getDonationById(id);
                setFormData({
                    foodType: donation.foodType,
                    quantity: donation.quantity,
                    unit: donation.unit,
                    expiryDate: donation.expiryDate.split('T')[0],
                    pickupTime: donation.pickupTime.split('T')[0],
                    description: donation.description || ''
                });
            } catch (error) {
                console.error('Error fetching donation:', error);
                toast.error('Failed to fetch donation details');
                navigate('/donor/donations');
            } finally {
                setLoading(false);
            }
        };

        fetchDonation();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDonation(id, formData);
            toast.success('Donation updated successfully');
            navigate('/donor/donations');
        } catch (error) {
            console.error('Error updating donation:', error);
            toast.error('Failed to update donation');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Edit Donation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Add your form fields here similar to CreateDonation component */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Update Donation
                </button>
            </form>
        </div>
    );
};

export default EditDonation; 