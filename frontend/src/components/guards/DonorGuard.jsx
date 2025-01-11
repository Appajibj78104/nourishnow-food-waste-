const React = require('react');
const { Navigate } = require('react-router-dom');
const { useAuth } = require('../../context/AuthContext');
const { checkFirstTimeLogin } = require('../../utils/authUtils');

const DonorGuard = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role === 'donor' && checkFirstTimeLogin(user)) {
        return <Navigate to="/donor/onboarding" />;
    }

    return children;
};

module.exports = DonorGuard; 