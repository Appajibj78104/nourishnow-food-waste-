// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import QuickStats from './components/QuickStats';
// import DonationList from './components/DonationList';
// import DonationForm from './components/DonationForm';
// import MapView from './components/MapView';
// import { getDonorStats, getDonations } from './services/donorService';

// const DonorDashboard = () => {
//     const [user, setUser] = useState(null);
//     const [showDonationForm, setShowDonationForm] = useState(false);
//     const [donations, setDonations] = useState([]);
//     const [stats, setStats] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 // Get user from localStorage
//                 const userData = JSON.parse(localStorage.getItem('user'));
//                 setUser(userData);

//                 // Fetch donations and stats
//                 const [donationsData, statsData] = await Promise.all([
//                     getDonations(),
//                     getDonorStats()
//                 ]);

//                 setDonations(donationsData);
//                 setStats(statsData);
//             } catch (error) {
//                 console.error('Error fetching dashboard data:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             {/* Header */}
//             <header className="bg-white shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">
//                                 Welcome, {user?.name}
//                             </h1>
//                             <p className="mt-1 text-sm text-gray-500">
//                                 Manage your donations and track their impact
//                             </p>
//                         </div>
//                         <button
//                             onClick={() => setShowDonationForm(true)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                             New Donation
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Left Column - Stats & Quick Actions */}
//                     <div className="lg:col-span-2 space-y-8">
//                         <QuickStats stats={stats} />
//                         <DonationList donations={donations} />
//                     </div>

//                     {/* Right Column - Map & Profile */}
//                     <div className="space-y-8">
//                         <MapView donations={donations} />
                        
//                         {/* Profile Quick Access */}
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="bg-white rounded-lg shadow p-6"
//                         >
//                             <h3 className="text-lg font-medium mb-4">Quick Access</h3>
//                             <nav className="space-y-2">
//                                 <a href="/donor/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
//                                     Edit Profile
//                                 </a>
//                                 <a href="/donor/documents" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
//                                     Update Documents
//                                 </a>
//                                 <a href="/donor/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
//                                     Settings
//                                 </a>
//                             </nav>
//                         </motion.div>
//                     </div>
//                 </div>
//             </main>

//             {/* Donation Form Modal */}
//             {showDonationForm && (
//                 <DonationForm
//                     onClose={() => setShowDonationForm(false)}
//                     onSubmit={(donation) => {
//                         setDonations([...donations, donation]);
//                         setShowDonationForm(false);
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default DonorDashboard;



import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuickStats from './components/QuickStats';
import DonationList from './components/DonationList';
import DonationForm from './components/DonationForm';
import MapView from './components/MapView';
import { getDonorStats, getDonations } from './services/donorService';

const DonorDashboard = () => {
    const [user, setUser] = useState(null);
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);
                const [donationsData, statsData] = await Promise.all([
                    getDonations(),
                    getDonorStats()
                ]);
                setDonations(donationsData);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#111827]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111827] text-white relative">
            {/* Background with overlay */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#111827]/80 to-[#111827] z-10" />
                <img
                    src="/images/volunteers.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                    Welcome, {user?.name}
                                </h1>
                                <p className="mt-2 text-gray-300">
                                    Making a difference through your generous donations
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDonationForm(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-full 
                                hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                New Donation
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Stats & Donations */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <QuickStats stats={stats} />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <DonationList donations={donations} />
                        </motion.div>
                    </div>

                    {/* Right Column - Map & Quick Access */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <MapView donations={donations} />
                        </motion.div>
                        
                        {/* Quick Access Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-xl font-semibold text-white mb-4">Quick Access</h3>
                            <nav className="space-y-2">
                                <a 
                                    href="/donor/profile" 
                                    className="block px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl transition-colors duration-200"
                                >
                                    Edit Profile
                                </a>
                                <a 
                                    href="/donor/documents" 
                                    className="block px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl transition-colors duration-200"
                                >
                                    Update Documents
                                </a>
                                <a 
                                    href="/donor/settings" 
                                    className="block px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl transition-colors duration-200"
                                >
                                    Settings
                                </a>
                            </nav>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Donation Form Modal */}
            {showDonationForm && (
                <DonationForm
                    onClose={() => setShowDonationForm(false)}
                    onSubmit={(donation) => {
                        setDonations([...donations, donation]);
                        setShowDonationForm(false);
                    }}
                />
            )}
        </div>
    );
};

export default DonorDashboard;