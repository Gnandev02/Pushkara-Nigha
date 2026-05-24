/**
 * Pushkara Nigha - Command Supervisor Database Module
 * Operates dynamic CRUD storage on supervisors in localStorage.
 */

const Users = {
    STORAGE_KEY: "pushkara_nigha_supervisors",

    // Default seeded supervisors list for immediate usage and testing
    DEFAULTS: [
        {
            fullName: "Officer Rajesh Kumar",
            employeeId: "SUP-2026-009",
            mobileNumber: "+91 98480 22334",
            email: "rajesh.kumar@iccc.ap.gov.in",
            username: "supervisor",
            password: "Super@123",
            assignedDistrict: "East Godavari",
            shiftTiming: "Morning Shift (06:00 - 14:00)",
            status: "active",
            lastLogin: "2026-05-24T06:01:22.000Z"
        },
        {
            fullName: "Officer Anjali Naidu",
            employeeId: "SUP-2026-015",
            mobileNumber: "+91 81223 99881",
            email: "anjali.n@iccc.ap.gov.in",
            username: "supervisor2",
            password: "Super@123",
            assignedDistrict: "West Godavari",
            shiftTiming: "Afternoon Shift (14:00 - 22:00)",
            status: "active",
            lastLogin: "2026-05-23T14:15:30.000Z"
        },
        {
            fullName: "Officer Srinivas Rao",
            employeeId: "SUP-2026-033",
            mobileNumber: "+91 99008 77665",
            email: "srinivas.r@iccc.ap.gov.in",
            username: "supervisor3",
            password: "Super@123",
            assignedDistrict: "Khammam",
            shiftTiming: "Night Shift (22:00 - 06:00)",
            status: "inactive",
            lastLogin: "Never"
        }
    ],

    /**
     * Retrieve all supervisor accounts from storage
     * @returns {Array} Supervisors list
     */
    getSupervisors() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            this.saveSupervisors(this.DEFAULTS);
            return this.DEFAULTS;
        }
        return JSON.parse(data);
    },

    /**
     * Save the supervisors array to storage
     * @param {Array} list 
     */
    saveSupervisors(list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    },

    /**
     * Find a single supervisor by username
     * @param {string} username 
     * @returns {Object|null}
     */
    findSupervisor(username) {
        const list = this.getSupervisors();
        return list.find(s => s.username.toLowerCase() === username.toLowerCase()) || null;
    },

    /**
     * Create a new Supervisor account
     * @param {Object} supervisor - Supervisor fields
     * @returns {Object} {success: boolean, message: string}
     */
    addSupervisor(supervisor) {
        const list = this.getSupervisors();
        const username = supervisor.username.trim().toLowerCase();

        // 1. Validations
        if (username === 'admin') {
            return { success: false, message: "Username 'admin' is reserved." };
        }
        if (list.some(s => s.username.toLowerCase() === username)) {
            return { success: false, message: `Username "${username}" already exists in neural directory.` };
        }
        if (list.some(s => s.employeeId.toLowerCase() === supervisor.employeeId.trim().toLowerCase())) {
            return { success: false, message: `Employee ID "${supervisor.employeeId}" is already assigned.` };
        }

        // 2. Prepend default status if not set
        const newRecord = {
            fullName: supervisor.fullName.trim(),
            employeeId: supervisor.employeeId.trim().toUpperCase(),
            mobileNumber: supervisor.mobileNumber.trim(),
            email: supervisor.email.trim(),
            username: username,
            password: supervisor.password || this.generatePasscode(),
            assignedDistrict: supervisor.assignedDistrict || 'East Godavari',
            shiftTiming: supervisor.shiftTiming || 'Morning Shift',
            status: supervisor.status || 'active',
            lastLogin: 'Never'
        };

        list.push(newRecord);
        this.saveSupervisors(list);

        return { success: true, message: `Supervisor account created successfully for "${newRecord.fullName}".`, supervisor: newRecord };
    },

    /**
     * Edit existing supervisor fields
     * @param {string} username - Target supervisor username
     * @param {Object} updatedFields - Fields to update
     * @returns {Object} {success: boolean, message: string}
     */
    updateSupervisor(username, updatedFields) {
        const list = this.getSupervisors();
        const index = list.findIndex(s => s.username.toLowerCase() === username.toLowerCase());

        if (index === -1) {
            return { success: false, message: "Supervisor not found in active telemetry directory." };
        }

        // Apply merge changes
        list[index] = {
            ...list[index],
            fullName: updatedFields.fullName !== undefined ? updatedFields.fullName.trim() : list[index].fullName,
            mobileNumber: updatedFields.mobileNumber !== undefined ? updatedFields.mobileNumber.trim() : list[index].mobileNumber,
            email: updatedFields.email !== undefined ? updatedFields.email.trim() : list[index].email,
            password: updatedFields.password !== undefined ? updatedFields.password : list[index].password,
            assignedDistrict: updatedFields.assignedDistrict !== undefined ? updatedFields.assignedDistrict : list[index].assignedDistrict,
            shiftTiming: updatedFields.shiftTiming !== undefined ? updatedFields.shiftTiming : list[index].shiftTiming,
            status: updatedFields.status !== undefined ? updatedFields.status : list[index].status,
            lastLogin: updatedFields.lastLogin !== undefined ? updatedFields.lastLogin : list[index].lastLogin
        };

        this.saveSupervisors(list);
        return { success: true, message: `Details updated successfully for ${list[index].fullName}.` };
    },

    /**
     * Delete supervisor from active list
     * @param {string} username - Target supervisor username
     * @returns {Object} {success: boolean, message: string}
     */
    deleteSupervisor(username) {
        let list = this.getSupervisors();
        const target = list.find(s => s.username.toLowerCase() === username.toLowerCase());

        if (!target) {
            return { success: false, message: "Supervisor not found in records." };
        }

        list = list.filter(s => s.username.toLowerCase() !== username.toLowerCase());
        this.saveSupervisors(list);

        return { success: true, message: `Account "${target.fullName}" removed from security grid.` };
    },

    /**
     * Helper to generate a strong random standard password
     * @returns {string}
     */
    generatePasscode() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
        let passcode = "";
        for (let i = 0; i < 8; i++) {
            passcode += chars[Math.floor(Math.random() * chars.length)];
        }
        return passcode + "@" + Math.floor(Math.random() * 90 + 10);
    }
};

window.Users = Users;
