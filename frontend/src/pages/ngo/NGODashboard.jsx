import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useNGO } from '../../context/NGOContext';
import RealTimeDashboard from './components/RealTimeDashboard';
import DonationTracker from '../../components/Donations/DonationTracker';
import { toast } from 'react-toastify';

const NGODashboard = () => {
    const { socket } = useSocket();
    const { user, updateDashboardData } = useNGO();
    const [activeDonations, setActiveDonations] = useState([]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new donations
        socket.on('newDonation', (data) => {
            toast.info(`New donation available: ${data.donation.foodType}`);
            updateDashboardData();
        });

        // Listen for donation status updates
        socket.on('donationStatusUpdate', (data) => {
            setActiveDonations(prev => 
                prev.map(donation => 
                    donation._id === data.donationId 
                        ? { ...donation, status: data.status }
                        : donation
                )
            );
        });

        // Listen for chat messages
        socket.on('newMessage', (data) => {
            toast.info(`New message from ${data.sender.name}`);
        });

        // Listen for urgent broadcasts
        socket.on('urgentBroadcast', (data) => {
            toast.warning(data.message, {
                autoClose: false,
                closeButton: true
            });
        });

        return () => {
            socket.off('newDonation');
            socket.off('donationStatusUpdate');
            socket.off('newMessage');
            socket.off('urgentBroadcast');
        };
    }, [socket, updateDashboardData]);

    // Join NGO-specific room
    useEffect(() => {
        if (socket && user?._id) {
            socket.emit('joinNGORoom', user._id);
        }
    }, [socket, user?._id]);

    return (
        <div className="min-h-screen bg-[#111827] text-white p-8">
            <RealTimeDashboard user={user} />
            
            {/* Active Donations */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Active Donations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeDonations.map(donation => (
                        <DonationTracker 
                            key={donation._id} 
                            donation={donation}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NGODashboard; 