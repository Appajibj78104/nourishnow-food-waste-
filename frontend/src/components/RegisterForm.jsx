import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'donor'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Remove confirmPassword before sending to backend
            const { confirmPassword, ...registrationData } = formData;
            
            console.log('Sending registration data:', registrationData);
            
            const response = await axios.post('http://localhost:5000/api/auth/register', registrationData);
            
            console.log('Registration response:', response.data);

            if (response.data) {
                // Show success message
                alert('Registration successful! Please login.');
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#111827]/80 to-[#111827] z-10" />
                <img
                    src="/images/volunteers.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
                            NourishMe
                        </Link>
                        <h2 className="mt-6 text-2xl font-bold text-white">
                            Create your account
                        </h2>
                        <p className="mt-2 text-gray-300">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500 text-red-500">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                                I am registering as
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'donor' } })}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        formData.role === 'donor'
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-gray-600 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="text-center">
                                        <svg 
                                            className="w-8 h-8 mx-auto mb-2" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" 
                                            />
                                        </svg>
                                        <span className="block font-medium">Donor</span>
                                        <span className="text-xs text-gray-400">I want to donate food</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'ngo' } })}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        formData.role === 'ngo'
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-gray-600 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="text-center">
                                        <svg 
                                            className="w-8 h-8 mx-auto mb-2" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                                            />
                                        </svg>
                                        <span className="block font-medium">NGO</span>
                                        <span className="text-xs text-gray-400">I represent an NGO</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'admin' } })}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        formData.role === 'admin'
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-gray-600 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="text-center">
                                        <svg 
                                            className="w-8 h-8 mx-auto mb-2" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                            />
                                        </svg>
                                        <span className="block font-medium">Admin</span>
                                        <span className="text-xs text-gray-400">I am an administrator</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Create a strong password"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                        >
                            {isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                />
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterForm;