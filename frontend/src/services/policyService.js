const policyService = {
    getPolicies: async () => {
        const response = await axios.get('/api/admin/policies');
        return response.data;
    },

    updatePolicy: async (policyData) => {
        const response = await axios.patch('/api/admin/policies', policyData);
        return response.data;
    }
};

module.exports = policyService; 