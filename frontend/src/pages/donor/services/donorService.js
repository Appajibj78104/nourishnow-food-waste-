import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://localhost:5000/api';

// Configure axios with token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get donor statistics
export const getDonorStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/donor/stats`, getAuthHeader());
        return response.data;
    } catch (error) {
=======
const API_URL = '/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: token }
    };
};

// Get donor's donations
export const getDonations = async () => {
    try {
        const response = await axios.get('/api/donations', getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching donations:', error);
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        throw error;
    }
};

// Get donor statistics
export const getDonorStats = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const config = {
            headers: {
                'Authorization': token
            }
        };

        const response = await axios.get('/api/donations/stats', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        throw error;
    }
};

<<<<<<< HEAD
// Get all donations for the donor
export const getDonations = async () => {
    try {
        const response = await axios.get(`${API_URL}/donations/donor`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new donation
export const createDonation = async (donationData) => {
    try {
        const formData = new FormData();
        Object.keys(donationData).forEach(key => {
            if (key === 'images') {
                donationData.images.forEach(image => {
                    formData.append('images', image);
                });
            } else {
                formData.append(key, donationData[key]);
            }
        });

        const response = await axios.post(
            `${API_URL}/donations`,
            formData,
            {
                ...getAuthHeader(),
                headers: {
                    ...getAuthHeader().headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
=======
// Create donation
export const createDonation = async (donationData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const config = {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        };

        console.log('Making donation request with:', {
            data: donationData,
            config
        });

        const response = await axios.post('/api/donations', donationData, config);
        return response.data;
    } catch (error) {
        console.error('Donation creation error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        throw error;
    }
};

<<<<<<< HEAD
// Update a donation
export const updateDonation = async (id, donationData) => {
    try {
        const response = await axios.put(
            `${API_URL}/donations/${id}`,
            donationData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
=======
// Update donor profile
export const updateProfile = async (profileData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const config = {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.put('/api/donor/profile', profileData, config);
        
        // Update local storage with new user data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error.response?.data || error;
    }
};

// Get leaderboard data
export const getLeaderboard = async (timeframe = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/donor/leaderboard?timeframe=${timeframe}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get donor's donations
export const getDonorDonations = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const config = {
            headers: {
                'Authorization': token
            }
        };

        const response = await axios.get('/api/donations/my-donations', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching donations:', error);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        throw error;
    }
};

<<<<<<< HEAD
// Delete a donation
export const deleteDonation = async (id) => {
    try {
        const response = await axios.delete(
            `${API_URL}/donations/${id}`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
=======
// Edit donation
export const editDonation = async (id, donationData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const config = {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.put(`/api/donations/${id}`, donationData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating donation:', error);
        throw error;
    }
};

// Delete donation
export const deleteDonation = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const config = {
            headers: {
                'Authorization': token
            }
        };

        const response = await axios.delete(`/api/donations/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Error deleting donation:', error);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        throw error;
    }
};
