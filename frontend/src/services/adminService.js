import axios from 'axios';

const API_URL = '/api/admin';

const adminService = {
    getAdminDashboardData: async () => {
        const [statsRes, activityRes, notificationsRes] = await Promise.all([
            api.get('/admin/dashboard/stats'),
            api.get('/admin/dashboard/recent-activity'),
            api.get('/admin/notifications')
        ]);

        return {
            stats: statsRes.data,
            recentActivity: activityRes.data,
            notifications: notificationsRes.data
        };
    },

    getUsers: async (params) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    updateUserStatus: async (userId, status) => {
        const response = await api.patch(`/admin/users/${userId}/status`, { status });
        return response.data;
    },

    getNGOVerificationRequests: async () => {
        const response = await api.get('/admin/ngo/verification-requests');
        return response.data;
    },

    verifyNGO: async (ngoId, data) => {
        const response = await api.patch(`/admin/ngo/${ngoId}/verify`, data);
        return response.data;
    },

    getDonationStats: async (params) => {
        const response = await api.get('/admin/donations/stats', { params });
        return response.data;
    },

    getAnalytics: async (timeframe = 'month') => {
        try {
            const response = await axios.get(`/api/admin/dashboard/analytics?timeframe=${timeframe}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error.response?.data || { message: 'Failed to fetch analytics' };
        }
    },

    updateSystemSettings: async (settings) => {
        const response = await api.patch('/admin/settings', settings);
        return response.data;
    },

    getFeedback: async (params) => {
        const response = await api.get('/admin/feedback', { params });
        return response.data;
    },

    getRealTimeMetrics: async () => {
        const response = await axios.get('/api/admin/metrics/realtime');
        return response.data;
    },

    subscribeToMetrics: (socket) => {
        socket.on('systemMetrics', (data) => {
            // Handle real-time metrics
        });
    },

    getSystemHealth: async () => {
        const response = await axios.get('/api/admin/system/health');
        return response.data;
    },

    getDashboardStats: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No auth token found');
            }

            const response = await axios.get(`${API_URL}/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
        }
    },

    getAllUsers: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No auth token found');
            }

            const response = await axios.get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error.response?.data || { message: 'Failed to fetch users' };
        }
    },

    verifyUser: async (userId, isNGO = false) => {
        try {
            const response = await axios.patch(
                `${API_URL}/users/${userId}/verify`,
                { isNGO },
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateUserStatus: async (userId, status) => {
        try {
            const response = await axios.patch(
                `${API_URL}/users/${userId}/status`,
                { status },
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAllDonations: async () => {
        try {
            const response = await axios.get(`${API_URL}/donations`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch donations' };
        }
    },

    getVerifiedNGOs: async () => {
        try {
            const response = await axios.get(`${API_URL}/ngos/verified`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch NGOs' };
        }
    },

    assignDonation: async (donationId, ngoId) => {
        try {
            const response = await axios.patch(
                `${API_URL}/donations/${donationId}/assign`,
                { ngoId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to assign donation' };
        }
    },

    updateDonationStatus: async (donationId, status) => {
        try {
            const response = await axios.patch(
                `${API_URL}/donations/${donationId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update status' };
        }
    },

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

export default adminService; 