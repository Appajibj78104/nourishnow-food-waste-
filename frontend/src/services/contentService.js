const contentService = {
    getContent: async (type) => {
        const response = await axios.get(`/api/admin/content?type=${type}`);
        return response.data;
    },

    createContent: async (contentData) => {
        const response = await axios.post('/api/admin/content', contentData);
        return response.data;
    },

    updateContent: async (id, contentData) => {
        const response = await axios.patch(`/api/admin/content/${id}`, contentData);
        return response.data;
    },

    deleteContent: async (id) => {
        const response = await axios.delete(`/api/admin/content/${id}`);
        return response.data;
    }
};

module.exports = contentService; 