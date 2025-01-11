import  io from 'socket.io-client';
import { toast } from 'react-toastify';

let socket = null;

const initializeSocket = (token) => {
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

const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Chat events
const joinChat = (chatId) => {
    if (socket) {
        socket.emit('joinChat', chatId);
    }
};

const leaveChat = (chatId) => {
    if (socket) {
        socket.emit('leaveChat', chatId);
    }
};

const sendMessage = (chatId, content) => {
    if (socket) {
        socket.emit('sendMessage', { chatId, content });
    }
};

const emitTyping = (chatId) => {
    if (socket) {
        socket.emit('typing', { chatId });
    }
};

// Donation events
const notifyDonationCreated = (donation) => {
    if (socket) {
        socket.emit('donationCreated', donation);
    }
};

// Get socket instance
 const getSocket = () => socket;

export default {
    initializeSocket,
    disconnectSocket,
    joinChat,
    leaveChat,
    sendMessage,
    emitTyping,
    notifyDonationCreated,
    getSocket
}; 