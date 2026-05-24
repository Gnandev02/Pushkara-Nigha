import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import AuthService from '../auth/authService.js';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [section, setSection] = useState('overview'); // Default section

    useEffect(() => {
        // 1. Verify authentication — ProtectedRoute already guards this,
        //    but double-check for edge cases (e.g. localStorage cleared mid-session).
        if (!AuthService.isAuthenticated()) {
            console.warn("Dashboard: Session expired or cleared. Redirecting to /login.");
            navigate("/login", { replace: true });
            return;
        }

        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        // 2. Adjust fallback section based on role
        if (currentUser.role === 'command-supervisor') {
            setSection('monitoring'); // Supervisors have no access to Overview
        } else {
            setSection('overview');
        }

        // 3. Make the static dashboard DOM container visible.
        //    We use setProperty to override the inline !important style.
        const appContainer = document.querySelector(".app-container");
        if (appContainer) {
            appContainer.style.setProperty("display", "flex", "important");
        }

        const loginOverlay = document.getElementById("login-portal-overlay");
        if (loginOverlay) {
            loginOverlay.style.display = "none";
        }

        // 4. Initialize dynamic widgets once DOM elements are rendered
        setTimeout(() => {
            // Apply DOM-level permission checks
            if (window.Roles) {
                window.Roles.applyPermissions(currentUser.role);
            }

            // Initialize shift management tables & stats clocks
            if (window.Reporting && typeof window.Reporting.init === 'function') {
                window.Reporting.init();
            }

            // Initialize supervisor administration tables
            if (window.UsersUI && typeof window.UsersUI.init === 'function') {
                window.UsersUI.init();
            }

            // Render Lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }, 100);

        // 5. Cleanup: hide app-container when unmounting (e.g. if navigating away)
        return () => {
            const appContainer = document.querySelector(".app-container");
            if (appContainer) {
                appContainer.style.setProperty("display", "none", "important");
            }
        };
    }, [navigate]);

    // 6. Handle Tab Navigation Transitions inside existing DOM sections
    useEffect(() => {
        if (!section) return;

        document.querySelectorAll(".dashboard-section").forEach(sec => {
            sec.classList.remove("active");
        });

        const targetSec = document.getElementById(`section-${section}`);
        if (targetSec) {
            targetSec.classList.add("active");
        }

        console.log(`React Dashboard: Navigating to section #${section}`);

        if (section !== 'overview' && window.showSystemBanner) {
            const pageTitle = section.charAt(0).toUpperCase() + section.slice(1);
            window.showSystemBanner(`Loading ${pageTitle} telemetry controls...`);
        }
    }, [section]);

    // 7. Handle Security Terminate Session
    const handleLogout = () => {
        if (window.Session) {
            // Use the futuristic confirmation dialog from vanilla-JS
            window.Session.confirmLogout();
        } else {
            // Fallback: clear auth and redirect
            AuthService.logout();
            navigate("/login", { replace: true });
        }
    };

    // Wait for authentication check to complete before rendering
    if (!user) return null;

    return (
        <React.Fragment>
            {/* Inject modular Sidebar */}
            <Sidebar
                activeRole={user.role}
                currentSection={section}
                onNavigate={setSection}
                onLogout={handleLogout}
            />

            {/* Injected Top Navbar within the existing App Main column */}
            {/* The main column is handled by .app-main inside index.html */}
            <Navbar user={user} onLogout={handleLogout} />
        </React.Fragment>
    );
};

export default Dashboard;
