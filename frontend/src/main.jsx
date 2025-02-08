import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
<<<<<<< HEAD
=======
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NGOProvider } from './context/NGOContext';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import axios from 'axios';

<<<<<<< HEAD
=======
const emotionCache = createCache({
  key: 'emotion-cache',
  prepend: true,
});

<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
// Set default base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

// Add request interceptor to add token
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <SocketProvider>
                <NGOProvider>
<<<<<<< HEAD
                    <App />
                    <ToastContainer />
=======
                    <CacheProvider value={emotionCache}>
                        <App />
                        <ToastContainer />
                    </CacheProvider>
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                </NGOProvider>
            </SocketProvider>
        </AuthProvider>
    </React.StrictMode>
);
