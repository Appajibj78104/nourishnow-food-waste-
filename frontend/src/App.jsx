import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginForm';
import RegisterPage from './components/RegisterForm';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfileForm from './components/DonorProfileForm';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/donor/dashboard" element={<DonorDashboard />} />
                    <Route path="/donor/profile-completion" element={<DonorProfileForm />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
