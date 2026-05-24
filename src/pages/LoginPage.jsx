import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundHero from '../components/BackgroundHero.jsx';
import LoginLayout from '../components/LoginLayout.jsx';
import LoginForm from '../components/LoginForm.jsx';
import AuthService from '../auth/authService.js';

/**
 * LoginPage - Full-screen React login portal.
 *
 * This is the ONLY React component rendered when unauthenticated.
 * On successful login it:
 *   1. Sets the React auth session via AuthService (pushkara_is_auth, etc.)
 *   2. Populates the legacy vanilla-JS session key (pushkara_nigha_session)
 *      so Session.get() / Session.protectRoute() also sees the user
 *   3. Navigates to /dashboard where Dashboard.jsx reveals the static app-container
 */
const LoginPage = () => {
    const [role, setRole] = useState('admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // ── Auto-skip login if already authenticated ──────────────────────────────
    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            console.log('LoginPage: Valid session found. Auto-routing to /dashboard.');
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    // ── Pre-fill credentials when role changes (demo convenience) ────────────
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

    // ── Login submission handler ───────────────────────────────────────────────
    const handleLoginSubmit = () => {
        setError('');
        setIsLoading(true);

        // 1.2s simulated secure handshake (matches original design)
        setTimeout(() => {
            const response = AuthService.login(username, password, role);

            if (response.success) {
                setIsLoading(false);

                const user = response.user;

                // ── Sync the LEGACY vanilla-JS session key ──────────────────
                // Session.js reads from "pushkara_nigha_session" in localStorage.
                // We write it here so the static dashboard's Session.protectRoute()
                // and Session.syncProfileUI() work without any changes to auth.js / session.js.
                const legacySession = {
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role,
                    employeeId: user.employeeId || 'ICCC-ADMIN-01',
                    district: user.district || 'All Districts',
                    loginTime: new Date().toISOString()
                };

                if (rememberMe) {
                    localStorage.setItem('pushkara_nigha_session', JSON.stringify(legacySession));
                } else {
                    sessionStorage.setItem('pushkara_nigha_session', JSON.stringify(legacySession));
                }

                // Show welcome banner if the vanilla banner system is ready
                if (window.showSystemBanner) {
                    window.showSystemBanner(`Clearance verified. Welcome operator: ${user.fullName}`);
                }

                // Navigate to protected dashboard — Dashboard.jsx handles the rest
                navigate('/dashboard', { replace: true });
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
