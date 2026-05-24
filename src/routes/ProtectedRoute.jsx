import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../auth/authService.js';

const ProtectedRoute = ({ children }) => {
    const isAuth = AuthService.isAuthenticated();

    if (!isAuth) {
        console.warn("ProtectedRoute: Secure clearance missing. Redirecting user to /login.");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
