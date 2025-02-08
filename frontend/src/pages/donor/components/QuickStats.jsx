import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaUsers, FaHandHoldingHeart, FaClock } from 'react-icons/fa';

const QuickStats = ({ stats }) => {
    const statItems = [
        {
            title: 'Total Donations',
            value: stats.total,
            icon: FaBoxOpen,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Meals Provided',
            value: `${stats.mealsProvided || 0}+`,
            icon: FaHandHoldingHeart,
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            title: 'People Impacted',
            value: `${stats.peopleImpacted || 0}+`,
            icon: FaUsers,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20'
        },
        {
            title: 'Pending Pickups',
            value: stats.pending,
            icon: FaClock,
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item, index) => (
                <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`backdrop-blur-lg rounded-2xl border ${item.borderColor} ${item.bgColor} p-6 hover:scale-105 transition-transform duration-300`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-gray-400 text-sm">{item.title}</p>
                            <h3 className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mt-2`}>
                                {item.value}
                            </h3>
                        </div>
                        <div className={`p-3 rounded-xl ${item.bgColor}`}>
                            <item.icon className={`text-2xl bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default QuickStats;