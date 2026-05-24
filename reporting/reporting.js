/**
 * Pushkara Nigha - Command Officer Shift Management and Reporting
 * Dynamic Government ICCC tables, active metrics cards, instant filters, and CSV/Print reporters.
 */

const Reporting = {
    // Master database of officer shifts pre-seeded for government operations
    OFFICERS: [
        {
            name: "Officer Rajesh Kumar",
            employeeId: "SUP-2026-009",
            district: "East Godavari",
            ghat: "Dowleswaram Ghat",
            shiftType: "Morning Shift",
            startTime: "06:00 AM",
            endTime: "02:00 PM",
            status: "active",
            attendance: "Present",
            contactNumber: "+91 98480 22334",
            reportingOfficer: "Collector East Godavari",
            emergencyContact: "+91 98480 11223"
        },
        {
            name: "Officer Anjali Naidu",
            employeeId: "SUP-2026-015",
            district: "West Godavari",
            ghat: "Kovvur Ghat",
            shiftType: "Afternoon Shift",
            startTime: "02:00 PM",
            endTime: "10:00 PM",
            status: "break",
            attendance: "Present",
            contactNumber: "+91 81223 99881",
            reportingOfficer: "Collector West Godavari",
            emergencyContact: "+91 81223 88776"
        },
        {
            name: "Officer Srinivas Rao",
            employeeId: "SUP-2026-033",
            district: "Khammam",
            ghat: "Bhadrachalam Main Ghat",
            shiftType: "Night Shift",
            startTime: "10:00 PM",
            endTime: "06:00 AM",
            status: "offline",
            attendance: "Absent",
            contactNumber: "+91 99008 77665",
            reportingOfficer: "SP Khammam Police",
            emergencyContact: "+91 99008 66554"
        },
        {
            name: "Inspector M. Venkatesh",
            employeeId: "ERT-2026-102",
            district: "East Godavari",
            ghat: "Pushkar Ghat",
            shiftType: "Emergency Response Shift",
            startTime: "08:00 AM",
            endTime: "08:00 PM",
            status: "active",
            attendance: "Present",
            contactNumber: "+91 94405 55432",
            reportingOfficer: "DIG Godavari Range",
            emergencyContact: "+91 94405 44321"
        },
        {
            name: "Officer K. Rama Devi",
            employeeId: "SUP-2026-042",
            district: "West Godavari",
            ghat: "Pattiseema Ghat",
            shiftType: "Morning Shift",
            startTime: "06:00 AM",
            endTime: "02:00 PM",
            status: "active",
            attendance: "Present",
            contactNumber: "+91 73820 11229",
            reportingOfficer: "Sub-Collector Kovvur",
            emergencyContact: "+91 73820 22330"
        },
        {
            name: "Officer Ch. Sai Kiran",
            employeeId: "SUP-2026-056",
            district: "Khammam",
            ghat: "Koonavaram Ghat",
            shiftType: "Afternoon Shift",
            startTime: "02:00 PM",
            endTime: "10:00 PM",
            status: "offline",
            attendance: "Present",
            contactNumber: "+91 88970 44332",
            reportingOfficer: "RDO Bhadrachalam",
            emergencyContact: "+91 88970 33221"
        },
        {
            name: "Officer T. Prasanna",
            employeeId: "SUP-2026-078",
            district: "East Godavari",
            ghat: "Kotipalli Ghat",
            shiftType: "Afternoon Shift",
            startTime: "02:00 PM",
            endTime: "10:00 PM",
            status: "break",
            attendance: "Present",
            contactNumber: "+91 91772 88991",
            reportingOfficer: "Collector East Godavari",
            emergencyContact: "+91 91772 77880"
        },
        {
            name: "Commander B. Ravi",
            employeeId: "ERT-2026-118",
            district: "West Godavari",
            ghat: "Narasapuram Ghat",
            shiftType: "Emergency Response Shift",
            startTime: "08:00 AM",
            endTime: "08:00 PM",
            status: "active",
            attendance: "Present",
            contactNumber: "+91 95503 66110",
            reportingOfficer: "Commandant SDRF AP",
            emergencyContact: "+91 95503 55009"
        }
    ],

    /**
     * Initializes and renders the complete custom shift panel inside `#section-reporting`
     */
    init() {
        const reportingSec = document.getElementById("section-reporting");
        if (!reportingSec) return;

        console.log("Reporting: Rendering Command Officer Shift Management interface...");

        // Inject shift structures replacing simple placeholder cards
        reportingSec.innerHTML = `
            <!-- Premium Cyber-ICCC Shift Statistics Grid -->
            <div class="overview-stats-grid" style="margin-bottom: 20px;">
                <div class="overview-stat-card active-ghats" style="--accent-color: #10B981;">
                    <div class="stat-header">
                        <span class="stat-title">Active Officers</span>
                        <div class="stat-icon-wrapper" style="color: #10B981; background: rgba(16, 185, 129, 0.05);">
                            <i data-lucide="shield"></i>
                        </div>
                    </div>
                    <div class="stat-body">
                        <span class="stat-number" id="stats-active-officers">0</span>
                    </div>
                    <div class="stat-footer-text">On duty now</div>
                    <div class="stat-glow-border"></div>
                </div>

                <div class="overview-stat-card high-risk" style="--accent-color: #DC2626;">
                    <div class="stat-header">
                        <span class="stat-title">Offline Officers</span>
                        <div class="stat-icon-wrapper" style="color: #DC2626; background: rgba(220, 38, 38, 0.05);">
                            <i data-lucide="shield-alert"></i>
                        </div>
                    </div>
                    <div class="stat-body">
                        <span class="stat-number" id="stats-offline-officers">0</span>
                    </div>
                    <div class="stat-footer-text">Pending sign-ins</div>
                    <div class="stat-glow-border"></div>
                </div>

                <div class="overview-stat-card active-cams" style="--accent-color: #8b5cf6;">
                    <div class="stat-header">
                        <span class="stat-title">Emergency Teams</span>
                        <div class="stat-icon-wrapper" style="color: #8b5cf6; background: rgba(139, 92, 246, 0.05);">
                            <i data-lucide="flame"></i>
                        </div>
                    </div>
                    <div class="stat-body">
                        <span class="stat-number" id="stats-ert-teams">0</span>
                    </div>
                    <div class="stat-footer-text">QRT & SDRF active</div>
                    <div class="stat-glow-border"></div>
                </div>

                <div class="overview-stat-card safe-zones" style="--accent-color: #06b6d4;">
                    <div class="stat-header">
                        <span class="stat-title">Attendance Rate</span>
                        <div class="stat-icon-wrapper" style="color: #06b6d4; background: rgba(6, 182, 212, 0.05);">
                            <i data-lucide="check-circle"></i>
                        </div>
                    </div>
                    <div class="stat-body">
                        <span class="stat-number" id="stats-attendance-rate">0%</span>
                    </div>
                    <div class="stat-footer-text">Of pre-seeded registers</div>
                    <div class="stat-glow-border"></div>
                </div>

                <div class="overview-stat-card ai-alerts" style="--accent-color: #f59e0b;">
                    <div class="stat-header">
                        <span class="stat-title">Sync Pulse</span>
                        <div class="stat-icon-wrapper" style="color: #f59e0b; background: rgba(245, 158, 11, 0.05);">
                            <i data-lucide="clock"></i>
                        </div>
                    </div>
                    <div class="stat-body">
                        <span class="stat-number" id="stats-sync-pulse" style="font-size: 1.3rem; font-weight: 800; line-height: 2;">00:00:00</span>
                    </div>
                    <div class="stat-footer-text">Last secure handshake</div>
                    <div class="stat-glow-border"></div>
                </div>
            </div>

            <!-- ICCC Shift Control & Interactive Table Panel -->
            <div class="dashboard-card" style="margin-bottom: 24px;">
                <div class="map-header-row" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <span class="map-section-label">ICCC DIRECTORY PLATFORM</span>
                        <h3 class="map-title" style="margin-top: 2px;">Command Officer Shift Management</h3>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button id="btn-export-shifts" class="sidebar-action-btn" style="width: auto; padding: 0 16px; height: 32px; border-color: rgba(13, 148, 136, 0.3); color: #0D9488; display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="download" style="width: 14px; height: 14px;"></i> Export Report
                        </button>
                        <button id="btn-print-shifts" class="sidebar-action-btn" style="width: auto; padding: 0 16px; height: 32px; background: var(--primary); color: #FFFFFF; border-color: var(--primary); display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="printer" style="width: 14px; height: 14px;"></i> Print Roster
                        </button>
                    </div>
                </div>

                <!-- Live Command Filters HUD -->
                <div class="command-controls-bar" style="margin-bottom: 20px; border-radius: 8px; border: 1px solid var(--border-light); background: rgba(15, 23, 42, 0.02); padding: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
                    
                    <!-- Search Input -->
                    <div class="control-group search-group" style="flex: 1.5; min-width: 200px;">
                        <label for="shift-search"><i data-lucide="search" style="width: 12px; height: 12px;"></i> Search Officer / ID</label>
                        <div class="command-search-wrapper" style="position: relative;">
                            <i data-lucide="search" class="search-icon" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: var(--text-muted);"></i>
                            <input type="text" id="shift-search" placeholder="Type officer name, ID, or ghat..." style="padding-left: 32px; height: 36px; border: 1px solid var(--border-light); background: var(--bg-card); border-radius: var(--radius-sm); font-size: 0.8rem; width: 100%;">
                        </div>
                    </div>

                    <!-- District Filter -->
                    <div class="control-group" style="flex: 1; min-width: 140px;">
                        <label for="shift-filter-district"><i data-lucide="map-pin" style="width: 12px; height: 12px;"></i> District</label>
                        <select id="shift-filter-district" class="command-select" style="height: 36px; border: 1px solid var(--border-light); background: var(--bg-card); border-radius: var(--radius-sm); font-size: 0.8rem; width: 100%; padding: 0 8px;">
                            <option value="all">All Districts</option>
                            <option value="East Godavari">East Godavari</option>
                            <option value="West Godavari">West Godavari</option>
                            <option value="Khammam">Khammam</option>
                        </select>
                    </div>

                    <!-- Shift Type Filter -->
                    <div class="control-group" style="flex: 1; min-width: 140px;">
                        <label for="shift-filter-type"><i data-lucide="clock" style="width: 12px; height: 12px;"></i> Shift Timing</label>
                        <select id="shift-filter-type" class="command-select" style="height: 36px; border: 1px solid var(--border-light); background: var(--bg-card); border-radius: var(--radius-sm); font-size: 0.8rem; width: 100%; padding: 0 8px;">
                            <option value="all">All Shifts</option>
                            <option value="Morning Shift">Morning Shift</option>
                            <option value="Afternoon Shift">Afternoon Shift</option>
                            <option value="Night Shift">Night Shift</option>
                            <option value="Emergency Response Shift">Emergency Response Shift</option>
                        </select>
                    </div>

                    <!-- Attendance Status Filter -->
                    <div class="control-group" style="flex: 1; min-width: 140px;">
                        <label for="shift-filter-attendance"><i data-lucide="check-circle" style="width: 12px; height: 12px;"></i> Attendance</label>
                        <select id="shift-filter-attendance" class="command-select" style="height: 36px; border: 1px solid var(--border-light); background: var(--bg-card); border-radius: var(--radius-sm); font-size: 0.8rem; width: 100%; padding: 0 8px;">
                            <option value="all">All Records</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                </div>

                <!-- Shift table section scroll container -->
                <div class="surveillance-table-responsive-wrapper" style="border: 1px solid var(--border-light); border-radius: 8px; overflow-x: auto; background: var(--bg-card);">
                    <table class="surveillance-cyber-table" style="min-width: 1200px;">
                        <thead>
                            <tr>
                                <th style="width: 40px; padding: 12px 16px;">#</th>
                                <th>Officer Name</th>
                                <th>Employee ID</th>
                                <th>Assigned District</th>
                                <th>Assigned Ghat</th>
                                <th>Shift Type</th>
                                <th>Shift Schedule</th>
                                <th>Current Status</th>
                                <th>Attendance</th>
                                <th>Contact Number</th>
                                <th>Reporting Authority</th>
                                <th>Emergency Contact</th>
                            </tr>
                        </thead>
                        <tbody id="shift-table-body">
                            <!-- Populated Dynamically -->
                        </tbody>
                    </table>
                </div>

                <!-- Empty Telemetry indicator -->
                <div id="shift-empty-state" style="display: none; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i data-lucide="info" style="width: 36px; height: 36px; margin-bottom: 12px;"></i>
                    <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary);">No active officers match criteria</h4>
                    <p style="font-size: 0.76rem; margin-top: 4px;">Adjust your active parameters or keyword queries.</p>
                </div>
            </div>
        `;

        if (window.lucide) {
            window.lucide.createIcons({
                attrs: { "data-lucide": true },
                nodeList: [reportingSec]
            });
        }

        // Attach DOM listeners & filters hooks
        this.bindEvents();

        // Calculate and load roster data
        this.renderStats();
        this.renderTable(this.OFFICERS);

        // Run real-time dynamic sync ticking
        this.startSyncTimer();
    },

    /**
     * Compute statistics and active counts dynamically based on officer arrays
     */
    renderStats() {
        const activeCount = this.OFFICERS.filter(o => o.status === 'active' || o.status === 'break').length;
        const offlineCount = this.OFFICERS.filter(o => o.status === 'offline').length;
        const emergencyCount = this.OFFICERS.filter(o => o.shiftType.toLowerCase().includes('emergency')).length;
        
        const presentCount = this.OFFICERS.filter(o => o.attendance === 'Present').length;
        const totalCount = this.OFFICERS.length;
        const attendanceRate = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;

        const set = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        set("stats-active-officers", activeCount);
        set("stats-offline-officers", offlineCount);
        set("stats-ert-teams", emergencyCount);
        set("stats-attendance-rate", `${attendanceRate}%`);
    },

    /**
     * Renders standard table rows depending on loaded list filtering
     * @param {Array} list 
     */
    renderTable(list) {
        const tbody = document.getElementById("shift-table-body");
        const emptyState = document.getElementById("shift-empty-state");
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = "";
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        let html = "";
        list.forEach((o, index) => {
            let badgeClass = "safe"; // green
            let badgeText = "ACTIVE";
            if (o.status === 'break') {
                badgeClass = "busy"; // orange
                badgeText = "ON BREAK";
            } else if (o.status === 'offline') {
                badgeClass = "critical"; // red
                badgeText = "OFFLINE";
            }

            const attendanceClass = o.attendance === 'Present' ? 'safe' : 'critical';

            html += `
                <tr style="transition: background-color var(--transition-fast);">
                    <td style="padding: 12px 16px; font-weight: 600; color: var(--text-muted);">${index + 1}</td>
                    <td><strong>${o.name}</strong></td>
                    <td style="font-family: monospace; font-size: 0.78rem;">${o.employeeId}</td>
                    <td>${o.district}</td>
                    <td>${o.ghat}</td>
                    <td style="font-weight: 500;">${o.shiftType}</td>
                    <td style="font-size: 0.78rem;">${o.startTime} - ${o.endTime}</td>
                    <td>
                        <span class="table-risk-badge ${badgeClass}" style="box-shadow: 0 0 8px var(--color-${badgeClass}-bg); padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 0.68rem;">
                            ${badgeText}
                        </span>
                    </td>
                    <td>
                        <span class="table-zone-badge ${attendanceClass === 'safe' ? 'open' : 'highly-crowded'}" style="padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600;">
                            ${o.attendance}
                        </span>
                    </td>
                    <td style="font-size: 0.78rem;">${o.contactNumber}</td>
                    <td>${o.reportingOfficer}</td>
                    <td style="font-size: 0.78rem;">${o.emergencyContact}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    },

    /**
     * Event listeners binding for text search boxes and filter selectors
     */
    bindEvents() {
        const searchInput = document.getElementById("shift-search");
        const districtSelect = document.getElementById("shift-filter-district");
        const typeSelect = document.getElementById("shift-filter-type");
        const attendanceSelect = document.getElementById("shift-filter-attendance");
        const exportBtn = document.getElementById("btn-export-shifts");
        const printBtn = document.getElementById("btn-print-shifts");

        const triggerFilter = () => {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            const district = districtSelect ? districtSelect.value : "all";
            const shiftType = typeSelect ? typeSelect.value : "all";
            const attendance = attendanceSelect ? attendanceSelect.value : "all";

            const filtered = this.OFFICERS.filter(o => {
                // Search query matching
                const matchesQuery = query === "" || 
                    o.name.toLowerCase().includes(query) ||
                    o.employeeId.toLowerCase().includes(query) ||
                    o.ghat.toLowerCase().includes(query);

                // District dropdown matching
                const matchesDistrict = district === "all" || o.district === district;

                // Shift type dropdown matching
                const matchesType = shiftType === "all" || o.shiftType === shiftType;

                // Attendance dropdown matching
                const matchesAttendance = attendance === "all" || o.attendance === attendance;

                return matchesQuery && matchesDistrict && matchesType && matchesAttendance;
            });

            this.renderTable(filtered);
        };

        if (searchInput) searchInput.addEventListener("input", triggerFilter);
        if (districtSelect) districtSelect.addEventListener("change", triggerFilter);
        if (typeSelect) typeSelect.addEventListener("change", triggerFilter);
        if (attendanceSelect) attendanceSelect.addEventListener("change", triggerFilter);

        // 1. CSV Dynamic Exporter
        if (exportBtn) {
            exportBtn.addEventListener("click", () => {
                this.exportToCSV();
            });
        }

        // 2. Custom Printer Layout
        if (printBtn) {
            printBtn.addEventListener("click", () => {
                this.printRoster();
            });
        }
    },

    /**
     * Real-time sync clocks updater to simulate dynamic security polling
     */
    startSyncTimer() {
        const syncEl = document.getElementById("stats-sync-pulse");
        if (!syncEl) return;

        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];
            syncEl.textContent = timeStr;
        };

        updateClock();
        setInterval(updateClock, 1000);
    },

    /**
     * Downloads dynamic CSV representations of loaded rosters
     */
    exportToCSV() {
        // Collect records
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // CSV Headers
        csvContent += "S.No,Officer Name,Employee ID,Assigned District,Assigned Ghat,Shift Type,Shift Start,Shift End,Status,Attendance,Contact,Reporting Officer,Emergency Contact\n";

        this.OFFICERS.forEach((o, index) => {
            const row = [
                index + 1,
                `"${o.name}"`,
                `"${o.employeeId}"`,
                `"${o.district}"`,
                `"${o.ghat}"`,
                `"${o.shiftType}"`,
                `"${o.startTime}"`,
                `"${o.endTime}"`,
                `"${o.status.toUpperCase()}"`,
                `"${o.attendance}"`,
                `"${o.contactNumber}"`,
                `"${o.reportingOfficer}"`,
                `"${o.emergencyContact}"`
            ].join(",");
            csvContent += row + "\n";
        });

        // Trigger safe client download browser-hook
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `PN_Officer_Shift_Roster_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);

        if (window.showSystemBanner) {
            window.showSystemBanner("Shift roster CSV compiled. File download ready.");
        }
    },

    /**
     * Triggers beautifully-formatted printable roster views in native windows
     */
    printRoster() {
        const activeUser = window.Session ? window.Session.get() : { fullName: "System Operator", role: "Operator" };
        const now = new Date();
        const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();

        // Create virtual printable wrapper window
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            alert("Popup blocker blocked the print layout. Allow popups on this command node.");
            return;
        }

        let tableRowsHTML = "";
        this.OFFICERS.forEach((o, index) => {
            tableRowsHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${o.name}</strong></td>
                    <td>${o.employeeId}</td>
                    <td>${o.district}</td>
                    <td>${o.ghat}</td>
                    <td>${o.shiftType}</td>
                    <td>${o.startTime} - ${o.endTime}</td>
                    <td>${o.status.toUpperCase()}</td>
                    <td>${o.attendance}</td>
                    <td>${o.contactNumber}</td>
                    <td>${o.reportingOfficer}</td>
                </tr>
            `;
        });

        // HTML Layout for paper document printing
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Pushkara Nigha - Officer Shift Roster Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #1e293b;
                        padding: 30px;
                        margin: 0;
                    }
                    .header {
                        border-bottom: 2px solid #0f172a;
                        padding-bottom: 12px;
                        margin-bottom: 24px;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                    .title h1 {
                        margin: 0;
                        font-size: 1.6rem;
                        color: #0b6b53;
                        letter-spacing: -0.01em;
                    }
                    .title p {
                        margin: 4px 0 0 0;
                        font-size: 0.85rem;
                        color: #64748b;
                    }
                    .meta {
                        text-align: right;
                        font-size: 0.8rem;
                        color: #475569;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 0.8rem;
                        margin-bottom: 40px;
                    }
                    th {
                        background: #f1f5f9;
                        border: 1px solid #cbd5e1;
                        padding: 8px 10px;
                        text-align: left;
                        font-weight: bold;
                    }
                    td {
                        border: 1px solid #e2e8f0;
                        padding: 8px 10px;
                    }
                    tr:nth-child(even) {
                        background: #f8fafc;
                    }
                    .footer {
                        border-top: 1px solid #cbd5e1;
                        padding-top: 12px;
                        font-size: 0.75rem;
                        color: #94a3b8;
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">
                        <h1>PUSHKARA NIGHA - AI CROWD COMMAND CENTER</h1>
                        <p>Official Government ICCC Officer Shift Roster Report</p>
                    </div>
                    <div class="meta">
                        <div><strong>Report Generated:</strong> ${dateStr}</div>
                        <div><strong>Operator Node:</strong> ${activeUser.fullName} (${activeUser.role.toUpperCase()})</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Officer Name</th>
                            <th>Employee ID</th>
                            <th>District</th>
                            <th>Ghat Area</th>
                            <th>Shift Type</th>
                            <th>Schedule</th>
                            <th>Status</th>
                            <th>Attendance</th>
                            <th>Contact</th>
                            <th>Reporting Officer</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHTML}
                    </tbody>
                </table>

                <div class="footer">
                    <div>© 2026 Government of Andhra Pradesh | Integrated Crowd Command Center (ICCC)</div>
                    <div>Page 1 of 1</div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
};

window.Reporting = Reporting;
