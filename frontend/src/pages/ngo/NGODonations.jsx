import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { getDonations } from './services/ngoService';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import DonationsList from './components/DonationsList';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className="text-center p-6 bg-red-50 rounded-lg">
        <h2 className="text-red-600 text-xl font-bold mb-4">Something went wrong:</h2>
        <pre className="text-red-500 mb-4">{error.message}</pre>
        <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            Try again
        </button>
    </div>
);

const NGODonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    const fetchDonations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDonations();
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch donations');
            }
            
            setDonations(response.data || []);
        } catch (err) {
            console.error('Error fetching donations:', err);
            setError(err.message || 'Failed to fetch donations');
            toast.error('Failed to fetch donations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const filteredDonations = donations.filter(donation => {
        switch (activeTab) {
            case 'pending':
                return donation.status === 'pending';
            case 'active':
                return ['accepted', 'picked_up'].includes(donation.status);
            case 'completed':
                return donation.status === 'completed';
            default:
                return true;
        }
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error}</div>;
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={fetchDonations}>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Donations Management</h1>
                
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'pending'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'active'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === 'completed'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                        Completed
                    </button>
                </div>

                <DonationsList
                    donations={filteredDonations}
                    onStatusUpdate={fetchDonations}
                />
            </div>
        </ErrorBoundary>
    );
};

export default NGODonations;