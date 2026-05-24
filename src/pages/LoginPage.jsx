import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundHero from '../components/BackgroundHero.jsx';
import LoginLayout from '../components/LoginLayout.jsx';
import LoginForm from '../components/LoginForm.jsx';
import AuthService from '../auth/authService.js';

const LoginPage = () => {
    const [role, setRole] = useState('admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // If already authenticated, skip login and go straight to dashboard
    useEffect(() => {
        const isAlreadyAuth = AuthService.isAuthenticated();
        if (isAlreadyAuth) {
            console.log("LoginPage: Valid session found. Auto-routing to /dashboard.");
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    // Preload credentials for demo/audit convenience
    useEffect(() => {
        setError('');
        if (role === 'admin') {
            setUsername('admin');
            setPassword('Admin@123');
        } else {
            setUsername('supervisor');
            setPassword('Super@123');
        }
    }, [role]);

    const handleLoginSubmit = () => {
        setError('');
        setIsLoading(true);

        // 1.2s delay to simulate secure Government neural-ICCC handshake verification
        setTimeout(() => {
            const response = AuthService.login(username, password, role);

            if (response.success) {
                setIsLoading(false);

                if (window.showSystemBanner) {
                    window.showSystemBanner(`Clearance verified. Welcome operator: ${response.user.fullName}`);
                }

                // Redirect to the secure dashboard
                navigate("/dashboard", { replace: true });
            } else {
                setIsLoading(false);
                setError(response.message);
            }
        }, 1200);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            <BackgroundHero />

            <LoginLayout activeRole={role} onRoleChange={setRole}>
                <LoginForm
                    username={username}
                    password={password}
                    rememberMe={rememberMe}
                    error={error}
                    isLoading={isLoading}
                    onUsernameChange={setUsername}
                    onPasswordChange={setPassword}
                    onRememberChange={setRememberMe}
                    onSubmit={handleLoginSubmit}
                />
            </LoginLayout>
        </div>
    );
};

export default LoginPage;
