import React, { createContext, useContext, useState, useCallback } from 'react';
import { getDashboardStats } from '../services/ngoService';

const NGOContext = createContext();

export const NGOProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const updateUser = useCallback((userData) => {
        setUser(userData);
    }, []);

    const updateDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error updating dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <NGOContext.Provider value={{
            user,
            stats,
            loading,
            updateUser,
            updateDashboardData
        }}>
            {children}
        </NGOContext.Provider>
    );
};

export const useNGO = () => {
    const context = useContext(NGOContext);
    if (!context) {
        throw new Error('useNGO must be used within an NGOProvider');
    }
    return context;
}; 