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
        // 1. Check Authentication state
        if (!AuthService.isAuthenticated()) {
            navigate("/login");
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

        // 3. Make dashboard DOM visible
        const appContainer = document.querySelector(".app-container");
        if (appContainer) {
            appContainer.style.display = "flex";
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
    }, [navigate]);

    // 5. Handle Tab Navigation Transitions inside existing DOM sections
    useEffect(() => {
        if (!section) return;

        // Transition classes
        document.querySelectorAll(".dashboard-section").forEach(sec => {
            sec.classList.remove("active");
        });

        const targetSec = document.getElementById(`section-${section}`);
        if (targetSec) {
            targetSec.classList.add("active");
        }

        console.log(`React Dashboard: Navigating to section #${section}`);

        // Dispatch simulated loading toast alerts
        if (section !== 'overview' && window.showSystemBanner) {
            const pageTitle = section.charAt(0).toUpperCase() + section.slice(1);
            window.showSystemBanner(`Loading ${pageTitle} telemetry controls...`);
        }
    }, [section]);

    // 6. Handle Security Terminate Session
    const handleLogout = () => {
        if (window.Session) {
            window.Session.confirmLogout();
        } else {
            // Fallback clear & redirect
            AuthService.logout();
            navigate("/login");
        }
    };

    if (!user) return null; // Wait for authentication check

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
