import axios from 'axios';

// Remove /api from the base URL since it's handled by the proxy
const API_URL = '/ngo';

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

// Get real-time dashboard stats
export const getDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/stats`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get NGO Donations
export const getDonations = async () => {
    try {
        const response = await axios.get(`${API_URL}/donations`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Inventory Management
export const getInventory = async () => {
    try {
        const response = await axios.get('/api/ngo/inventory', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch inventory' };
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
        console.error('Service error:', error.response || error);
        throw error.response?.data || { message: 'Failed to add inventory item' };
    }
};

export const updateInventoryItem = async (id, itemData) => {
    try {
        const response = await axios.put(`${API_URL}/inventory/${id}`, itemData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
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
        throw error.response?.data || { message: 'Failed to delete inventory item' };
    }
};

// Update NGO Profile
export const updateNGOProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}/profile`, profileData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Upload NGO Document
export const uploadDocument = async (type, file) => {
    try {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('type', type);

        const response = await axios.post(
            `${API_URL}/upload-document`,
            formData,
            {
                headers: {
                    ...getAuthHeader().headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
// Get NGO analytics data
export const getAnalytics = async (timeframe = 'week') => {
    try {
        const response = await axios.get(`/api/ngo/dashboard/analytics?timeframe=${timeframe}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching NGO analytics:', error);
        throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
};
// Get NGO stats
export const getNGOStats = async () => {
    try {
        const response = await axios.get('/api/ngo/stats', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching NGO stats:', error);
        throw error.response?.data || { message: 'Failed to fetch NGO stats' };
    }
};

// Get Nearby Donations
export const getNearbyDonations = async () => {
    try {
        const response = await axios.get(`${API_URL}/nearby-donations`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Accept donation
export const acceptDonation = async (donationId) => {
    try {
        const response = await axios.post(
            `${API_URL}/donations/${donationId}/accept`,
            {},
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Reject donation
export const rejectDonation = async (donationId) => {
    try {
        const response = await axios.post(
            `${API_URL}/donations/${donationId}/reject`,
            {},
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Broadcasts
export const getBroadcasts = async () => {
    try {
        const response = await axios.get('/api/ngo/broadcasts', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        throw error.response?.data || { message: 'Failed to fetch broadcasts' };
    }
};

export const createBroadcast = async (broadcastData) => {
    try {
        const response = await axios.post(
            '/api/ngo/broadcasts',
            broadcastData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating broadcast:', error);
        throw error.response?.data || { message: 'Failed to create broadcast' };
    }
};

// Subscribe to real-time updates
export const subscribeToStats = (socket, callback) => {
    if (!socket) return;
    
    socket.on('stats:update', (stats) => {
        callback(stats);
    });
    
    return () => {
        socket.off('stats:update');
    };
};

// Get Volunteers
export const getVolunteers = async () => {
    try {
        const response = await axios.get(`${API_URL}/volunteers`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
export const updateDonationStatus = async (donationId, status) => {
    try {
        console.log(`Updating donation ID: ${donationId}, Status: ${status}`);
        
        const response = await axios.patch(
            `${API_URL}/donations/${donationId}/status`,  // Use consistent base URL
            { status }, 
            getAuthHeader()
        );

        console.log("Update Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating donation status:", error.response?.data || error.message);
        throw error;
    }
};

export const getAcceptedDonations = async () => {
    try {
        const response = await axios.get(`${API_URL}/donations/accepted`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default {
    getDashboardStats,
    getDonations,
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateNGOProfile,
    uploadDocument, // ✅ Ensure this is included
    getNGOStats,
    getNearbyDonations,
    acceptDonation,
    rejectDonation,
    getAnalytics,
    getBroadcasts,
    createBroadcast,
    subscribeToStats,
    getVolunteers,
    updateDonationStatus,
    getAcceptedDonations // ✅ Also make sure this is included
};
