import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios with token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// NGO Registration
export const registerNGO = async (ngoData) => {
    try {
        const formData = new FormData();
        Object.keys(ngoData).forEach(key => {
            if (key === 'documents') {
                Object.keys(ngoData.documents).forEach(docKey => {
                    if (ngoData.documents[docKey]) {
                        formData.append(`documents.${docKey}`, ngoData.documents[docKey]);
                    }
                });
            } else {
                formData.append(key, ngoData[key]);
            }
        });

        const response = await axios.post(`${API_URL}/ngo/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get NGO Dashboard Data
export const getDashboardData = async () => {
    try {
        const response = await axios.get(`${API_URL}/ngo/dashboard`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get Nearby Donations
export const getNearbyDonations = async () => {
    try {
        const response = await axios.get(`${API_URL}/ngo/nearby-donations`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update NGO Profile
export const updateNGOProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}/ngo/profile`, profileData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Handle Donation Request
export const handleDonationRequest = async (donationId, action) => {
    try {
        const response = await axios.post(
            `${API_URL}/ngo/donations/${donationId}/${action}`,
            {},
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update Inventory
export const updateInventory = async (inventoryData) => {
    try {
        const response = await axios.put(
            `${API_URL}/ngo/inventory`,
            inventoryData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Send Broadcast
export const sendBroadcast = async (broadcastData) => {
    try {
        const response = await axios.post(
            `${API_URL}/ngo/broadcasts`,
            broadcastData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}; 