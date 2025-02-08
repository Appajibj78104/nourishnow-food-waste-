<<<<<<< HEAD
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import PrivateRoute from './components/routing/PrivateRoute';
// import DonorDashboard from './pages/donor/DonorDashboard';
// import CreateDonation from './pages/donor/CreateDonation';
// import NGODashboard from './pages/ngo/NGODashboard';
// import NGOProfile from './pages/ngo/NGOProfile';
// import NGODonations from './pages/ngo/NGODonations';
// import LoginForm from './components/LoginForm'
// import RegisterForm from './components/RegisterForm';
// import DashboardLayout from './pages/ngo/components/DashboardLayout';
// import DonorDashboardLayout from './components/Layout/DonorDashboardLayout';
// import DonationHistory from './pages/donor/DonationHistory';
// import Chat from './pages/shared/Chat';
// import Settings from './pages/shared/Settings';
// import Pickups from './pages/ngo/Pickups';
// import Inventory from './pages/ngo/Inventory';
// import Analytics from './pages/ngo/Analytics';
// import Broadcasts from './pages/ngo/Broadcasts';
// import HomePage from './components/HomePage';
// import AdminRoutes from './routes/adminRoutes';
// import { AuthProvider } from './context/AuthContext';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//     return (
//         <Router>
//             <AuthProvider>
//                 <ToastContainer />
//                 <Routes>
//                     <Route path='/' element={<HomePage />} />
//                     {/* Public Routes */}
//                     <Route path="/login" element={<LoginForm />} />
//                     <Route path="/register" element={<RegisterForm />} />

//                     {/* Protected Donor Routes */}
//                     <Route 
//                         path="/donor/*" 
//                         element={
                            
//                                 <DonorDashboardLayout>
//                                     <Routes>
//                                         <Route path="dashboard" element={<DonorDashboard />} />
//                                         <Route path="create" element={<CreateDonation />} />
//                                         <Route path="history" element={<DonationHistory />} />
//                                         <Route path="chat" element={<Chat />} />
//                                         <Route path="settings" element={<Settings />} />
//                                     </Routes>
//                                 </DonorDashboardLayout>
                           
//                         }
//                     />

//                     {/* Protected NGO Routes */}
//                     <Route 
//                         path="/ngo/*" 
//                         element={
                           
//                                 <DashboardLayout>
//                                     <Routes>
//                                         <Route path="dashboard" element={<NGODashboard />} />
//                                         <Route path="pickups" element={<Pickups />} />
//                                         <Route path="inventory" element={<Inventory />} />
//                                         <Route path="analytics" element={<Analytics />} />
//                                         <Route path="chat" element={<Chat />} />
//                                         <Route path="broadcasts" element={<Broadcasts />} />
//                                         <Route path="settings" element={<Settings />} />
//                                     </Routes>
//                                 </DashboardLayout>
                            
//                         }
//                     />

//                     {/* Admin Routes - Make sure this comes before the catch-all route */}
//                     <Route path="/admin/*" element={<AdminRoutes />} />
                    
//                     {/* Catch-all route */}
//                     <Route path="*" element={<Navigate to="/" replace />} />
//                 </Routes>
//             </AuthProvider>
//         </Router>
//     );
// }

// export default App;


=======
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DonorDashboard from './pages/donor/DonorDashboard';
import CreateDonation from './pages/donor/CreateDonation';
import NGODashboard from './pages/ngo/NGODashboard';
import NGOProfile from './pages/ngo/NGOProfile';
import NGODonations from './pages/ngo/NGODonations';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import DashboardLayout from './pages/ngo/components/DashboardLayout';
import DonorDashboardLayout from './components/Layout/DonorDashboardLayout';
import DonationHistory from './pages/donor/DonationHistory';
import Chat from './pages/shared/Chat';
import Settings from './pages/shared/Settings';
import Pickups from './pages/ngo/Pickups';
import Inventory from './pages/ngo/Inventory';
import Broadcasts from './pages/ngo/Broadcasts';
import HomePage from './components/HomePage';
import AdminRoutes from './routes/AdminRoutes';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<<<<<<< HEAD
=======
import axios from 'axios';
import { PrivateRoute } from './components/routing/PrivateRoute';
import { NGOProvider } from './context/NGOContext';
import { SocketProvider } from './context/SocketContext';
import InventoryManager from './pages/ngo/components/InventoryManager';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/Layout/AdminLayout';
import UserManagement from './pages/admin/UserManagement';
import DonationManagement from './pages/admin/DonationManagement';
import AdminAnalytics from './pages/admin/Analytics';
import Broadcast from './pages/admin/Broadcast';
import DonorBroadcasts from './pages/donor/Broadcasts';
import NGOAnalytics from './pages/ngo/Analytics';
import AdminInventory from './pages/admin/Inventory';

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = token;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401 && 
                !error.config.url.includes('/auth/login') && 
                !error.config.url.includes('/auth/status') &&
                !error.config.url.includes('/donations/test-auth')) {
                console.error('Authentication error:', error);
            }
            return Promise.reject(error);
        }
    );
};

