import React from 'react';
import { motion } from 'framer-motion';

const QuickStats = ({ stats }) => {
    const statItems = [
        {
            title: 'Total Donations',
            value: stats?.totalDonations || 0,
            color: 'blue',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
            )
        },
        {
            title: 'Successful Pickups',
            value: stats?.successfulPickups || 0,
            color: 'green',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Upcoming Pickups',
            value: stats?.upcomingPickups || 0,
            color: 'yellow',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statItems.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow p-6 border-l-4 border-${item.color}-500`}
                >
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full bg-${item.color}-100 text-${item.color}-500`}>
                            {item.icon}
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default QuickStats;