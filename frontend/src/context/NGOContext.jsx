import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NGOContext = createContext();

export const NGOProvider = ({ children }) => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);

    const updateDashboardData = useCallback(async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/ngo/dashboard`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }, []);

    return (
        <NGOContext.Provider value={{ user, dashboardData, updateDashboardData }}>
            {children}
        </NGOContext.Provider>
    );
};

export const useNGO = () => useContext(NGOContext); 