<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ role }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute; 
=======
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    console.log('PrivateRoute:', {
        isAuthenticated,
        userRole: user?.role,
        allowedRoles,
        currentPath: location.pathname
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        console.log('User role not allowed:', user?.role);
        return <Navigate to="/" replace />;
    }

    console.log('Access granted to:', location.pathname);
    return <Outlet />;
}; 
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
