import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import { getLeaderboard } from '../services/donorService';

const medalColors = {
    0: 'text-yellow-500', // Gold
    1: 'text-gray-300',   // Silver
    2: 'text-amber-600'   // Bronze
};

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [timeframe, setTimeframe] = useState('month');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [timeframe]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await getLeaderboard(timeframe);
            setLeaderboardData(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaTrophy className="text-yellow-500" />
                    Donor Leaderboard
                </h2>
                
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-gray-700 text-white rounded-lg px-3 py-1 border border-gray-600"
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {leaderboardData.map((donor, index) => (
                        <motion.div
                            key={donor._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                        >
                            <div className="flex items-center gap-4">
                                <span className={`text-2xl ${medalColors[index] || 'text-gray-400'}`}>
                                    {index < 3 ? <FaMedal /> : <FaStar />}
                                </span>
                                <div>
                                    <p className="font-semibold text-white">{donor.name}</p>
                                    <p className="text-sm text-gray-400">{donor.donations} donations</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-emerald-400">{donor.points} points</p>
                                <p className="text-sm text-gray-400">Rank #{index + 1}</p>
                            </div>
                        </motion.div>
                    ))}

                    {leaderboardData.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            No data available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Leaderboard; 