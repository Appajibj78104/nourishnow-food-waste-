import React, { useState } from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/authService';

const LoginForm = () => {
    const navigate = useNavigate();
=======
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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
            const response = await login(formData);
<<<<<<< HEAD
            console.log('Login successful:', response);

            // Verify token storage immediately after login
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            console.log('Stored token after login:', storedToken);
            console.log('Stored user after login:', storedUser);

            if (!storedToken) {
                throw new Error('Token not stored properly');
            }

            if (response.user.role === 'donor') {
                if (response.user.isProfileComplete) {
                    navigate('/donor/dashboard');
                } else {
                    navigate('/donor/profile-completion');
                }
            } else {
                switch(response.user.role) {
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
        } catch (err) {
            console.error('Login error details:', err);
            setError(
                err.message || 
                (typeof err === 'string' ? err : 'Login failed. Please check your credentials.')
            );
=======
            const { user } = response;
            
            // Log the user role and navigation
            console.log('User role:', user.role);
            
            // Redirect based on user role
            let redirectPath;
            switch(user.role) {
                case 'donor':
                    redirectPath = '/donor/dashboard';
                    break;
                case 'ngo':
                    redirectPath = '/ngo/dashboard';
                    break;
                case 'admin':
                    redirectPath = '/admin/dashboard';
                    break;
                default:
                    redirectPath = '/';
            }
            
            console.log('Redirecting to:', redirectPath);
            toast.success('Login successful!');
            navigate(redirectPath, { replace: true });
            
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Login failed');
            setError(error.message || 'Login failed');
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
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
                            NourishNow
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
