import axios from 'axios';

const API_URL = '/api/donor';

const broadcastService = {
    getBroadcasts: async () => {
        try {
            const response = await axios.get(`${API_URL}/broadcasts`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch broadcasts' };
        }
    },

    createBroadcast: async (broadcastData) => {
        try {
            const response = await axios.post(
                `${API_URL}/broadcasts`,
                broadcastData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create broadcast' };
        }
    }
};

export default broadcastService; 