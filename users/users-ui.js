/**
 * Pushkara Nigha - Command Supervisor CRUD UI Controller
 * Renders the supervisor directory tables, Add/Edit modals, validations, and storage synchronization.
 */

const UsersUI = {
    activeEditUsername: null, // Tracks username being edited

    /**
     * Initializes and renders the User Management container inside `#section-usermanagement`
     */
    init() {
        const container = document.getElementById("section-usermanagement");
        if (!container) return;

        console.log("UsersUI: Rendering Command Supervisor Management Admin Portal...");

        container.innerHTML = `
            <!-- Portal Header -->
            <div class="gov-header-card" style="margin-bottom: 20px;">
                <div class="gov-header-left">
                    <div class="gov-header-title-container">
                        <span class="gov-header-subtitle">ICCC ADMINISTRATION LEVEL 4</span>
                        <h1 class="gov-header-title">Command Supervisor Directory Management</h1>
                    </div>
                </div>
                <div class="gov-header-right">
                    <button id="btn-add-supervisor" class="sidebar-action-btn" style="width: auto; padding: 0 18px; height: 36px; background: var(--primary); color: #FFFFFF; border-color: var(--primary); font-weight: 700; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(11, 107, 83, 0.3);">
                        <i data-lucide="user-plus" style="width: 16px; height: 16px;"></i> Add Command Officer
                    </button>
                </div>
            </div>

            <!-- Supervisor Listing Console -->
            <div class="dashboard-card" style="margin-bottom: 24px;">
                <div class="surveillance-table-responsive-wrapper" style="border: 1px solid var(--border-light); border-radius: 8px; overflow-x: auto; background: var(--bg-card);">
                    <table class="surveillance-cyber-table" style="min-width: 1100px;">
                        <thead>
                            <tr>
                                <th style="width: 50px; padding: 12px 16px;">#</th>
                                <th>Full Name</th>
                                <th>Employee ID</th>
                                <th>Assigned District</th>
                                <th>Shift Schedule</th>
                                <th>Status</th>
                                <th>Username</th>
                                <th>Contact Number</th>
                                <th>Email Address</th>
                                <th>Last System Login</th>
                                <th style="width: 140px; text-align: center;">Command Actions</th>
                            </tr>
                        </thead>
                        <tbody id="supervisor-table-body">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- MODAL: ADD SUPERVISOR DIALOG -->
            <div id="modal-supervisor" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(7, 11, 19, 0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 10000; display: none; align-items: center; justify-content: center; padding: 20px;">
                <div class="login-glass-card" style="width: 100%; max-width: 520px; background: rgba(18, 24, 36, 0.95); border: 1px solid rgba(13, 148, 136, 0.25); padding: 32px; border-radius: 12px; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
                        <h3 id="modal-title" style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="user-plus" style="width: 20px; height: 20px; color: var(--primary);"></i> Add Command Supervisor
                        </h3>
                        <button id="modal-close" style="color: #64748B; cursor: pointer; transition: color 0.2s;"><i data-lucide="x" style="width: 20px; height: 20px;"></i></button>
                    </div>

                    <form id="form-supervisor" style="display: flex; flex-direction: column; gap: 16px;">
                        <!-- Inline Validation Toast -->
                        <div class="login-validation-toast" id="modal-validation-toast" style="display: none; background: rgba(220, 38, 38, 0.1); border-color: rgba(220, 38, 38, 0.3); color: #FCA5A5;">
                            <i data-lucide="alert-triangle" style="width: 16px; height: 16px;"></i>
                            <span id="modal-validation-text">Warning details here.</span>
                        </div>

                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <!-- Full Name -->
                            <div class="login-input-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                <label for="sup-fullname">Officer Full Name</label>
                                <div class="login-input-wrapper">
                                    <input type="text" id="sup-fullname" placeholder="e.g. Officer Rajesh Kumar" style="padding-left: 12px; height: 38px;">
                                </div>
                            </div>
                            
                            <!-- Employee ID -->
                            <div class="login-input-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                <label for="sup-empid">Employee ID</label>
                                <div class="login-input-wrapper">
                                    <input type="text" id="sup-empid" placeholder="e.g. SUP-2026-009" style="padding-left: 12px; height: 38px;">
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <!-- Mobile -->
                            <div class="login-input-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                <label for="sup-mobile">Mobile Number</label>
                                <div class="login-input-wrapper">
                                    <input type="text" id="sup-mobile" placeholder="+91 98480 22334" style="padding-left: 12px; height: 38px;">
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="login-input-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                <label for="sup-email">Email Address</label>
                                <div class="login-input-wrapper">
                                    <input type="email" id="sup-email" placeholder="rajesh@iccc.ap.gov.in" style="padding-left: 12px; height: 38px;">
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <!-- District Selector -->
                            <div class="login-input-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                <label for="sup-district">Assigned District</label>
                                <select id="sup-district" style="width: 100%; height: 38px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 0 12px; color: #FFFFFF; outline: none; cursor: pointer;">
                                    <option value="East Godavari">East Godavari</option>
                                    <option value="West Godavari">West Godavari</option>
                                    <option value="Khammam">Khammam</option>
                                </select>
                            </div>

                            <!-- Shift Timing Selector -->
                            <div class="login-input-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                <label for="sup-shift">Shift Timing</label>
                                <select id="sup-shift" style="width: 100%; height: 38px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 0 12px; color: #FFFFFF; outline: none; cursor: pointer;">
                                    <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                                    <option value="Afternoon Shift (14:00 - 22:00)">Afternoon Shift (14:00 - 22:00)</option>
                                    <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
                                    <option value="Emergency Response Shift (08:00 - 20:00)">Emergency Response Shift (08:00 - 20:00)</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <!-- Status Selector -->
                            <div class="login-input-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                                <label for="sup-status">Access Status</label>
                                <select id="sup-status" style="width: 100%; height: 38px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 0 12px; color: #FFFFFF; outline: none; cursor: pointer;">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <!-- Blank spacer for symmetry -->
                            <div style="flex: 1; min-width: 200px;"></div>
                        </div>

                        <!-- CREDENTIALS GENERATION HUD -->
                        <div style="border: 1px solid rgba(13, 148, 136, 0.15); border-radius: 8px; padding: 16px; background: rgba(15,23,42,0.4); margin-top: 6px; display: flex; flex-direction: column; gap: 12px;">
                            <span style="font-size: 0.65rem; font-weight: 700; color: #0D9488; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px;">
                                <i data-lucide="key" style="width: 12px; height: 12px;"></i> Secure System Credentials
                            </span>
                            
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <!-- Username -->
                                <div class="login-input-group" style="flex: 1; min-width: 180px; margin-bottom: 0;" id="username-input-parent">
                                    <label for="sup-username">System Username</label>
                                    <div class="login-input-wrapper">
                                        <input type="text" id="sup-username" placeholder="e.g. rajesh99" style="padding-left: 12px; height: 38px;">
                                    </div>
                                </div>
                                
                                <!-- Password -->
                                <div class="login-input-group" style="flex: 1; min-width: 180px; margin-bottom: 0;">
                                    <label for="sup-password">Passcode</label>
                                    <div class="login-input-wrapper" style="display: flex; align-items: center; gap: 6px;">
                                        <input type="text" id="sup-password" placeholder="Passcode override" style="padding-left: 12px; height: 38px; flex: 1;">
                                        <button type="button" id="btn-generate-creds" style="height: 38px; width: 42px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #CBD5E1; transition: all 0.2s;" title="Generate Strong Passcode">
                                            <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Controls -->
                        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
                            <button type="button" id="btn-modal-cancel" style="padding: 10px 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; font-size: 0.8rem; font-weight: 600; color: #CBD5E1; cursor: pointer; transition: all 0.2s;">Abort</button>
                            <button type="submit" id="btn-modal-submit" style="padding: 10px 24px; background: var(--primary); border: 1px solid var(--primary-light); border-radius: 6px; font-size: 0.8rem; font-weight: 700; color: #FFFFFF; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(11, 107, 83, 0.3);">Save Credentials</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        if (window.lucide) {
            window.lucide.createIcons({
                attrs: { "data-lucide": true },
                nodeList: [container]
            });
        }

        // Attach UI event listeners & CRUD operations
        this.bindEvents();
        
        // Render initial supervisors listing
        this.renderTable();
    },

    /**
     * Populate supervisor directory tables
     */
    renderTable() {
        const tbody = document.getElementById("supervisor-table-body");
        if (!tbody || !window.Users) return;

        const list = window.Users.getSupervisors();
        let html = "";

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <i data-lucide="users" style="width: 32px; height: 32px; margin-bottom: 8px;"></i>
                        <p style="font-size: 0.82rem;">No Command Supervisor accounts configured on this node.</p>
                    </td>
                </tr>
            `;
            return;
        }

        list.forEach((s, index) => {
            const statusClass = s.status === 'active' ? 'safe' : 'critical';
            const statusLabel = s.status === 'active' ? 'ACTIVE' : 'INACTIVE';
            
            // Format Last login readable date
            let lastLoginStr = s.lastLogin;
            if (lastLoginStr !== "Never") {
                const d = new Date(lastLoginStr);
                lastLoginStr = d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            html += `
                <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: var(--text-muted);">${index + 1}</td>
                    <td><strong>${s.fullName}</strong></td>
                    <td style="font-family: monospace; font-size: 0.78rem;">${s.employeeId}</td>
                    <td>${s.assignedDistrict}</td>
                    <td style="font-size: 0.78rem;">${s.shiftTiming}</td>
                    <td>
                        <span class="table-risk-badge ${statusClass}" style="box-shadow: 0 0 8px var(--color-${statusClass}-bg); padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 0.68rem;">
                            ${statusLabel}
                        </span>
                    </td>
                    <td style="font-family: monospace; font-size: 0.78rem; font-weight: 600; color: var(--primary-light);">${s.username}</td>
                    <td style="font-size: 0.78rem;">${s.mobileNumber}</td>
                    <td style="font-size: 0.78rem;">${s.email}</td>
                    <td style="font-size: 0.78rem; color: var(--text-muted);">${lastLoginStr}</td>
                    <td>
                        <div style="display: flex; gap: 8px; justify-content: center;">
                            <button onclick="UsersUI.openEditModal('${s.username}')" style="background: rgba(13, 148, 136, 0.08); border: 1px solid rgba(13, 148, 136, 0.2); color: #0D9488; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s;" title="Edit details">
                                Edit
                            </button>
                            <button onclick="UsersUI.triggerDelete('${s.username}')" style="background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2); color: #DC2626; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s;" title="Remove Supervisor">
                                Remove
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    },

    /**
     * Connect UI listeners for modals, forms, cancel buttons, and passcode generators
     */
    bindEvents() {
        const addBtn = document.getElementById("btn-add-supervisor");
        const modal = document.getElementById("modal-supervisor");
        const closeBtn = document.getElementById("modal-close");
        const cancelBtn = document.getElementById("btn-modal-cancel");
        const form = document.getElementById("form-supervisor");
        const generateBtn = document.getElementById("btn-generate-creds");

        // Open Add Modal
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                this.openAddModal();
            });
        }

        // Close functions
        const closeModal = () => {
            if (modal) modal.style.display = "none";
            this.activeEditUsername = null;
        };

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

        // Form Submit handler
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Password generator trigger
        if (generateBtn) {
            generateBtn.addEventListener("click", () => {
                const passInput = document.getElementById("sup-password");
                if (passInput && window.Users) {
                    passInput.value = window.Users.generatePasscode();
                    if (window.showSystemBanner) {
                        window.showSystemBanner("Highly secure random passcode generated.");
                    }
                }
            });
        }
    },

    /**
     * Opens modal dialog for creation
     */
    openAddModal() {
        this.activeEditUsername = null;
        const modal = document.getElementById("modal-supervisor");
        const title = document.getElementById("modal-title");
        const form = document.getElementById("form-supervisor");
        const userParent = document.getElementById("username-input-parent");

        if (modal) {
            form.reset();
            this.hideModalValidationError();
            
            // Set defaults
            document.getElementById("sup-status").value = "active";
            document.getElementById("sup-district").value = "East Godavari";
            document.getElementById("sup-shift").value = "Morning Shift (06:00 - 14:00)";
            
            title.innerHTML = `<i data-lucide="user-plus" style="width: 20px; height: 20px; color: var(--primary);"></i> Add Command Supervisor`;
            if (userParent) userParent.style.display = "block"; // Show username edit block
            
            modal.style.display = "flex";

            if (window.lucide) {
                window.lucide.createIcons({
                    attrs: { "data-lucide": true },
                    nodeList: [title]
                });
            }
        }
    },

    /**
     * Opens modal dialog pre-filled with editing records
     * @param {string} username 
     */
    openEditModal(username) {
        if (!window.Users) return;
        const supervisor = window.Users.findSupervisor(username);
        if (!supervisor) return;

        this.activeEditUsername = username;
        const modal = document.getElementById("modal-supervisor");
        const title = document.getElementById("modal-title");
        const userParent = document.getElementById("username-input-parent");

        if (modal) {
            this.hideModalValidationError();

            // Populate fields
            document.getElementById("sup-fullname").value = supervisor.fullName;
            document.getElementById("sup-empid").value = supervisor.employeeId;
            document.getElementById("sup-mobile").value = supervisor.mobileNumber;
            document.getElementById("sup-email").value = supervisor.email;
            document.getElementById("sup-district").value = supervisor.assignedDistrict;
            document.getElementById("sup-shift").value = supervisor.shiftTiming;
            document.getElementById("sup-status").value = supervisor.status;
            document.getElementById("sup-username").value = supervisor.username;
            document.getElementById("sup-password").value = supervisor.password;

            title.innerHTML = `<i data-lucide="user-cog" style="width: 20px; height: 20px; color: var(--primary);"></i> Modify Officer Directory`;
            if (userParent) userParent.style.display = "none"; // Hide username editing (Primary key cannot be modified)
            
            modal.style.display = "flex";

            if (window.lucide) {
                window.lucide.createIcons({
                    attrs: { "data-lucide": true },
                    nodeList: [title]
                });
            }
        }
    },

    /**
     * Executes Form validations & dynamic CRUD operations
     */
    handleFormSubmit() {
        if (!window.Users) return;

        const fullName = document.getElementById("sup-fullname").value.trim();
        const employeeId = document.getElementById("sup-empid").value.trim();
        const mobileNumber = document.getElementById("sup-mobile").value.trim();
        const email = document.getElementById("sup-email").value.trim();
        const assignedDistrict = document.getElementById("sup-district").value;
        const shiftTiming = document.getElementById("sup-shift").value;
        const status = document.getElementById("sup-status").value;
        const username = document.getElementById("sup-username").value.trim();
        const password = document.getElementById("sup-password").value.trim();

        // 1. Client validations
        if (!fullName || !employeeId || !mobileNumber || !email || !password) {
            this.showModalValidationError("Please fill out all mandatory supervisor details.");
            return;
        }

        // Email structure validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showModalValidationError("Enter a valid government email standard profile (e.g. name@domain.com).");
            return;
        }

        // Username verification in creation mode
        if (!this.activeEditUsername && !username) {
            this.showModalValidationError("Username is required to generate portal security credentials.");
            return;
        }

        let response;
        if (this.activeEditUsername) {
            // Edit execution path
            response = window.Users.updateSupervisor(this.activeEditUsername, {
                fullName,
                mobileNumber,
                email,
                password,
                assignedDistrict,
                shiftTiming,
                status
            });
        } else {
            // Creation path
            response = window.Users.addSupervisor({
                fullName,
                employeeId,
                mobileNumber,
                email,
                username,
                password,
                assignedDistrict,
                shiftTiming,
                status
            });
        }

        if (response.success) {
            // Successful CRUD
            const modal = document.getElementById("modal-supervisor");
            if (modal) modal.style.display = "none";

            if (window.showSystemBanner) {
                window.showSystemBanner(response.message);
            }

            // Sync database rows
            this.renderTable();
            
            // Clean active targets
            this.activeEditUsername = null;
        } else {
            // Error response
            this.showModalValidationError(response.message);
        }
    },

    /**
     * Remove supervisor account
     * @param {string} username 
     */
    triggerDelete(username) {
        if (!window.Users) return;
        const supervisor = window.Users.findSupervisor(username);
        if (!supervisor) return;

        // Custom confirm dialogue
        const confirmRemove = confirm(`ICCC Security Directive:\nAre you sure you want to permanently revoke secure portal access for "${supervisor.fullName}" (${supervisor.employeeId})? This action de-seeds their account logs immediately.`);
        
        if (confirmRemove) {
            const response = window.Users.deleteSupervisor(username);
            if (response.success) {
                if (window.showSystemBanner) {
                    window.showSystemBanner(response.message);
                }
                this.renderTable();
            } else {
                alert(response.message);
            }
        }
    },

    // UI Helpers for validations
    showModalValidationError(message) {
        const toast = document.getElementById("modal-validation-toast");
        const text = document.getElementById("modal-validation-text");
        if (toast && text) {
            text.textContent = message;
            toast.style.display = "flex";
        }
    },

    hideModalValidationError() {
        const toast = document.getElementById("modal-validation-toast");
        if (toast) toast.style.display = "none";
    }
};

window.UsersUI = UsersUI;
