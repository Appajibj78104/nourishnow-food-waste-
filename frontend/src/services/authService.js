import axios from 'axios';

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Register NGO
export const registerNGO = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register/ngo`, formData);
=======
// Use the proxy from vite.config.js
const API_URL = '/api/auth';  // Changed from '/api'

// Register NGO
export const registerNGO = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/register/ngo`, formData);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Login
export const login = async (credentials) => {
    try {
<<<<<<< HEAD
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
=======
        console.log('Attempting login with:', credentials);
        
        const response = await axios.post(`${API_URL}/login`, credentials);
        console.log('Login response:', response.data);
        
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
<<<<<<< HEAD
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
=======
        
        return response.data;
    } catch (error) {
        console.error('Login error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        throw error.response?.data || { message: 'Login failed. Please try again.' };
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    }
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Check Auth Status
export const checkAuthStatus = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

<<<<<<< HEAD
        const response = await axios.get(`${API_URL}/auth/status`, {
=======
        const response = await axios.get(`${API_URL}/status`, {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        logout();
        throw error.response?.data || error.message;
    }
};

