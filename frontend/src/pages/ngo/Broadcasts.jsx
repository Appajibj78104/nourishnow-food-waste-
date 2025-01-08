import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { 
  FaUsers, 
  FaClock, 
  FaCheckCircle, 
  FaPaperPlane, 
  FaTrash 
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Broadcasts = () => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBroadcast, setNewBroadcast] = useState({
        title: '',
        message: '',
        targetAudience: 'all', // all, donors, volunteers
        priority: 'normal' // normal, urgent
    });
    const { socket } = useSocket();

    useEffect(() => {
        fetchBroadcasts();

        if (socket) {
            socket.on('broadcastDelivered', (stats) => {
                updateBroadcastStats(stats);
            });

            return () => socket.off('broadcastDelivered');
        }
    }, [socket]);

    const fetchBroadcasts = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/ngo/broadcasts`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setBroadcasts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching broadcasts:', error);
            setLoading(false);
        }
    };

    const sendBroadcast = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/ngo/broadcasts`,
                newBroadcast,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setBroadcasts(prev => [response.data, ...prev]);
            setNewBroadcast({
                title: '',
                message: '',
                targetAudience: 'all',
                priority: 'normal'
            });
        } catch (error) {
            console.error('Error sending broadcast:', error);
        }
    };

    const deleteBroadcast = async (broadcastId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/ngo/broadcasts/${broadcastId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setBroadcasts(prev => prev.filter(b => b._id !== broadcastId));
        } catch (error) {
            console.error('Error deleting broadcast:', error);
        }
    };

    const updateBroadcastStats = (stats) => {
        setBroadcasts(prev => prev.map(broadcast => 
            broadcast._id === stats.broadcastId 
                ? { ...broadcast, deliveryStats: stats }
                : broadcast
        ));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-white mb-6">Broadcasts</h1>

            {/* New Broadcast Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8"
            >
                <form onSubmit={sendBroadcast} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Title</label>
                        <input
                            type="text"
                            value={newBroadcast.title}
                            onChange={(e) => setNewBroadcast({
                                ...newBroadcast,
                                title: e.target.value
                            })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            placeholder="Broadcast title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Message</label>
                        <textarea
                            value={newBroadcast.message}
                            onChange={(e) => setNewBroadcast({
                                ...newBroadcast,
                                message: e.target.value
                            })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-32"
                            placeholder="Your message"
                            required
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2">Target Audience</label>
                            <select
                                value={newBroadcast.targetAudience}
                                onChange={(e) => setNewBroadcast({
                                    ...newBroadcast,
                                    targetAudience: e.target.value
                                })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            >
                                <option value="all">All Users</option>
                                <option value="donors">Donors Only</option>
                                <option value="volunteers">Volunteers Only</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2">Priority</label>
                            <select
                                value={newBroadcast.priority}
                                onChange={(e) => setNewBroadcast({
                                    ...newBroadcast,
                                    priority: e.target.value
                                })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                            >
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-emerald-600"
                    >
                        <FaPaperPlane className="inline mr-2" />
                        Send Broadcast
                    </button>
                </form>
            </motion.div>

            {/* Broadcasts List */}
            <div className="space-y-4">
                {broadcasts.map(broadcast => (
                    <motion.div
                        key={broadcast._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border ${
                            broadcast.priority === 'urgent' 
                                ? 'border-red-500/50' 
                                : 'border-white/10'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {broadcast.title}
                                </h3>
                                <p className="text-gray-400 mt-1">
                                    {broadcast.message}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteBroadcast(broadcast._id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                                <FaUsers className="mr-1" />
                                {broadcast.targetAudience}
                            </span>
                            <span className="flex items-center">
                                <FaClock className="mr-1" />
                                {new Date(broadcast.createdAt).toLocaleDateString()}
                            </span>
                            {broadcast.deliveryStats && (
                                <span className="flex items-center text-green-500">
                                    <FaCheckCircle className="mr-1" />
                                    Delivered: {broadcast.deliveryStats.delivered}
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Broadcasts; 