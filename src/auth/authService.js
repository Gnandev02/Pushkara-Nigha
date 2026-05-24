/**
 * Pushkara Nigha - React SPA Authentication Service
 * Manages active operator credentials matches, session storage variables, and active states.
 */

const AuthService = {
    KEYS: {
        IS_AUTH: "pushkara_is_auth",
        USERNAME: "pushkara_username",
        ROLE: "pushkara_role",
        FULL_NAME: "pushkara_fullname",
        EMPLOYEE_ID: "pushkara_empid",
        DISTRICT: "pushkara_district"
    },

    /**
     * Validate credentials based on selected role and register active states
     * @param {string} username 
     * @param {string} password 
     * @param {string} role - 'admin' or 'command-supervisor'
     * @returns {Object} {success: boolean, message: string, user: Object|null}
     */
    login(username, password, role) {
        const inputUser = username.trim().toLowerCase();
        const inputPass = password.trim();

        // 1. Admin Authorization check
        if (role === 'admin') {
            if (inputUser === 'admin' && inputPass === 'Admin@123') {
                const user = {
                    username: 'admin',
                    fullName: 'Command Center Admin',
                    role: 'admin',
                    employeeId: 'ICCC-ADMIN-01',
                    district: 'All Districts'
                };
                this.setSession(user);
                return { success: true, message: "Authorized.", user };
            } else {
                return { success: false, message: "Invalid credentials for Admin Core." };
            }
        }

        // 2. Command Supervisor check
        if (role === 'command-supervisor') {
            // Retrieve dynamic supervisors database from localStorage
            const storedSupervisors = localStorage.getItem("pushkara_nigha_supervisors");
            const supervisors = storedSupervisors ? JSON.parse(storedSupervisors) : [];
            
            const supervisor = supervisors.find(s => s.username.toLowerCase() === inputUser);
            
            if (supervisor) {
                if (supervisor.password === inputPass) {
                    // Check if de-activated
                    if (supervisor.status === 'inactive') {
                        return { success: false, message: "This Command Supervisor account is currently deactivated." };
                    }
                    
                    const user = {
                        username: supervisor.username,
                        fullName: supervisor.fullName,
                        role: 'command-supervisor',
                        employeeId: supervisor.employeeId,
                        district: supervisor.assignedDistrict
                    };
                    
                    this.setSession(user);
                    return { success: true, message: "Authorized.", user };
                } else {
                    return { success: false, message: "Incorrect password for supervisor." };
                }
            } else {
                return { success: false, message: "Command Supervisor not found in active directory." };
            }
        }

        return { success: false, message: "Invalid system clearance level requested." };
    },

    /**
     * Clear all session data on logout
     */
    logout() {
        localStorage.removeItem(this.KEYS.IS_AUTH);
        localStorage.removeItem(this.KEYS.USERNAME);
        localStorage.removeItem(this.KEYS.ROLE);
        localStorage.removeItem(this.KEYS.FULL_NAME);
        localStorage.removeItem(this.KEYS.EMPLOYEE_ID);
        localStorage.removeItem(this.KEYS.DISTRICT);
    },

    /**
     * Check if user session is active
     * @returns {boolean}
     */
    isAuthenticated() {
        return localStorage.getItem(this.KEYS.IS_AUTH) === "true";
    },

    /**
     * Get active operator profile details
     * @returns {Object|null}
     */
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        return {
            username: localStorage.getItem(this.KEYS.USERNAME),
            role: localStorage.getItem(this.KEYS.ROLE),
            fullName: localStorage.getItem(this.KEYS.FULL_NAME),
            employeeId: localStorage.getItem(this.KEYS.EMPLOYEE_ID),
            district: localStorage.getItem(this.KEYS.DISTRICT)
        };
    },

    /**
     * Set session variables inside localStorage
     * @param {Object} user 
     */
    setSession(user) {
        localStorage.setItem(this.KEYS.IS_AUTH, "true");
        localStorage.setItem(this.KEYS.USERNAME, user.username);
        localStorage.setItem(this.KEYS.ROLE, user.role);
        localStorage.setItem(this.KEYS.FULL_NAME, user.fullName);
        localStorage.setItem(this.KEYS.EMPLOYEE_ID, user.employeeId);
        localStorage.setItem(this.KEYS.DISTRICT, user.district);
    }
};

export default AuthService;
