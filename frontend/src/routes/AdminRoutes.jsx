// import React from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';
// import AdminLayout from '../pages/admin/components/AdminLayout';
// import Dashboard from '../pages/admin/Dashboard';
// import UserManagement from '../pages/admin/UserManagement';
// import NGOVerification from '../pages/admin/NGOVerification';
// import DonationManagement from '../pages/admin/DonationManagement';
// import Analytics from '../pages/admin/Analytics';
// import Settings from '../pages/admin/Settings';
// import ContentManager from '../pages/admin/ContentManager';
// import FeedbackManagement from '../pages/admin/FeedbackManagement';
// import SystemHealth from '../pages/admin/SystemHealth';
// import AdminGuard from '../components/guards/AdminGuard';

// const AdminRoutes = () => {
//     return (
//         <Routes>
//             <Route 
//                 path="/" 
//                 element={<Navigate to="/admin/dashboard" replace />} 
//             />

//             <Route
//                 path="/*"
//                 element={
//                     <AdminGuard>
//                         <AdminLayout>
//                             <Routes>
//                                 <Route path="dashboard" element={<Dashboard />} />
//                                 <Route path="" element={<Navigate to="dashboard" replace />} />
                                
//                                 {/* User Management */}
//                                 <Route path="users" element={<UserManagement />} />
//                                 <Route path="users/:id" element={<UserManagement />} />
                                
//                                 {/* NGO Management */}
//                                 <Route path="ngos" element={<NGOVerification />} />
//                                 <Route path="ngos/:id" element={<NGOVerification />} />
//                                 <Route path="ngos/verification" element={<NGOVerification />} />
                                
//                                 {/* Donation Management */}
//                                 <Route path="donations" element={<DonationManagement />} />
//                                 <Route path="donations/active" element={<DonationManagement />} />
//                                 <Route path="donations/completed" element={<DonationManagement />} />
//                                 <Route path="donations/:id" element={<DonationManagement />} />
                                
//                                 {/* Analytics */}
//                                 <Route path="analytics" element={<Analytics />} />
//                                 <Route path="analytics/users" element={<Analytics />} />
//                                 <Route path="analytics/donations" element={<Analytics />} />
//                                 <Route path="analytics/ngos" element={<Analytics />} />
                                
//                                 {/* Settings */}
//                                 <Route path="settings" element={<Settings />} />
//                                 <Route path="settings/general" element={<Settings />} />
//                                 <Route path="settings/notifications" element={<Settings />} />
//                                 <Route path="settings/security" element={<Settings />} />
                                
//                                 {/* Content Management */}
//                                 <Route path="content" element={<ContentManager />} />
//                                 <Route path="content/create" element={<ContentManager />} />
//                                 <Route path="content/edit/:id" element={<ContentManager />} />
                                
//                                 {/* Feedback Management */}
//                                 <Route path="feedback" element={<FeedbackManagement />} />
//                                 <Route path="feedback/:id" element={<FeedbackManagement />} />
                                
//                                 {/* System Health */}
//                                 <Route path="system" element={<SystemHealth />} />
//                                 <Route path="system/metrics" element={<SystemHealth />} />
//                                 <Route path="system/logs" element={<SystemHealth />} />
//                             </Routes>
//                         </AdminLayout>
//                     </AdminGuard>
//                 }
//             />
//         </Routes>
//     );
// };

// export default AdminRoutes; 



import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../pages/admin/components/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import NGOVerification from '../pages/admin/NGOVerification';
import DonationManagement from '../pages/admin/DonationManagement';
import Analytics from '../pages/admin/Analytics';
import Settings from '../pages/admin/Settings';
import ContentManager from '../pages/admin/ContentManager';
import FeedbackManagement from '../pages/admin/FeedbackManagement';
import SystemHealth from '../pages/admin/SystemHealth';
import AdminGuard from '../components/guards/AdminGuard';

const AdminRoutes = () => {
    return (
        <Routes>
            {/* <Route 
                path="/" 
                element={<Navigate to="/admin/dashboard" replace />} 
            /> */}

            <Route
                path="/*"
                element={
                        <AdminLayout>
                            <Routes>
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="" element={<Navigate to="dashboard" replace />} />
                                
                                {/* User Management */}
                                <Route path="users" element={<UserManagement />} />
                                <Route path="users/:id" element={<UserManagement />} />
                                
                                {/* NGO Management */}
                                <Route path="ngos" element={<NGOVerification />} />
                                <Route path="ngos/:id" element={<NGOVerification />} />
                                <Route path="ngos/verification" element={<NGOVerification />} />
                                
                                {/* Donation Management */}
                                <Route path="donations" element={<DonationManagement />} />
                                <Route path="donations/active" element={<DonationManagement />} />
                                <Route path="donations/completed" element={<DonationManagement />} />
                                <Route path="donations/:id" element={<DonationManagement />} />
                                
                                {/* Analytics */}
                                <Route path="analytics" element={<Analytics />} />
                                <Route path="analytics/users" element={<Analytics />} />
                                <Route path="analytics/donations" element={<Analytics />} />
                                <Route path="analytics/ngos" element={<Analytics />} />
                                
                                {/* Settings */}
                                <Route path="settings" element={<Settings />} />
                                <Route path="settings/general" element={<Settings />} />
                                <Route path="settings/notifications" element={<Settings />} />
                                <Route path="settings/security" element={<Settings />} />
                                
                                {/* Content Management */}
                                <Route path="content" element={<ContentManager />} />
                                <Route path="content/create" element={<ContentManager />} />
                                <Route path="content/edit/:id" element={<ContentManager />} />
                                
                                {/* Feedback Management */}
                                <Route path="feedback" element={<FeedbackManagement />} />
                                <Route path="feedback/:id" element={<FeedbackManagement />} />
                                
                                {/* System Health */}
                                <Route path="system" element={<SystemHealth />} />
                                <Route path="system/metrics" element={<SystemHealth />} />
                                <Route path="system/logs" element={<SystemHealth />} />
                            </Routes>
                        </AdminLayout>
                }
            />
        </Routes>
    );
};

export default AdminRoutes; 