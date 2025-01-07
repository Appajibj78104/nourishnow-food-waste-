import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const LoginForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios({
                method: 'POST',
                url: 'http://localhost:5000/api/auth/login',
                data: formData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Check if user is donor and profile completion status
                if (response.data.user.role === 'donor') {
                    if (response.data.user.isProfileComplete) {
                        navigate('/donor/dashboard');
                    } else {
                        navigate('/donor/profile-completion');
                    }
                } else {
                    // Handle other roles as before
                    switch(response.data.user.role) {
                        case 'admin':
                            navigate('/admin/dashboard');
                            break;
                        case 'ngo':
                            navigate('/ngo/dashboard');
                            break;
                        default:
                            navigate('/dashboard');
                    }
                }
            } else {
                throw new Error('No token received');
            }
        } catch (err) {
            console.error('Login error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            
            setError(
                err.response?.data?.message || 
                'Login failed. Please check your credentials and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#111827]/80 to-[#111827] z-10" />
                <img
                    src="/images/impact.jpg"
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
                            Welcome back
                        </h2>
                        <p className="mt-2 text-gray-300">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 rounded bg-red-500/10 border border-red-500 text-red-500">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="Enter your email"
                            />
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
                                placeholder="Enter your password"
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
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginForm;