setupAxiosInterceptors();
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)

function App() {
    return (
        <Router>
            <AuthProvider>
<<<<<<< HEAD
<<<<<<< HEAD
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Donor Routes */}
                    <Route
                        path="/donor/*"
                        element={
                            <DonorDashboardLayout>
                                <Routes>
                                    <Route path="dashboard" element={<DonorDashboard />} />
                                    <Route path="create" element={<CreateDonation />} />
                                    <Route path="history" element={<DonationHistory />} />
                                    <Route path="chat" element={<Chat />} />
                                    <Route path="settings" element={<Settings />} />
                                </Routes>
                            </DonorDashboardLayout>
                        }
                    />

                    {/* NGO Routes */}
                    <Route
                        path="/ngo/*"
                        element={
                            <DashboardLayout>
                                <Routes>
                                    <Route path="dashboard" element={<NGODashboard />} />
                                    <Route path="pickups" element={<Pickups />} />
                                    <Route path="inventory" element={<Inventory />} />
                                    <Route path="analytics" element={<Analytics />} />
                                    <Route path="chat" element={<Chat />} />
                                    <Route path="broadcasts" element={<Broadcasts />} />
                                    <Route path="settings" element={<Settings />} />
                                </Routes>
                            </DashboardLayout>
                        }
                    />

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<AdminRoutes />} />

                    {/* Catch-all route */}
                    {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
=======
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
=======
                <NGOProvider>
                    <SocketProvider>
                        <ToastContainer position="top-right" autoClose={3000} />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)

                            {/* Protected Donor Routes */}
                            <Route path="/donor/*" element={<PrivateRoute allowedRoles={['donor']} />}>
                                <Route element={<DonorDashboardLayout />}>
                                    <Route index element={<Navigate to="dashboard" replace />} />
                                    <Route path="dashboard" element={<DonorDashboard />} />
                                    <Route path="create" element={<CreateDonation />} />
                                    <Route path="history" element={<DonationHistory />} />
                                    <Route path="broadcasts" element={<DonorBroadcasts />} />
                                    <Route path="chat" element={<Chat />} />
                                    <Route path="settings" element={<Settings />} />
                                </Route>
                            </Route>

                            {/* Protected NGO Routes */}
                            <Route path="/ngo/*" element={<PrivateRoute allowedRoles={['ngo']} />}>
                                <Route element={<DashboardLayout />}>
                                    <Route path="dashboard" element={<NGODashboard />} />
                                    <Route path="donations" element={<NGODonations />} />
                                    <Route path="pickups" element={<Pickups />} />
                                    <Route path="inventory" element={<InventoryManager />} />
                                    <Route path="analytics" element={<NGOAnalytics />} />
                                    <Route path="broadcasts" element={<Broadcasts />} />
                                    <Route path="chat" element={<Chat />} />
                                    <Route path="settings" element={<Settings />} />
                                </Route>
                            </Route>

                            {/* Admin Routes */}
                            <Route path="/admin/*" element={<PrivateRoute allowedRoles={['admin']} />}>
                                <Route element={<AdminLayout />}>
                                    <Route index element={<Navigate to="dashboard" replace />} />
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="users" element={<UserManagement />} />
                                    <Route path="donations" element={<DonationManagement />} />
                                    <Route path="analytics" element={<AdminAnalytics />} />
                                    <Route path="settings" element={<Settings />} />
                                    <Route path="broadcast" element={<Broadcast />} />
                                    <Route path="inventory" element={<AdminInventory />} />
                                </Route>
                            </Route>

<<<<<<< HEAD
                    <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
                </Routes>
=======
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </SocketProvider>
                </NGOProvider>
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
            </AuthProvider>
        </Router>
    );
}

export default App;
