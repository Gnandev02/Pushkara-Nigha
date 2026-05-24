import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AuthService from './auth/authService.js';

/**
 * App - Root React Router configuration.
 *
 * Routing:
 *   /         → /login (default redirect)
 *   /login    → LoginPage (public — auto-skips to /dashboard if already auth'd)
 *   /dashboard → Dashboard (protected — requires auth, shows original static UI)
 *   *         → /login (catch-all)
 *
 * IMPORTANT: Dashboard.jsx renders null — all dashboard UI comes from
 * the static .app-container DOM in index.html, managed by vanilla JS.
 * React only owns the login page and auth routing.
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

                {/* 3. Root "/" — redirect to dashboard if auth'd, else login */}
                <Route
                    path="/"
                    element={
                        AuthService.isAuthenticated()
                            ? <Navigate to="/dashboard" replace />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* 4. Catch-all wildcard → login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
