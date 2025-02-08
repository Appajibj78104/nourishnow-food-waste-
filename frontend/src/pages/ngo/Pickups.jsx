import React, { useState, useEffect } from 'react';
import { getAcceptedDonations, getVolunteers } from './services/ngoService'; // Ensure correct imports
import PickupsList from './components/PickupsList';
import { toast } from 'react-toastify';

const Pickups = () => {
    const [donations, setDonations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const donationsRes = await getAcceptedDonations();
            const volunteersRes = await getVolunteers();

            if (donationsRes.success && volunteersRes.success) {
                setDonations(donationsRes.data);
                setVolunteers(volunteersRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch pickups data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Pickup Management</h1>
            <PickupsList 
                donations={donations}
                onStatusUpdate={fetchData} 
            />
        </div>
    );
};

export default Pickups;
