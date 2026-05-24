/**
 * Pushkara Nigha - Login Page Container Component
 * Coordinates central state managers, pre-seeded credentials, session hooks, and redirection locks.
 */

const { useState, useEffect } = React;

const LoginPage = () => {
    const [role, setRole] = useState('admin'); // 'admin' or 'command-supervisor'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Preload credentials based on the selected role for immediate operational testing
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

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };

    const handleLoginSubmit = () => {
        setError('');
        setIsLoading(true);

        // Add 1.2s delay to simulate secure Government neural-ICCC handshake verification
        setTimeout(() => {
            if (!window.Auth) {
                setIsLoading(false);
                setError("Authentication server node is offline. Contact support.");
                return;
            }

            const response = window.Auth.login(username, password, role);

            if (response.success) {
                setIsLoading(false);
                
                // Save active Session data
                if (window.Session) {
                    window.Session.start(response.user, rememberMe);
                    
                    // Display success banner
                    if (window.showSystemBanner) {
                        window.showSystemBanner(response.message);
                    }

                    // Apply permissions immediately inside Roles
                    if (window.Roles) {
                        window.Roles.applyPermissions(response.user.role);
                    }

                    // Trigger smooth UI page unlock transition
                    const portalOverlay = document.getElementById("login-portal-overlay");
                    if (portalOverlay) {
                        portalOverlay.classList.add("hidden-portal");
                        setTimeout(() => {
                            portalOverlay.style.display = "none";
                        }, 500);
                    }

                    const appContainer = document.querySelector(".app-container");
                    if (appContainer) {
                        appContainer.style.display = "flex";
                    }

                    // Route logic: Supervisors redirect to Monitoring, Admins go to active tab (e.g. Overview)
                    if (response.user.role === 'command-supervisor') {
                        const monitoringNav = document.querySelector(".sidebar-nav-item[href='#monitoring']");
                        if (monitoringNav) {
                            monitoringNav.click();
                        }
                    } else {
                        // Admin goes to Overview
                        const overviewNav = document.querySelector(".sidebar-nav-item[href='#overview']");
                        if (overviewNav) {
                            overviewNav.click();
                        }
                    }

                    // Trigger sub-components initialization dynamically if not loaded
                    if (window.Reporting && typeof window.Reporting.init === 'function') {
                        window.Reporting.init();
                    }
                    if (window.UsersUI && typeof window.UsersUI.init === 'function') {
                        window.UsersUI.init();
                    }
                }
            } else {
                setIsLoading(false);
                setError(response.message);
            }
        }, 1200);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Godavari River backdrop with blur mask */}
            <BackgroundHero />
            
            {/* Split panel white centered container */}
            <LoginLayout activeRole={role} onRoleChange={handleRoleChange}>
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

// Export to window in UMD environment
window.LoginPage = LoginPage;
