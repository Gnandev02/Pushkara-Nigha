import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../auth/authService.js';

/**
 * ProtectedRoute - Guards dashboard access behind authentication.
 * If not authenticated, immediately redirects to /login.
 * Passes the attempted location so login can redirect back after success.
 */
const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuth = AuthService.isAuthenticated();

    if (!isAuth) {
        console.warn(
            "ProtectedRoute: No valid session found. Redirecting to /login.",
            { attemptedPath: location.pathname }
        );
        // Replace: prevents the user from pressing Back to get to the dashboard
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
