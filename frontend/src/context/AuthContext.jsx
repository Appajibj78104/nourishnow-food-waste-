import React, { createContext, useState } from 'react';
import { login} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const handleLogin = async (credentials) => {
        const response = await login(credentials);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;