import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Login Node */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* 2. Protected Dashboard Node */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* 3. Startup defaults and wildcard fallback redirections */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
