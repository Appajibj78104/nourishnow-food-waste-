import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export const register = async (userData) => {
    return await axios.post('http://localhost:5000/api/auth/register', userData);
};
export const login = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message); // Log error details
        throw error;
    }
};

