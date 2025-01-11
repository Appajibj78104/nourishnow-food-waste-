import { io } from 'socket.io-client';
// import dotenv from 'dotenv';
// dotenv.config();

let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.REACT_APP_SOCKET_URL, {
            auth: { token: localStorage.getItem('token') }
        });
    }
    return socket;
};

export const monitorSystemMetrics = () => {
    if (socket) {
        socket.emit('getDashboardStats');
    }
};

export const stopMonitoringMetrics = () => {
    if (socket) {
        socket.off('dashboardStats');
    }
};
