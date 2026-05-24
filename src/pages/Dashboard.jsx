import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../auth/authService.js';

/**
 * Dashboard - React auth bridge for the original vanilla-JS static dashboard.
 *
 * Renders nothing — all dashboard UI is in index.html's .app-container.
 * This component:
 *   1. Auth-guards the route (redirects to /login if not authenticated)
 *   2. Writes the legacy vanilla-JS session key so Session.js recognizes the user
 *   3. Reveals .app-container (the original static dashboard)
 *   4. Re-initializes vanilla modules (Roles, Reporting, UsersUI, Lucide icons)
 *      that need to run AFTER the container becomes visible
 *   5. Hides .app-container on unmount (logout / route change)
 *
 * IMPORTANT: We use a ref guard (`initRan`) to prevent double-initialization
 * caused by React StrictMode running effects twice in development.
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const initRan = useRef(false);
    const timers = useRef([]);

    useEffect(() => {
        // ── 1. AUTH GUARD ────────────────────────────────────────────────────────
        const currentUser = AuthService.getCurrentUser();
        if (!AuthService.isAuthenticated() || !currentUser) {
            console.warn('[Dashboard] No valid session. Redirecting to /login.');
            navigate('/login', { replace: true });
            return;
        }

        // ── 2. PREVENT STRICTMODE DOUBLE-INIT ──────────────────────────────────
        // React StrictMode mounts → cleanup → remounts in development.
        // We guard against reinitializing modules on the second mount,
        // which would cause duplicate event listeners and wiped monitoring state.
        if (initRan.current) {
            // Second StrictMode mount: just re-reveal the container (cleanup hid it)
            const appContainer = document.getElementById('app-container');
            if (appContainer) {
                appContainer.style.setProperty('display', 'flex', 'important');
            }
            return;
        }
        initRan.current = true;

        // ── 3. SYNC LEGACY VANILLA-JS SESSION ──────────────────────────────────
        // session.js reads "pushkara_nigha_session" from storage.
        // LoginPage already writes it, but we ensure it exists as a safety net.
        const legacyKey = 'pushkara_nigha_session';
        if (!localStorage.getItem(legacyKey) && !sessionStorage.getItem(legacyKey)) {
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

        // ── 4. REVEAL ORIGINAL DASHBOARD ────────────────────────────────────────
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.style.setProperty('display', 'flex', 'important');
        }

        // ── 5. POST-REVEAL INITIALIZATION ───────────────────────────────────────
        // These vanilla modules need the container to be VISIBLE before running
        // (e.g. Reporting.init() wipes and repopulates a section's innerHTML).
        // Use a short timeout so the browser has painted the revealed container first.
        const initTimer = setTimeout(() => {
            const legacySession = JSON.parse(
                localStorage.getItem(legacyKey) ||
                sessionStorage.getItem(legacyKey) ||
                '{}'
            );

            // 5a. Re-initialize core vanilla modules
            if (typeof window.initSidebar === 'function') window.initSidebar();
            if (typeof window.initApp === 'function') window.initApp();
            if (typeof window.initSurveillanceCommandCenter === 'function') window.initSurveillanceCommandCenter();
            if (typeof window.initOverviewDashboard === 'function') window.initOverviewDashboard();
            if (typeof window.initMap === 'function') window.initMap();

            // 5b. Apply role-based permission restrictions to sidebar items
            if (window.Roles && typeof window.Roles.applyPermissions === 'function') {
                window.Roles.applyPermissions(currentUser.role);
            }

            // 5c. Sync profile pill in the original static header
            if (window.Session && typeof window.Session.syncProfileUI === 'function') {
                if (legacySession.username) {
                    window.Session.syncProfileUI(legacySession);
                }
            }

            // 5d. Initialize the Reporting section (it wipes #section-reporting innerHTML
            //     and repopulates it with the officer shift table — must run once after auth)
            if (window.Reporting && typeof window.Reporting.init === 'function') {
                window.Reporting.init();
            }

            // 5e. Initialize Users Management UI if available
            if (window.UsersUI && typeof window.UsersUI.init === 'function') {
                window.UsersUI.init();
            }

            // 5f. Refresh Lucide icons on newly visible DOM elements
            if (window.lucide) {
                window.lucide.createIcons();
            }

            // 5g. Activate the Overview section for admins, Monitoring for supervisors
            if (currentUser.role === 'command-supervisor') {
                const monitorNav = document.querySelector(".sidebar-nav-item[href='#monitoring']");
                if (monitorNav) monitorNav.click();
            } else {
                // Overview is the default active section in index.html static HTML.
                // Only explicitly activate it if no section is currently active
                // (to avoid unnecessary re-triggering the sidebar click handlers).
                const activeSection = document.querySelector('.dashboard-section.active');
                if (!activeSection) {
                    const overviewNav = document.querySelector(".sidebar-nav-item[href='#overview']");
                    if (overviewNav) overviewNav.click();
                }
            }

            console.log('[Dashboard] Initialized successfully for role:', currentUser.role);
        }, 60);

        // ── 6. WIRE STATIC LOGOUT BUTTON ────────────────────────────────────────
        // The sidebar has a static #sidebar-logout-btn. Wire it once to Session.confirmLogout().
        const wireLogout = () => {
            const logoutBtn = document.getElementById('sidebar-logout-btn');
            if (logoutBtn && !logoutBtn.dataset.reactWired) {
                logoutBtn.dataset.reactWired = 'true';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.Session && typeof window.Session.confirmLogout === 'function') {
                        window.Session.confirmLogout();
                    } else {
                        // Fallback: clear all session data and redirect
                        AuthService.logout();
                        localStorage.removeItem('pushkara_nigha_session');
                        sessionStorage.removeItem('pushkara_nigha_session');
                        navigate('/login', { replace: true });
                    }
                });
            }
        };

        wireLogout();
        const logoutWireTimer = setTimeout(wireLogout, 400);

        timers.current = [initTimer, logoutWireTimer];

        // ── 7. CLEANUP — runs on unmount OR on StrictMode's first unmount ───────
        return () => {
            timers.current.forEach(clearTimeout);
            timers.current = [];

            // Hide .app-container when navigating away (e.g. to /login after logout)
            const container = document.getElementById('app-container');
            if (container) {
                container.style.setProperty('display', 'none', 'important');
            }
        };
    }, [navigate]);

    // Returns null — entire dashboard UI is static HTML in index.html
    return null;
};

export default Dashboard;
