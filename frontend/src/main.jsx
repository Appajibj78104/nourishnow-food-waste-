import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NGOProvider } from './context/NGOContext';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <SocketProvider>
                <NGOProvider>
                    <App />
                    <ToastContainer />
                </NGOProvider>
            </SocketProvider>
        </AuthProvider>
    </React.StrictMode>
);
