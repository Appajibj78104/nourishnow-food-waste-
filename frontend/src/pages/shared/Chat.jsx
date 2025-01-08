import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
//import { useAuth } from '../../contexts/AuthContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket) return;

        // Listen for incoming messages
        socket.on('message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Get chat history
        socket.emit('getChatHistory');
        socket.on('chatHistory', (history) => {
            setMessages(history);
            setLoading(false);
        });

        return () => {
            socket.off('message');
            socket.off('chatHistory');
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        socket.emit('sendMessage', {
            content: newMessage,
            senderId: user._id,
            senderName: user.name,
            senderRole: user.role
        });

        setNewMessage('');
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-white">Messages</h1>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                {/* Messages Container */}
                <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                    message.senderId === user._id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/10 text-gray-200'
                                }`}
                            >
                                <div className="text-sm opacity-75 mb-1">
                                    {message.senderName} ({message.senderRole})
                                </div>
                                <p>{message.content}</p>
                                <div className="text-xs opacity-50 text-right mt-1">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat; 