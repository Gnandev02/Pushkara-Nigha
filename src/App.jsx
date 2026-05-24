import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

/**
 * App - Root React Router configuration.
 *
 * Routing:
 *   /         → redirect to /login (default)
 *   /login    → LoginPage (public)
 *   /dashboard → Dashboard (protected — requires auth)
 *   *         → redirect to /login (catch-all wildcard)
 */
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Public Login Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* 2. Protected Dashboard Route */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* 3. Root "/" always redirects to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 4. Catch-all: any unknown path → redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
