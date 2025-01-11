const api = require('./api');
const axios = require('axios');

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

    getAnalytics: async (params) => {
        const response = await api.get('/admin/analytics', { params });
        return response.data;
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
    }
};

module.exports = adminService; 