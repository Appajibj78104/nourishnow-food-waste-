import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaUsers, FaBuilding, FaGlobe } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const Broadcast = () => {
    const [loading, setLoading] = useState(false);
    const [recipients, setRecipients] = useState('all'); // 'all', 'donors', 'ngos'
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [urgency, setUrgency] = useState('normal'); // 'normal', 'urgent'
    const [broadcasts, setBroadcasts] = useState([]);

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchBroadcasts = async () => {
        try {
            const response = await adminService.getBroadcasts();
            if (response.success) {
                setBroadcasts(response.data);
            }
        } catch (error) {
            console.error('Error fetching broadcasts:', error);
            toast.error('Failed to fetch broadcasts');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await adminService.createBroadcast({
                title,
                message,
                recipients,
                urgency
            });

            if (response.success) {
                toast.success('Broadcast sent successfully');
                setTitle('');
                setMessage('');
                setUrgency('normal');
                fetchBroadcasts();
            }
        } catch (error) {
            console.error('Error sending broadcast:', error);
            toast.error('Failed to send broadcast');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    Broadcast Messages
                </h1>
                <p className="text-gray-400 mt-2">Send announcements and notifications to users</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Broadcast Form */}
                <div className="lg:col-span-2">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Recipients</label>
                                <div className="flex space-x-4">
                                    {[
                                        { value: 'all', label: 'Everyone', icon: FaGlobe },
                                        { value: 'donors', label: 'Donors', icon: FaUsers },
                                        { value: 'ngos', label: 'NGOs', icon: FaBuilding }
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
                                    placeholder="Enter broadcast title"
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

                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Urgency</label>
                                <div className="flex space-x-4">
                                    {[
                                        { value: 'normal', label: 'Normal' },
                                        { value: 'urgent', label: 'Urgent' }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setUrgency(option.value)}
                                            className={`px-4 py-2 rounded-lg ${
                                                urgency === option.value
                                                    ? option.value === 'urgent'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <FaBullhorn className="w-5 h-5" />
                                        <span>Send Broadcast</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Recent Broadcasts */}
                <div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 rounded-xl p-6"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Recent Broadcasts</h2>
                        <div className="space-y-4">
                            {broadcasts.map((broadcast) => (
                                <div
                                    key={broadcast._id}
                                    className="bg-gray-700/50 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-white">{broadcast.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            broadcast.urgency === 'urgent' 
                                                ? 'bg-red-500/10 text-red-500' 
                                                : 'bg-blue-500/10 text-blue-500'
                                        }`}>
                                            {broadcast.urgency}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{broadcast.message}</p>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>To: {broadcast.recipients}</span>
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

export default Broadcast; 