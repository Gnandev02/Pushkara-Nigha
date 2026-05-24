/**
 * Pushkara Nigha - Role & Access Control Matrix
 * Controls visibility of DOM elements, pages, menus, and options depending on active user credentials.
 */

const Roles = {
    // Exact mapping of allowed navigation hashes for each role
    MATRIX: {
        'admin': ['overview', 'monitoring', 'reporting', 'usermanagement', 'aialerts', 'settings'],
        'command-supervisor': ['monitoring', 'reporting']
    },

    /**
     * Enforce access control rules across the dashboard elements
     * @param {string} role - The active role ('admin' or 'command-supervisor')
     */
    applyPermissions(role) {
        const canonicalRole = role ? role.toLowerCase() : 'command-supervisor';
        const allowedSections = this.MATRIX[canonicalRole] || ['monitoring', 'reporting'];

        console.log(`Roles Matrix: Enforcing authorization boundaries for standard role: [${canonicalRole.toUpperCase()}]`);

        // 1. Filter Sidebar Nav items based on permissions
        const navItems = document.querySelectorAll(".sidebar-nav li");
        navItems.forEach(li => {
            const anchor = li.querySelector("a");
            if (!anchor) return;
            
            const href = anchor.getAttribute("href");
            if (!href) return;

            const targetSectionName = href.substring(1); // e.g. overview, usermanagement, settings
            
            // Allow the logout button to remain visible for all authenticated roles
            if (anchor.id === 'sidebar-logout-btn' || allowedSections.includes(targetSectionName)) {
                li.style.display = "block"; // Show permitted item
            } else {
                li.style.display = "none";  // Block unauthorized option
            }
        });

        // 2. Hide / Show sidebars action buttons (restricted options like control-center)
        const demoActions = document.querySelector(".sidebar-bottom-actions");
        if (demoActions) {
            if (canonicalRole === 'admin') {
                demoActions.style.display = "flex";
            } else {
                demoActions.style.display = "none"; // Hide demo controls from supervisor
            }
        }

        // 3. Remove/Hide admin controls inside dashboards
        // e.g. AI-Assisted Recommendation Deploy buttons, system refresh buttons, etc.
        const adminButtons = document.querySelectorAll(".ai-pred-actions, #btn-analytics-demo, .gov-refresh-btn.refresh-btn, .clear-all-notif-btn");
        adminButtons.forEach(btn => {
            if (canonicalRole === 'admin') {
                btn.style.display = ""; // Standard display
            } else {
                btn.style.setProperty("display", "none", "important"); // Force hidden
            }
        });

        // 4. In case the current section of the active nav is unauthorized, redirect
        const currentActiveNav = document.querySelector(".sidebar-nav-item.active");
        if (currentActiveNav) {
            const currentHash = currentActiveNav.getAttribute("href").substring(1);
            if (!allowedSections.includes(currentHash)) {
                // Not authorized for current view, auto-reroute to first available section
                const fallbackSection = allowedSections[0];
                console.warn(`Access Denied to sector: #${currentHash}. Re-routing to fallback: #${fallbackSection}`);
                
                // Switch sidebar tab
                document.querySelectorAll(".sidebar-nav-item").forEach(nav => {
                    const h = nav.getAttribute("href").substring(1);
                    if (h === fallbackSection) {
                        nav.classList.add("active");
                    } else {
                        nav.classList.remove("active");
                    }
                });

                // Transition section
                document.querySelectorAll(".dashboard-section").forEach(sec => {
                    if (sec.id === `section-${fallbackSection}`) {
                        sec.classList.add("active");
                    } else {
                        sec.classList.remove("active");
                    }
                });

                if (window.showSystemBanner) {
                    window.showSystemBanner(`Restricted view #${currentHash} intercepted. Auto-routed to #${fallbackSection}.`);
                }
            }
        }
    },

    /**
     * Check if a route/hash is authorized for a specific role
     * @param {string} role 
     * @param {string} section 
     * @returns {boolean}
     */
    isAuthorized(role, section) {
        const canonicalRole = role ? role.toLowerCase() : 'command-supervisor';
        const allowedSections = this.MATRIX[canonicalRole] || ['monitoring', 'reporting'];
        return allowedSections.includes(section);
    }
};

window.Roles = Roles;
