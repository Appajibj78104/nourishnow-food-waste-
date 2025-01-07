import axios from 'axios';

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
        throw error;
    }
};

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
        throw error;
    }
};

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
        throw error;
    }
};

// Delete a donation
export const deleteDonation = async (id) => {
    try {
        const response = await axios.delete(
            `${API_URL}/donations/${id}`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
