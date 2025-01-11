const axios = require('axios');
const { toast } = require('react-toastify');
const { handleAdminError } = require('./errorHandler');

// Request interceptor
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        const customError = handleAdminError(error);
        
        if (customError.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (customError.response?.status === 403) {
            toast.error('You do not have permission to perform this action');
        } else {
            toast.error(customError.message || 'Something went wrong');
        }

        return Promise.reject(customError);
    }
);

module.exports = axios; 