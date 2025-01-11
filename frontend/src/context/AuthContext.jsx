import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { checkFirstTimeLogin } from '../utils/authUtils';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/auth/status`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                const userData = response.data.user;
                const isFirstTime = checkFirstTimeLogin(userData);
                setUser({ ...userData, isFirstTime });
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            { email, password }
        );
        const userData = response.data.user;
        const isFirstTime = checkFirstTimeLogin(userData);
        localStorage.setItem('token', response.data.token);
        setUser({ ...userData, isFirstTime });
        setIsAuthenticated(true);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const completeProfile = async (profileData) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/donor/profile`,
                profileData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setUser(prev => ({
                ...prev,
                ...response.data.user,
                profileCompleted: true,
                isFirstTime: false
            }));
            return response.data;
        } catch (error) {
            console.error('Profile completion failed:', error);
            throw error;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            checkAuthStatus,
            completeProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 