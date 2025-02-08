import axios from 'axios';

const API_URL = '/ngo';

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getVolunteers = async () => {
    try {
        const response = await axios.get(`${API_URL}/volunteers`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addVolunteer = async (volunteerData) => {
    try {
        const response = await axios.post(API_URL, volunteerData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateVolunteer = async (id, volunteerData) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}`,
            volunteerData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteVolunteer = async (id) => {
    try {
        const response = await axios.delete(
            `${API_URL}/${id}`,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const assignVolunteer = async (volunteerId, assignmentData) => {
    try {
        const response = await axios.post(
            `${API_URL}/${volunteerId}/assign`,
            assignmentData,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateAssignmentStatus = async (volunteerId, assignmentId, status) => {
    try {
        const response = await axios.put(
            `${API_URL}/${volunteerId}/assignment-status`,
            { assignmentId, status },
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addVolunteerFeedback = async (volunteerId, feedback) => {
    try {
        const response = await axios.post(
            `${API_URL}/${volunteerId}/feedback`,
            feedback,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};