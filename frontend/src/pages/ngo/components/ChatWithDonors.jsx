import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../../context/SocketContext';
import { FaPaperPlane, FaUser, FaSearch } from 'react-icons/fa';

const ChatWithDonors = () => {
    const [donors, setDonors] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);
    const { socket } = useSocket();
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimeoutRef = useRef({});

    // Mock data
    useEffect(() => {
        const mockDonors = [
            { id: 1, name: "John's Restaurant", lastMessage: "Thank you for the pickup!", unread: 2 },
            { id: 2, name: "City Bakery", lastMessage: "When can you collect?", unread: 0 },
            { id: 3, name: "Fresh Mart", lastMessage: "We have fresh vegetables", unread: 1 },
        ];
        setDonors(mockDonors);

        const mockMessages = [
            { id: 1, senderId: 1, text: "Hi, we have some food to donate", timestamp: "10:30 AM", isSender: false },
            { id: 2, senderId: "ngo", text: "Great! What type of food is it?", timestamp: "10:32 AM", isSender: true },
            { id: 3, senderId: 1, text: "We have about 20 meals worth of cooked food", timestamp: "10:35 AM", isSender: false },
        ];
        setMessages(mockMessages);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        // Join chat rooms for existing chats
        donors.forEach(donor => {
            if (donor.chatId) {
                socket.emit('joinChat', donor.chatId);
            }
        });

        // Handle incoming messages
        socket.on('newMessage', (data) => {
            setMessages(prev => [...prev, data.message]);
            scrollToBottom();
        });

        // Handle typing indicators
        socket.on('userTyping', ({ userId, chatId }) => {
            if (selectedDonor?.chatId === chatId) {
                setTypingUsers(prev => ({ ...prev, [userId]: true }));
                
                // Clear typing indicator after 3 seconds
                if (typingTimeoutRef.current[userId]) {
                    clearTimeout(typingTimeoutRef.current[userId]);
                }
                typingTimeoutRef.current[userId] = setTimeout(() => {
                    setTypingUsers(prev => ({ ...prev, [userId]: false }));
                }, 3000);
            }
        });

        // Handle read receipts
        socket.on('messagesRead', ({ userId, chatId }) => {
            if (selectedDonor?.chatId === chatId) {
                setMessages(prev => 
                    prev.map(msg => ({
                        ...msg,
                        readBy: [...(msg.readBy || []), userId]
                    }))
                );
            }
        });

        return () => {
            socket.off('newMessage');
            socket.off('userTyping');
            socket.off('messagesRead');
            // Clear typing timeouts
            Object.values(typingTimeoutRef.current).forEach(timeout => {
                clearTimeout(timeout);
            });
        };
    }, [socket, donors, selectedDonor]);

    // Handle message input
    const handleMessageInput = (e) => {
        setNewMessage(e.target.value);
        if (selectedDonor?.chatId) {
            socket.emit('typing', {
                chatId: selectedDonor.chatId,
                userId: user._id
            });
        }
    };

    // Send message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedDonor?.chatId) return;

        socket.emit('sendMessage', {
            chatId: selectedDonor.chatId,
            content: newMessage
        });

        setNewMessage('');
    };

    return (
        <div className="h-[calc(100vh-12rem)]">
            <div className="flex h-full rounded-xl overflow-hidden backdrop-blur-lg bg-white/5 border border-white/10">
                {/* Donors List */}
                <div className="w-80 border-r border-white/10">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-white/10">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search donors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Donors */}
                    <div className="overflow-y-auto h-[calc(100%-5rem)]">
                        {donors.map((donor) => (
                            <motion.div
                                key={donor.id}
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                onClick={() => setSelectedDonor(donor)}
                                className={`p-4 cursor-pointer border-b border-white/10 ${
                                    selectedDonor?.id === donor.id ? 'bg-white/10' : ''
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                                        <FaUser className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold">{donor.name}</h3>
                                        <p className="text-gray-400 text-sm truncate">{donor.lastMessage}</p>
                                    </div>
                                    {donor.unread > 0 && (
                                        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                                            {donor.unread}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedDonor ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                                        <FaUser className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{selectedDonor.name}</h3>
                                        <p className="text-gray-400 text-sm">Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${
                                            message.isSender 
                                                ? 'bg-gradient-to-r from-blue-500 to-emerald-500' 
                                                : 'bg-white/10'
                                        } rounded-xl px-4 py-2`}>
                                            <p className="text-white">{message.text}</p>
                                            <p className="text-xs text-gray-300 mt-1">{message.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={handleMessageInput}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select a donor to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWithDonors;