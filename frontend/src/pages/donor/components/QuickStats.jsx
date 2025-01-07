import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaHandHoldingHeart, FaUsers, FaClock } from 'react-icons/fa';
import CountUp from 'react-countup';

const QuickStats = ({ stats }) => {
    const statItems = [
        {
            icon: FaBoxOpen,
            label: 'Total Donations',
            value: stats?.totalDonations || 0,
            color: 'from-blue-500 to-blue-600',
            suffix: '',
        },
        {
            icon: FaHandHoldingHeart,
            label: 'Meals Provided',
            value: stats?.mealsProvided || 0,
            color: 'from-emerald-500 to-emerald-600',
            suffix: '+',
        },
        {
            icon: FaUsers,
            label: 'People Impacted',
            value: stats?.peopleImpacted || 0,
            color: 'from-purple-500 to-purple-600',
            suffix: '+',
        },
        {
            icon: FaClock,
            label: 'Pending Pickups',
            value: stats?.pendingPickups || 0,
            color: 'from-amber-500 to-amber-600',
            suffix: '',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                        <item.icon className="text-white text-xl" />
                    </div>
                    
                    <h3 className="text-gray-400 text-sm mb-2">{item.label}</h3>
                    
                    <div className="text-2xl font-bold text-white">
                        <CountUp
                            end={item.value}
                            duration={2.5}
                            suffix={item.suffix}
                            enableScrollSpy
                            scrollSpyOnce
                        />
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((item.value / 100) * 100, 100)}%` }}
                            transition={{ duration: 1.5, delay: index * 0.1 }}
                            className={`h-full bg-gradient-to-r ${item.color}`}
                        />
                    </div>
                </motion.div>
            ))}

            {/* Impact Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-4 backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-semibold mb-1">Your Impact</h3>
                        <p className="text-gray-400 text-sm">
                            You've helped reduce food waste and feed those in need
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-emerald-400 font-semibold">
                            <CountUp
                                end={stats?.impactPercentage || 0}
                                duration={2.5}
                                suffix="%"
                                enableScrollSpy
                                scrollSpyOnce
                            />
                        </div>
                        <p className="text-gray-400 text-sm">Success Rate</p>
                    </div>
                </div>

                {/* Impact Progress Bar */}
                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.impactPercentage || 0}%` }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default QuickStats;