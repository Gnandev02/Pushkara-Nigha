/**
 * Pushkara Nigha - Authentication Logic Handler
 * Coordinates secure matching, credentials verification, and account pre-seeding.
 */

const Auth = {
    // Admin credentials
    ADMIN_USER: {
        username: "admin",
        password: "Admin@123",
        fullName: "Command Center Admin",
        role: "admin",
        employeeId: "ICCC-ADMIN-01",
        assignedDistrict: "All Districts",
        status: "active"
    },

    /**
     * Authenticate standard credentials based on selected role
     * @param {string} username - Form input username
     * @param {string} password - Form input password
     * @param {string} role - Selected role ('admin' or 'command-supervisor')
     * @returns {Object} {success: boolean, message: string, user: Object|null}
     */
    login(username, password, role) {
        const inputUser = username.trim().toLowerCase();
        const inputPass = password.trim();

        // 1. Admin Authentication Path
        if (role === 'admin') {
            if (inputUser === this.ADMIN_USER.username.toLowerCase()) {
                if (inputPass === this.ADMIN_USER.password) {
                    // Successful Admin authentication
                    const sessionUser = { ...this.ADMIN_USER };
                    delete sessionUser.password; // Do not leak credentials in sessions
                    return {
                        success: true,
                        message: "Admin authentication verified. Secure command clearance granted.",
                        user: sessionUser
                    };
                } else {
                    return { success: false, message: "Invalid system password entered." };
                }
            } else {
                return { success: false, message: "Username 'admin' not recognized on this neural system node." };
            }
        }

        // 2. Command Supervisor Path
        if (role === 'command-supervisor') {
            if (window.Users) {
                const supervisor = window.Users.findSupervisor(inputUser);
                if (supervisor) {
                    if (supervisor.password === inputPass) {
                        // Check profile activity status
                        if (supervisor.status === 'inactive') {
                            return { 
                                success: false, 
                                message: "This Command Supervisor account is currently deactivated. Contact Admin." 
                            };
                        }

                        // Success path
                        // Update Last Login timestamp dynamically
                        const nowISO = new Date().toISOString();
                        window.Users.updateSupervisor(supervisor.username, { lastLogin: nowISO });

                        const sessionUser = {
                            username: supervisor.username,
                            fullName: supervisor.fullName,
                            role: 'command-supervisor',
                            employeeId: supervisor.employeeId,
                            assignedDistrict: supervisor.assignedDistrict,
                            shiftTiming: supervisor.shiftTiming
                        };

                        return {
                            success: true,
                            message: `Command Supervisor session authenticated. Welcome back, ${supervisor.fullName}.`,
                            user: sessionUser
                        };
                    } else {
                        return { success: false, message: "Incorrect password for supervisor node." };
                    }
                } else {
                    return { success: false, message: "Command Supervisor username not found in directory." };
                }
            } else {
                return { success: false, message: "Supervisor User directory unavailable." };
            }
        }

        return { success: false, message: "Unknown system clearance level requested." };
    }
};

window.Auth = Auth;
