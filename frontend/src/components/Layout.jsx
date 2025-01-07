import React from 'react';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#111827]">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/30 to-teal-500/30 blur-3xl"></div>
                <div className="absolute left-[60%] top-[150px] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500/30 to-emerald-500/30 blur-3xl"></div>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default Layout; 