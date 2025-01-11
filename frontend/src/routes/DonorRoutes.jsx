const React = require('react');
const { Route, Routes, Navigate } = require('react-router-dom');
const DonorGuard = require('../components/guards/DonorGuard');
const DonorProfileForm = require('../components/DonorProfileForm');
const DonorDashboard = require('../pages/donor/DonorDashboard');

const DonorRoutes = () => {
    return (
        <Routes>
            <Route 
                path="/donor/onboarding" 
                element={<DonorProfileForm />} 
            />
            <Route
                path="/donor/*"
                element={
                    <DonorGuard>
                        <DonorDashboard />
                    </DonorGuard>
                }
            />
        </Routes>
    );
};

module.exports = DonorRoutes; 