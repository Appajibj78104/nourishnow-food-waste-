import io from 'socket.io-client';
import { toast } from 'react-toastify';

let socket = null;

export const initializeSocket = (token) => {
    if (socket) return socket;

    socket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: { token }
    });

    // Connection events
    socket.on('connect', () => {
        console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Connection error. Please try again.');
    });

    // Error handling
    socket.on('error', (error) => {
        console.error('Socket error:', error);
        toast.error(error.message || 'An error occurred');
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Chat events
export const joinChat = (chatId) => {
    if (socket) {
        socket.emit('joinChat', chatId);
    }
};

export const leaveChat = (chatId) => {
    if (socket) {
        socket.emit('leaveChat', chatId);
    }
};

export const sendMessage = (chatId, content) => {
    if (socket) {
        socket.emit('sendMessage', { chatId, content });
    }
};

export const emitTyping = (chatId) => {
    if (socket) {
        socket.emit('typing', { chatId });
    }
};

// Donation events
export const notifyDonationCreated = (donation) => {
    if (socket) {
        socket.emit('donationCreated', donation);
    }
};

// Get socket instance
export const getSocket = () => socket; 