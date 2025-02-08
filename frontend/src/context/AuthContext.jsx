import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { checkFirstTimeLogin } from '../utils/authUtils';
<<<<<<< HEAD
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
=======

// Create the context
const AuthContext = createContext(null);

// Export the hook first
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Export the provider component
export function AuthProvider({ children }) {
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

<<<<<<< HEAD
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
=======
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { token, user } = response.data;
            
            // Add Bearer prefix to token
            const tokenWithBearer = `Bearer ${token}`;
            localStorage.setItem('token', tokenWithBearer);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Set default auth header
            axios.defaults.headers.common['Authorization'] = tokenWithBearer;
            
            setUser(user);
            setIsAuthenticated(true);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    };

    const logout = () => {
        localStorage.removeItem('token');
<<<<<<< HEAD
=======
        localStorage.removeItem('user');
        setAuthToken(null);
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
        setUser(null);
        setIsAuthenticated(false);
    };

<<<<<<< HEAD
=======
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!token || !storedUser) {
                setLoading(false);
                return;
            }

            // Ensure token has Bearer prefix
            const tokenWithBearer = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            // Set token in axios headers
            axios.defaults.headers.common['Authorization'] = tokenWithBearer;

            // Set initial state from localStorage
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            console.error('Auth check failed:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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

<<<<<<< HEAD
=======
    // Add this function to check token
    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        return token?.startsWith('Bearer ') ? token : token ? `Bearer ${token}` : null;
    };

    const updateUser = (userData) => {
        try {
            // Update context state
            setUser(userData);
            
            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
    if (loading) {
        return <div>Loading...</div>;
    }

<<<<<<< HEAD
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
=======
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuthStatus,
        completeProfile,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
