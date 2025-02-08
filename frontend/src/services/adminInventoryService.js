import axios from 'axios';

const API_URL = '/api/admin';

const adminInventoryService = {
    getInventory: async () => {
        try {
            const response = await axios.get(`${API_URL}/inventory`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch inventory' };
        }
    },

    addInventoryItem: async (itemData) => {
        try {
            const response = await axios.post(`${API_URL}/inventory`, itemData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to add inventory item' };
        }
    },

    updateInventoryItem: async (id, itemData) => {
        try {
            const response = await axios.put(`${API_URL}/inventory/${id}`, itemData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update inventory item' };
        }
    },

    deleteInventoryItem: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/inventory/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete inventory item' };
        }
    },

    getInventoryStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/inventory/stats`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch inventory stats' };
        }
    },

    getNGOs: async () => {
        try {
            const response = await axios.get(`${API_URL}/inventory/ngos`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch NGOs' };
        }
    }
};

export default adminInventoryService; 