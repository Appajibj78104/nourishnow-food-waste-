import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg bg-red-900/50 border border-red-500/50 p-4 mb-4"
        >
            <div className="flex items-center">
                <FaExclamationCircle className="text-red-400 mr-3" />
                <p className="text-red-200">{message}</p>
            </div>
        </motion.div>
    );
};

export default ErrorMessage; 