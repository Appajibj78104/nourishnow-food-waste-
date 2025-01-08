import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaBox, FaCalendar, FaExclamationTriangle } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, expiring, expired

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/ngo/inventory`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setInventory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setLoading(false);
        }
    };

    const filteredInventory = inventory.filter(item => {
        if (filter === 'all') return true;
        const now = new Date();
        const expiryDate = new Date(item.expiryDate);
        const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        if (filter === 'expiring') return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
        if (filter === 'expired') return daysUntilExpiry <= 0;
        return true;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Food Inventory</h1>
                <div className="flex space-x-2">
                    {['all', 'expiring', 'expired'].map(filterOption => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-4 py-2 rounded-lg ${
                                filter === filterOption
                                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInventory.map(item => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {item.foodType}
                                </h3>
                                <p className="text-gray-400">
                                    {item.quantity} {item.quantityUnit}
                                </p>
                            </div>
                            <ExpiryBadge expiryDate={item.expiryDate} />
                        </div>

                        <div className="space-y-2 text-sm text-gray-400">
                            <p className="flex items-center">
                                <FaBox className="mr-2" />
                                Storage: {item.storageLocation}
                            </p>
                            <p className="flex items-center">
                                <FaCalendar className="mr-2" />
                                Received: {new Date(item.receivedDate).toLocaleDateString()}
                            </p>
                        </div>

                        {isExpiringSoon(item.expiryDate) && (
                            <div className="mt-4 flex items-center text-yellow-500">
                                <FaExclamationTriangle className="mr-2" />
                                <span>Expiring soon</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                    <FaBox className="mx-auto text-4xl text-gray-600 mb-4" />
                    <p className="text-gray-400">No items found in inventory</p>
                </div>
            )}
        </div>
    );
};

const ExpiryBadge = ({ expiryDate }) => {
    const daysUntilExpiry = Math.floor((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    let badgeClass = 'px-3 py-1 rounded-full text-sm ';
    if (daysUntilExpiry <= 0) {
        badgeClass += 'bg-red-500';
    } else if (daysUntilExpiry <= 3) {
        badgeClass += 'bg-yellow-500';
    } else {
        badgeClass += 'bg-green-500';
    }

    return (
        <span className={badgeClass}>
            {daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry} days left`}
        </span>
    );
};

const isExpiringSoon = (expiryDate) => {
    const daysUntilExpiry = Math.floor((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 3;
};

export default Inventory; 