import React from 'react';
import { motion } from 'framer-motion';
import NGOStats from './NGOStats';
import RealTimeDashboard from './RealTimeDashboard';
import DonationMap from './DonationMap';
import DonationScheduler from './DonationScheduler';

const Overview = ({ stats, donations, volunteers }) => {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
                <div className="space-y-6">
                    <NGOStats stats={stats} />
                    <RealTimeDashboard donations={donations} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DonationMap donations={donations} />
                        <DonationScheduler 
                            donations={donations.filter(d => d.status === 'pending')}
                            volunteers={volunteers}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Overview; 