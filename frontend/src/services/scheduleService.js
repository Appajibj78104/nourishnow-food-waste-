import axios from 'axios';

const API_URL = '/api/ngo/schedules';

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const createSchedule = async (scheduleData) => {
    try {
        const response = await axios.post(API_URL, scheduleData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getSchedules = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateScheduleStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/status`, { status }, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteSchedule = async (id) => {
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

export const acceptDonation = async (donationId) => {
    try {
        const response = await axios.patch(`${API_URL}/${donationId}/status`, { status: 'accepted' }, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};