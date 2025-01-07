import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMedal } from 'react-icons/fa';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [timeframe, setTimeframe] = useState('month'); // week, month, year

    useEffect(() => {
        // Fetch leaderboard data
        // This should be replaced with actual API call
        const mockData = [
            { id: 1, name: 'John Doe', donations: 150, impact: '450 meals', badges: ['First100', 'Monthly Star'] },
            { id: 2, name: 'Jane Smith', donations: 120, impact: '360 meals', badges: ['Consistent'] },
            // Add more mock data
        ];
        setLeaderboardData(mockData);
    }, [timeframe]);

    const getMedalColor = (index) => {
        switch (index) {
            case 0: return 'text-yellow-400';
            case 1: return 'text-gray-400';
            case 2: return 'text-amber-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Timeframe Selection */}
            <div className="flex space-x-4 mb-6">
                {['week', 'month', 'year'].map((period) => (
                    <button
                        key={period}
                        onClick={() => setTimeframe(period)}
                        className={`px-4 py-2 rounded-xl transition-colors ${
                            timeframe === period 
                                ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white' 
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                ))}
            </div>

            {/* Leaderboard List */}
            <div className="space-y-4">
                {leaderboardData.map((donor, index) => (
                    <motion.div
                        key={donor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10 flex items-center space-x-4"
                    >
                        <div className={`text-2xl ${getMedalColor(index)}`}>
                            <FaMedal />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold">{donor.name}</h3>
                            <p className="text-gray-400 text-sm">{donor.impact}</p>
                        </div>
                        <div className="flex space-x-2">
                            {donor.badges.map((badge, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                        <div className="text-emerald-400 font-semibold">
                            {donor.donations} donations
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard; 