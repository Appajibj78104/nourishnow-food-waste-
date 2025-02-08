import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaUsers, FaBuilding, FaGlobe } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import broadcastService from './services/broadcastService';

const Broadcasts = () => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [recipients, setRecipients] = useState('ngos'); // 'all', 'ngos', 'admin'
    const [sendingBroadcast, setSendingBroadcast] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all', 'received', 'sent'

    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        fetchBroadcasts();

        if (socket && user) {
            console.log('Setting up socket connection for broadcasts');
            
            // Join broadcast room
            socket.emit('joinBroadcastRoom', {
                userId: user._id,
                role: 'donor'
            });

            // Listen for new broadcasts
            socket.on('newBroadcast', (data) => {
                console.log('New broadcast received:', data);
                setBroadcasts(prev => [data.broadcast, ...prev]);
                toast.info(`New broadcast: ${data.broadcast.title}`);
            });

            // Cleanup
            return () => {
                console.log('Cleaning up socket listeners');
                socket.emit('leaveBroadcastRoom', {
                    userId: user._id,
                    role: 'donor'
                });
                socket.off('newBroadcast');
            };
        }
    }, [socket, user]);

    const fetchBroadcasts = async () => {
        try {
            setLoading(true);
            const response = await broadcastService.getBroadcasts();
            if (response.success) {
                setBroadcasts(response.data);
            }
        } catch (error) {
            console.error('Error fetching broadcasts:', error);
            toast.error('Failed to fetch broadcasts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setSendingBroadcast(true);
            const response = await broadcastService.createBroadcast({
                title,
                message,
                recipients
            });

            if (response.success) {
                toast.success('Broadcast sent successfully');
                setTitle('');
                setMessage('');
                setRecipients('ngos');
                fetchBroadcasts();
            }
        } catch (error) {
            console.error('Error sending broadcast:', error);
            toast.error('Failed to send broadcast');
        } finally {
            setSendingBroadcast(false);
        }
    };

    const filteredBroadcasts = broadcasts.filter(broadcast => {
        if (filter === 'sent') {
            return broadcast.sender._id === user._id;
        }
        if (filter === 'received') {
            return broadcast.sender._id !== user._id;
        }
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    Broadcasts
                </h1>
                <p className="text-gray-400 mt-2">View and send broadcast messages</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Broadcast Form */}
                <div className="lg:col-span-1">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Send Broadcast</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Recipients</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { value: 'all', label: 'Everyone', icon: FaGlobe },
                                        { value: 'ngos', label: 'NGOs', icon: FaBuilding },
                                        { value: 'admin', label: 'Admin', icon: FaUsers }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setRecipients(option.value)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                                recipients === option.value
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            <option.icon className="w-4 h-4" />
                                            <span>{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded-lg p-3"
                                    placeholder="Enter message title"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 min-h-[150px]"
                                    placeholder="Enter your message"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sendingBroadcast}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                            >
                                {sendingBroadcast ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <FaBullhorn className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Broadcasts List */}
                <div className="lg:col-span-2">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Broadcasts</h2>
                            <div className="flex space-x-2">
                                {['all', 'received', 'sent'].map((filterOption) => (
                                    <button
                                        key={filterOption}
                                        onClick={() => setFilter(filterOption)}
                                        className={`px-4 py-2 rounded-lg capitalize ${
                                            filter === filterOption
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        {filterOption}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            {filteredBroadcasts.map((broadcast) => (
                                <div
                                    key={broadcast._id}
                                    className="bg-gray-700/50 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-white">{broadcast.title}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                broadcast.urgency === 'urgent' 
                                                    ? 'bg-red-500/10 text-red-500' 
                                                    : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                                {broadcast.sender.role.toUpperCase()}
                                            </span>
                                            {broadcast.sender._id === user._id && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                                                    SENT
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{broadcast.message}</p>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>From: {broadcast.sender.name}</span>
                                        <span>To: {broadcast.recipients.toUpperCase()}</span>
                                        <span>{new Date(broadcast.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Broadcasts; 