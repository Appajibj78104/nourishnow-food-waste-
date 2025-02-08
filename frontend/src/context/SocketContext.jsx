import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        let newSocket = null;

        if (user) {
            // Initialize socket connection
            newSocket = io('http://localhost:5000', {
                auth: {
                    token: localStorage.getItem('token')
                }
            });

            // Set up event listeners
            newSocket.on('connect', () => {
                console.log('Socket connected');
                newSocket.emit('userConnected', user._id);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            setSocket(newSocket);
        }

        // Cleanup on unmount or when user changes
        return () => {
            if (newSocket) {
                console.log('Disconnecting socket');
                newSocket.disconnect();
                setSocket(null);
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};