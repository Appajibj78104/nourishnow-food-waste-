import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';

const ChatWindow = ({ chat, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off('message');
        };
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            chatId: chat._id,
            content: newMessage,
            sender: user._id,
            timestamp: new Date()
        };

        socket.emit('sendMessage', message);
        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] rounded-xl p-3 ${
                            message.sender === user._id 
                                ? 'bg-blue-500/20 text-blue-100' 
                                : 'bg-white/10 text-white'
                        }`}>
                            <p>{message.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-white/5 text-gray-400"
                    >
                        <FaSmile />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <button
                        type="submit"
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                        disabled={!newMessage.trim()}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;