/**
 * Pushkara Nigha - Session Management Utility
 * Handles active user sessions, login persistence, route protection, and logout flows.
 */

const Session = {
    SESSION_KEY: "pushkara_nigha_session",

    /**
     * Start a new user session
     * @param {Object} user - User object containing username, role, etc.
     * @param {boolean} rememberMe - Whether to persist session across browser restarts
     */
    start(user, rememberMe) {
        const sessionData = {
            username: user.username,
            fullName: user.fullName || (user.username === 'admin' ? 'System Administrator' : user.username),
            role: user.role,
            employeeId: user.employeeId || 'ICCC-001',
            district: user.assignedDistrict || 'All Godavari Sectors',
            loginTime: new Date().toISOString()
        };

        const serialized = JSON.stringify(sessionData);
        if (rememberMe) {
            localStorage.setItem(this.SESSION_KEY, serialized);
        } else {
            sessionStorage.setItem(this.SESSION_KEY, serialized);
        }

        // Apply role permissions to interface
        if (window.Roles) {
            window.Roles.applyPermissions(sessionData.role);
        }
    },

    /**
     * Get the active session data
     * @returns {Object|null} Session data or null
     */
    get() {
        const localData = localStorage.getItem(this.SESSION_KEY);
        if (localData) return JSON.parse(localData);

        const sessionData = sessionStorage.getItem(this.SESSION_KEY);
        if (sessionData) return JSON.parse(sessionData);

        return null;
    },

    /**
     * Check if a valid session is active
     * @returns {boolean}
     */
    isActive() {
        return this.get() !== null;
    },

    /**
     * Clear session data from all storage types
     */
    clear() {
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
    },

    /**
     * Intercept and protect routes based on session state
     */
    protectRoute() {
        const loginOverlay = document.getElementById("login-portal-overlay");
        const appContainer = document.querySelector(".app-container");
        
        if (!this.isActive()) {
            // Hide main app, show login overlay
            if (appContainer) appContainer.style.display = "none";
            if (loginOverlay) {
                loginOverlay.style.display = "flex";
                loginOverlay.classList.remove("hidden-portal");
            }
            return false;
        } else {
            const activeSession = this.get();
            // Show main app, hide login overlay
            if (appContainer) appContainer.style.display = "flex";
            if (loginOverlay) {
                loginOverlay.style.display = "none";
                loginOverlay.classList.add("hidden-portal");
            }

            // Sync user UI indicators (Profile Pill in header, etc.)
            this.syncProfileUI(activeSession);

            // Apply role restriction rules
            if (window.Roles) {
                window.Roles.applyPermissions(activeSession.role);
            }
            return true;
        }
    },

    /**
     * Synchronize the profile pill details with active session details
     * @param {Object} session 
     */
    syncProfileUI(session) {
        const userAvatar = document.querySelector(".profile-avatar-circle");
        const userNameSpan = document.querySelector(".profile-pill span");
        
        if (userAvatar) {
            // Get initials
            const names = session.fullName.split(" ");
            const initials = names.map(n => n[0]).join("").substring(0, 2).toUpperCase();
            userAvatar.textContent = initials;
            
            // Adjust background based on role for clear visual division
            if (session.role === 'admin') {
                userAvatar.style.backgroundColor = 'var(--primary)';
                userAvatar.title = 'System Administrator';
            } else {
                userAvatar.style.backgroundColor = 'var(--secondary-teal)';
                userAvatar.title = `Command Supervisor - ${session.district}`;
            }
        }
        
        if (userNameSpan) {
            userNameSpan.textContent = session.fullName;
        }

        // Render Active Role indicator in top header if present
        let subtitle = document.querySelector(".gov-header-subtitle");
        if (subtitle && !subtitle.dataset.original) {
            subtitle.dataset.original = subtitle.textContent;
            subtitle.innerHTML = `${subtitle.textContent} &nbsp;|&nbsp; <span style="color: var(--primary-light); font-weight: 700; text-transform: uppercase;">[${session.role.replace("-", " ")}]</span>`;
        }
    },

    /**
     * Triggers a gorgeous custom futuristic HUD confirmation dialog for logging out
     */
    confirmLogout() {
        // Prevent duplicate overlays
        if (document.getElementById("logout-confirm-hud")) return;

        const overlay = document.createElement("div");
        overlay.id = "logout-confirm-hud";
        Object.assign(overlay.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(11, 15, 25, 0.8)",
            backdropFilter: "blur(12px)",
            webkitBackdropFilter: "blur(12px)",
            zIndex: "9999",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif"
        });

        const dialog = document.createElement("div");
        dialog.className = "logout-cyber-modal";
        
        // Custom neon styling in JS to avoid visual glitches
        Object.assign(dialog.style, {
            width: "420px",
            background: "rgba(18, 24, 36, 0.95)",
            border: "1px solid rgba(220, 38, 38, 0.4)",
            boxShadow: "0 0 30px rgba(220, 38, 38, 0.2), inset 0 0 15px rgba(220, 38, 38, 0.05)",
            borderRadius: "12px",
            padding: "28px",
            textAlign: "center",
            color: "#F8FAFC",
            position: "relative",
            animation: "alert-soft-pulse 2s infinite ease-in-out"
        });

        dialog.innerHTML = `
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                <i data-lucide="log-out" style="width: 24px; height: 24px; color: #DC2626;"></i>
            </div>
            <h3 style="font-family: 'Inter', sans-serif; font-size: 1.15rem; font-weight: 700; color: #F8FAFC; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Terminate Command Session?</h3>
            <p style="font-size: 0.82rem; color: #94A3B8; margin-bottom: 24px; line-height: 1.5;">Are you sure you want to shut down your secure neural telemetry command session? Unauthorized dashboard access is blocked post termination.</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="logout-cancel-btn" style="flex: 1; padding: 10px; background: rgba(255, 255, 255, 0.03); border: 1px solid #334155; border-radius: 6px; font-size: 0.8rem; font-weight: 600; color: #CBD5E1; cursor: pointer; transition: all 0.2s;">Abort Shutdown</button>
                <button id="logout-confirm-btn" style="flex: 1; padding: 10px; background: #DC2626; border: 1px solid #EF4444; border-radius: 6px; font-size: 0.8rem; font-weight: 600; color: #FFFFFF; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 10px rgba(220, 38, 38, 0.4);">Confirm Logout</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        if (window.lucide) {
            window.lucide.createIcons({
                attrs: { "data-lucide": true },
                nodeList: [dialog]
            });
        }

        // Set up events
        const cancelBtn = dialog.querySelector("#logout-cancel-btn");
        const confirmBtn = dialog.querySelector("#logout-confirm-btn");

        cancelBtn.addEventListener("mouseenter", () => {
            cancelBtn.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
            cancelBtn.style.color = "#FFFFFF";
        });
        cancelBtn.addEventListener("mouseleave", () => {
            cancelBtn.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
            cancelBtn.style.color = "#CBD5E1";
        });
        
        confirmBtn.addEventListener("mouseenter", () => {
            confirmBtn.style.boxShadow = "0 0 18px rgba(220, 38, 38, 0.6)";
        });
        confirmBtn.addEventListener("mouseleave", () => {
            confirmBtn.style.boxShadow = "0 0 10px rgba(220, 38, 38, 0.4)";
        });

        cancelBtn.addEventListener("click", () => {
            overlay.remove();
        });

        confirmBtn.addEventListener("click", () => {
            // Clear legacy session
            this.clear();

            // Also clear React SPA auth keys to keep both systems in sync
            const reactKeys = [
                "pushkara_is_auth",
                "pushkara_username",
                "pushkara_role",
                "pushkara_fullname",
                "pushkara_empid",
                "pushkara_district"
            ];
            reactKeys.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });

            overlay.remove();

            if (window.showSystemBanner) {
                window.showSystemBanner("Neural security session terminated. Redirecting to login...");
            }

            // Redirect to /login instead of reloading to current URL (which might be /dashboard)
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        });
    }
};

window.Session = Session;
