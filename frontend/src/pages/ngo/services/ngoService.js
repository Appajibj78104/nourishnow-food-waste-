import axios from 'axios';

export const getDashboardStats = async () => {
    try {
        const response = await axios.get('/api/ngo/dashboard-stats', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching NGO stats:', error);
        throw error;
    }
};

export const getDonations = async () => {
    try {
        const response = await axios.get('/api/ngo/donations', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching donations:', error);
        throw error;
    }
};

export const getVolunteers = async () => {
    try {
        const response = await axios.get('/api/ngo/volunteers', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        throw error;
    }
};

export const getAvailableDonations = async () => {
    try {
        const response = await axios.get('/api/ngo/available-donations', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching available donations:', error);
        throw error;
    }
};

export const acceptDonation = async (donationId) => {
    try {
        const response = await axios.post(`/api/ngo/donations/${donationId}/accept`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error accepting donation:', error);
        throw error.response?.data || error;
    }
};

export const rejectDonation = async (donationId, reason) => {
    try {
        const response = await axios.post(`/api/ngo/donations/${donationId}/reject`, 
            { reason },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error rejecting donation:', error);
        throw error.response?.data || error;
    }
};

export const updateDonationStatus = async (donationId, status) => {
    try {
        const response = await axios.put(`/api/ngo/donations/${donationId}/status`, {
            status
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating donation status:', error);
        throw error;
    }
};

export const getAcceptedDonations = async () => {
    try {
        const response = await axios.get('/api/ngo/donations/active', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching accepted donations:', error);
        throw error;
    }
};

export const assignVolunteer = async (donationId, volunteerName) => {
    try {
        const response = await axios.post(
            `/api/ngo/donations/${donationId}/assign-volunteer`,
            { volunteerName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error assigning volunteer:', error);
        throw error.response?.data || { message: 'Failed to assign volunteer' };
    }
};

export const getInventory = async () => {
    try {
        const response = await axios.get('/api/ngo/inventory', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

export const addInventoryItem = async (itemData) => {
    try {
        const response = await axios.post('/api/ngo/inventory', itemData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding inventory item:', error);
        throw error;
    }
};

export const updateInventoryItem = async (id, itemData) => {
    try {
        const response = await axios.put(`/api/ngo/inventory/${id}`, itemData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating inventory item:', error);
        throw error;
    }
};

export const deleteInventoryItem = async (id) => {
    try {
        const response = await axios.delete(`/api/ngo/inventory/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        throw error;
    }
};

export const getBroadcasts = async () => {
    try {
        const response = await axios.get('/api/ngo/broadcasts', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        throw error;
    }
};

export const createBroadcast = async (broadcastData) => {
    try {
        const response = await axios.post('/api/ngo/broadcasts', broadcastData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating broadcast:', error);
        throw error;
    }
};

export const deleteBroadcast = async (id) => {
    try {
        const response = await axios.delete(`/api/ngo/broadcasts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting broadcast:', error);
        throw error;
    }
};

export const completeDonation = async (donationId) => {
    try {
        const response = await axios.post(`/api/ngo/donations/${donationId}/complete`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to complete donation' };
    }
}; 