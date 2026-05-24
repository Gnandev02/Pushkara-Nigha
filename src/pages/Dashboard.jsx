import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../auth/authService.js';

/**
 * Dashboard - React auth bridge for the original vanilla-JS static dashboard.
 *
 * This component DOES NOT render any new React UI.
 * It acts purely as:
 *   1. Auth guard (mirrors ProtectedRoute, extra safety net)
 *   2. Orchestrator that reveals the existing .app-container DOM (original dashboard)
 *   3. Session synchronizer — keeps vanilla Session & React AuthService in sync
 *   4. Cleanup handler — hides .app-container when navigating away (e.g. logout)
 *
 * All actual dashboard UI (sidebar, navbar, monitoring, stats, etc.) is rendered
 * by the original index.html static HTML + vanilla JS files (dashboard.js, sidebar.js, etc.)
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const isRevealedRef = useRef(false);

    useEffect(() => {
        // ── 1. AUTH GUARD ──────────────────────────────────────────────────────
        const currentUser = AuthService.getCurrentUser();
        if (!AuthService.isAuthenticated() || !currentUser) {
            console.warn('Dashboard: No valid session. Redirecting to /login.');
            navigate('/login', { replace: true });
            return;
        }

        // ── 2. SYNC VANILLA SESSION from React auth keys ───────────────────────
        // The vanilla JS session.js reads from pushkara_nigha_session.
        // If the user authenticated via the React login form (which only writes
        // to pushkara_is_auth, pushkara_username, etc.) we must also populate the
        // legacy key so that Session.get() and Session.protectRoute() work correctly.
        const legacyKey = 'pushkara_nigha_session';
        const existingLegacy = localStorage.getItem(legacyKey);
        if (!existingLegacy) {
            const legacySession = {
                username: currentUser.username,
                fullName: currentUser.fullName || 'Command Center Admin',
                role: currentUser.role,
                employeeId: currentUser.employeeId || 'ICCC-ADMIN-01',
                district: currentUser.district || 'All Districts',
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(legacyKey, JSON.stringify(legacySession));
        }

        // ── 3. REVEAL ORIGINAL DASHBOARD ─────────────────────────────────────
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.style.setProperty('display', 'flex', 'important');
            isRevealedRef.current = true;
        }

        // ── 4. APPLY ROLE PERMISSIONS via vanilla Roles module ────────────────
        // Small timeout ensures all vanilla scripts have had time to define window.Roles
        const permissionsTimer = setTimeout(() => {
            if (window.Roles && typeof window.Roles.applyPermissions === 'function') {
                window.Roles.applyPermissions(currentUser.role);
            }

            // Sync profile pill in the static header with real user data
            if (window.Session && typeof window.Session.syncProfileUI === 'function') {
                const legacySession = JSON.parse(localStorage.getItem(legacyKey) || '{}');
                if (legacySession.username) {
                    window.Session.syncProfileUI(legacySession);
                }
            }

            // Initialize Reporting and UserUI modules if present
            if (window.Reporting && typeof window.Reporting.init === 'function') {
                window.Reporting.init();
            }
            if (window.UsersUI && typeof window.UsersUI.init === 'function') {
                window.UsersUI.init();
            }

            // Re-render Lucide icons that may have been added dynamically
            if (window.lucide) {
                window.lucide.createIcons();
            }

            // Navigate supervisors to the Monitoring section by default
            if (currentUser.role === 'command-supervisor') {
                const monitoringNav = document.querySelector(".sidebar-nav-item[href='#monitoring']");
                if (monitoringNav) {
                    monitoringNav.click();
                }
            } else {
                // Admins land on Overview (which is active by default in index.html)
                const overviewNav = document.querySelector(".sidebar-nav-item[href='#overview']");
                if (overviewNav && !overviewNav.classList.contains('active')) {
                    overviewNav.click();
                }
            }
        }, 80);

        // ── 5. LOGOUT BUTTON WIRING ───────────────────────────────────────────
        // The static sidebar logout button (#sidebar-logout-btn) must trigger
        // the futuristic HUD confirm dialog. Wire it now if Session is available.
        const wireLogoutBtn = () => {
            const logoutBtn = document.getElementById('sidebar-logout-btn');
            if (logoutBtn && !logoutBtn.dataset.reactWired) {
                logoutBtn.dataset.reactWired = 'true';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.Session && typeof window.Session.confirmLogout === 'function') {
                        window.Session.confirmLogout();
                    } else {
                        // Fallback: clear all auth and redirect
                        AuthService.logout();
                        localStorage.removeItem('pushkara_nigha_session');
                        sessionStorage.removeItem('pushkara_nigha_session');
                        navigate('/login', { replace: true });
                    }
                });
            }
        };

        // Try immediately, and also after a short delay for slow script loads
        wireLogoutBtn();
        const logoutWireTimer = setTimeout(wireLogoutBtn, 300);

        // ── 6. CLEANUP — hide dashboard when unmounting (logout/route change) ──
        return () => {
            clearTimeout(permissionsTimer);
            clearTimeout(logoutWireTimer);
            if (isRevealedRef.current) {
                const appContainer = document.getElementById('app-container');
                if (appContainer) {
                    appContainer.style.setProperty('display', 'none', 'important');
                }
                isRevealedRef.current = false;
            }
        };
    }, [navigate]);

    // This component renders nothing — the entire dashboard UI comes from index.html
    return null;
};

export default Dashboard;
