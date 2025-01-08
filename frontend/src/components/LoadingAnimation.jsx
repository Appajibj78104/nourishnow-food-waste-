import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="text-4xl font-bold text-white flex items-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 text-transparent bg-clip-text">
                    NourishNow
                </span>
                <motion.div
                    className="ml-2 w-3 h-3 bg-blue-400 rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

export default LoadingAnimation; 