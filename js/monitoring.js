/**
 * Pushkara Crowd Command Center - Monitoring & Analytics Module
 * Clean, decoupled dynamic grid system supporting:
 * - Alphabetical sorting (Districts first, then Ghats within)
 * - Collapsible Area Groups
 * - Combined Search & Advanced Filters (Area, Density, Capacity) without losing operator focus/values
 * - SVG Radial Progress Rings & Dynamic Status Glow effects
 * - Dynamic Global Command Statistics (total crowd, safest, and most crowded sectors)
 * - Interactive CCTV local uploads, Drag & Drop, Zoom Lens, and diagnostic menus
 */

function initMonitoringModule() {
    // --------------------------------------------------------------------------
    // 1. DATA MODEL & TELEMETRY INITIAL STORES
    // --------------------------------------------------------------------------
    const GHATS_METADATA = window.SmartCityTelemetry ? window.SmartCityTelemetry.MONITORED_GHATS : [];

    // For backwards compatibility with original command handlers
    const GHATS = GHATS_METADATA.map(g => g.id);

    // --------------------------------------------------------------------------
    // 2. ALPHABETICAL SORTING ENGINE
    // --------------------------------------------------------------------------
    function sortAlphabetically(data) {
        // Group ghats by district
        const grouped = {};
        data.forEach(ghat => {
            if (!grouped[ghat.district]) {
                grouped[ghat.district] = [];
            }
            grouped[ghat.district].push(ghat);
        });

        // Get sorted district names
        const sortedDistricts = Object.keys(grouped).sort();

        // Sort ghats inside each district alphabetically by name
        const finalSorted = [];
        sortedDistricts.forEach(districtName => {
            const districtGhats = grouped[districtName].sort((a, b) => a.name.localeCompare(b.name));
            finalSorted.push({
                district: districtName,
                ghats: districtGhats
            });
        });

        return finalSorted;
    }

    const sortedDataStructure = sortAlphabetically(GHATS_METADATA);

    // --------------------------------------------------------------------------
    // 3. DYNAMIC CYBER GRID RENDERER
    // --------------------------------------------------------------------------
    function renderCollapsibleAreas() {
        const container = document.getElementById("monitoring-areas-container");
        if (!container) return;

        container.innerHTML = ""; // Clear loader/previous contents

        sortedDataStructure.forEach(areaGroup => {
            const districtSafeId = areaGroup.district.replace(/\s+/g, "-").toLowerCase();
            
            // Create Area Group Section container
            const areaSection = document.createElement("section");
            areaSection.className = "area-group-section";
            areaSection.id = `area-group-${districtSafeId}`;
            areaSection.setAttribute("data-district", areaGroup.district);

            // Create Area Section Collapsible Header
            const areaHeader = document.createElement("div");
            areaHeader.className = "area-section-header";
            areaHeader.innerHTML = `
                <div class="area-title-group">
                    <div class="area-title-text">
                        <h3>${areaGroup.district} District</h3>
                    </div>
                    <div class="area-meta-stats">
                        <div class="area-stat-chip" title="Total Sectors">
                            <i data-lucide="layers" class="chip-icon"></i>
                            <span>Sectors: <strong class="area-meta-value">${areaGroup.ghats.length}</strong></span>
                        </div>
                        <span class="area-meta-divider">|</span>
                        <div class="area-stat-chip" title="Total Live Crowd">
                            <i data-lucide="users" class="chip-icon"></i>
                            <span>Crowd: <strong class="area-meta-value" id="area-crowd-${districtSafeId}">0</strong></span>
                        </div>
                        <span class="area-meta-divider">|</span>
                        <div class="area-stat-chip" title="Average Occupancy %">
                            <i data-lucide="activity" class="chip-icon"></i>
                            <span>Occupancy: <strong class="area-meta-value" id="area-avg-${districtSafeId}">0%</strong></span>
                        </div>
                    </div>
                </div>
                <button class="area-collapse-btn" title="Toggle Section">
                    <i data-lucide="chevron-down"></i>
                </button>
            `;

            // Create Ghat Grid
            const grid = document.createElement("div");
            grid.className = "monitoring-grid";

            // Populate Ghat Cards
            areaGroup.ghats.forEach(ghat => {
                const ghatCard = document.createElement("div");
                ghatCard.className = "ghat-monitor-card";
                ghatCard.id = `monitor-ghat-${ghat.id}`;
                ghatCard.setAttribute("data-ghat-id", ghat.id);
                ghatCard.setAttribute("data-capacity", ghat.capacity);

                // Build detailed card HTML (inputs, stats, circular rings, camera screens)
                ghatCard.innerHTML = `
                    <div class="monitor-card-header">
                        <div class="monitor-card-header-main-group">
                            <div class="ghat-card-left-header">
                                <h3 class="monitor-ghat-name">${ghat.name}</h3>
                                <span class="monitor-ghat-district">${ghat.districtFull}</span>
                            </div>
                            <div class="ghat-card-right-metrics">
                                <!-- Capacity utilization ring -->
                                <div class="capacity-radial-container" title="Capacity Utilization">
                                    <svg class="radial-svg" width="46" height="46">
                                        <circle class="radial-bg-ring" cx="23" cy="23" r="19"/>
                                        <circle class="radial-fill-ring" id="radial-fill-${ghat.id}" cx="23" cy="23" r="19" 
                                            stroke-dasharray="119.38" stroke-dashoffset="119.38"/>
                                    </svg>
                                    <span class="radial-pct-text" id="radial-txt-${ghat.id}">0%</span>
                                </div>
                                <div class="capacity-control-wrapper">
                                    <label for="capacity-${ghat.id}">Capacity</label>
                                    <input type="number" id="capacity-${ghat.id}" class="capacity-input" value="${ghat.capacity}" min="1" step="1">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cyber Card Labels Row -->
                    <div class="cyber-card-labels-row">
                        <span class="zone-badge" id="badge-${ghat.id}">OPEN ZONE</span>
                        <div class="risk-level-badge safe" id="risk-badge-${ghat.id}">SAFE ZONE</div>
                        <span class="ai-predict-badge">✦ AI: ${ghat.aiTrend}</span>
                    </div>

                    <!-- CCTV Screen Grid -->
                    <div class="monitor-cctv-grid">
                        <!-- Camera Live In -->
                        <div class="cctv-feed-box" data-cam-type="IN">
                            <div class="cctv-screen">
                                <div class="cctv-scanline"></div>
                                <div class="cctv-hud-top">
                                    <span class="cctv-live-tag"><span class="cctv-live-dot blinking"></span> LIVE IN</span>
                                    <span class="cctv-cam-id">${ghat.camInId}</span>
                                </div>
                            </div>
                            <div class="cctv-inputs-panel">
                                <h4 class="input-panel-title">Entry counters</h4>
                                <div class="input-controls-row">
                                    <div class="counter-control">
                                        <label>Men</label>
                                        <div class="counter-input-group">
                                            <button class="cnt-btn dec" data-target="in-men-${ghat.id}">-</button>
                                            <input type="number" class="cnt-input" id="in-men-${ghat.id}" value="${ghat.inMen}" min="0">
                                            <button class="cnt-btn inc" data-target="in-men-${ghat.id}">+</button>
                                        </div>
                                    </div>
                                    <div class="counter-control">
                                        <label>Women</label>
                                        <div class="counter-input-group">
                                            <button class="cnt-btn dec" data-target="in-women-${ghat.id}">-</button>
                                            <input type="number" class="cnt-input" id="in-women-${ghat.id}" value="${ghat.inWomen}" min="0">
                                            <button class="cnt-btn inc" data-target="in-women-${ghat.id}">+</button>
                                        </div>
                                    </div>
                                    <div class="counter-control">
                                        <label>Others</label>
                                        <div class="counter-input-group">
                                            <button class="cnt-btn dec" data-target="in-others-${ghat.id}">-</button>
                                            <input type="number" class="cnt-input" id="in-others-${ghat.id}" value="${ghat.inOthers}" min="0">
                                            <button class="cnt-btn inc" data-target="in-others-${ghat.id}">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Camera Live Out -->
                        <div class="cctv-feed-box" data-cam-type="OUT">
                            <div class="cctv-screen">
                                <div class="cctv-scanline"></div>
                                <div class="cctv-hud-top">
                                    <span class="cctv-live-tag"><span class="cctv-live-dot blinking"></span> LIVE OUT</span>
                                    <span class="cctv-cam-id">${ghat.camOutId}</span>
                                </div>
                            </div>
                            <div class="cctv-inputs-panel">
                                <h4 class="input-panel-title">Exit counters</h4>
                                <div class="input-controls-row">
                                    <div class="counter-control">
                                        <label>Men</label>
                                        <div class="counter-input-group">
                                            <button class="cnt-btn dec" data-target="out-men-${ghat.id}">-</button>
                                            <input type="number" class="cnt-input" id="out-men-${ghat.id}" value="${ghat.outMen}" min="0">
                                            <button class="cnt-btn inc" data-target="out-men-${ghat.id}">+</button>
                                        </div>
                                    </div>
                                    <div class="counter-control">
                                        <label>Women</label>
                                        <div class="counter-input-group">
                                            <button class="cnt-btn dec" data-target="out-women-${ghat.id}">-</button>
                                            <input type="number" class="cnt-input" id="out-women-${ghat.id}" value="${ghat.outWomen}" min="0">
                                            <button class="cnt-btn inc" data-target="out-women-${ghat.id}">+</button>
                                        </div>
                                    </div>
                                    <div class="counter-control">
                                        <label>Others</label>
                                        <div class="counter-input-group">
                                            <button class="cnt-btn dec" data-target="out-others-${ghat.id}">-</button>
                                            <input type="number" class="cnt-input" id="out-others-${ghat.id}" value="${ghat.outOthers}" min="0">
                                            <button class="cnt-btn inc" data-target="out-others-${ghat.id}">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Flow Telemetry Metrics -->
                    <div class="monitor-stats-panel">
                        <div class="monitor-stats-row">
                            <div class="stat-box">
                                <span class="stat-lbl">TOTAL ENTERED</span>
                                <strong class="stat-val" id="tot-in-${ghat.id}">0</strong>
                            </div>
                            <div class="stat-box">
                                <span class="stat-lbl">TOTAL EXITED</span>
                                <strong class="stat-val" id="tot-out-${ghat.id}">0</strong>
                            </div>
                            <div class="stat-box main-stat">
                                <span class="stat-lbl">CURRENT CROWD</span>
                                <strong class="stat-val" id="current-${ghat.id}">0</strong>
                            </div>
                            <div class="stat-box">
                                <span class="stat-lbl">REMAINING CAP.</span>
                                <strong class="stat-val" id="remain-${ghat.id}">0</strong>
                            </div>
                        </div>

                        <!-- Occupancy text & block warning -->
                        <div class="occupancy-progress-row" style="display:none;">
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" id="progress-${ghat.id}"></div>
                            </div>
                            <span class="occupancy-text" id="occupancy-txt-${ghat.id}">0%</span>
                        </div>
                        <div class="occupancy-warning-banner" id="warning-${ghat.id}" style="display: none; margin-top: 10px;">
                            <i data-lucide="alert-triangle" style="width: 14px; height: 14px; flex-shrink: 0;"></i>
                            <span>ENTRY BLOCKED &mdash; GHAT FULL</span>
                        </div>
                    </div>

                    <!-- Timestamp Footer -->
                    <div class="card-timestamp-footer">
                        <span>Telemetry updated: ${ghat.lastUpdated}</span>
                    </div>
                `;

                grid.appendChild(ghatCard);
            });

            areaSection.appendChild(areaHeader);
            areaSection.appendChild(grid);
            container.appendChild(areaSection);

            // Bind collapsible toggler
            areaHeader.addEventListener("click", () => {
                areaSection.classList.toggle("collapsed");
            });
        });

        // Initialize Lucide icons on dynamic content
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // --------------------------------------------------------------------------
    // 4. BINDING ENTRY/EXIT INTERACTION EVENT LISTENERS
    // --------------------------------------------------------------------------
    function bindCountersAndInputs() {
        GHATS.forEach(ghatId => {
            const inputs = [
                `in-men-${ghatId}`, `in-women-${ghatId}`, `in-others-${ghatId}`,
                `out-men-${ghatId}`, `out-women-${ghatId}`, `out-others-${ghatId}`
            ];

            // Bind Capacity Field Changed
            const capEl = document.getElementById(`capacity-${ghatId}`);
            if (capEl) {
                capEl.addEventListener("input", () => {
                    let val = parseInt(capEl.value);
                    if (isNaN(val) || val <= 0) {
                        val = 5000;
                        capEl.value = val;
                    } else {
                        val = Math.floor(val);
                        capEl.value = val;
                    }
                    
                    // Keep card data capacity synchronized
                    const card = document.getElementById(`monitor-ghat-${ghatId}`);
                    if (card) {
                        card.setAttribute("data-capacity", val);
                    }

                    recalculateGhat(ghatId);
                    runAdvancedFilterSystem(); // Re-trigger filter in case capacity status changed
                });
            }

            // Bind text input controls
            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener("input", () => {
                        if (el.value < 0 || el.value === "") {
                            el.value = 0;
                        } else {
                            el.value = Math.floor(parseInt(el.value) || 0);
                        }

                        // Boundary checks for entry blocks
                        if (id.startsWith("in-")) {
                            const capacity = parseInt(document.getElementById(`capacity-${ghatId}`).value) || 5000;
                            const inMen = parseInt(document.getElementById(`in-men-${ghatId}`).value) || 0;
                            const inWomen = parseInt(document.getElementById(`in-women-${ghatId}`).value) || 0;
                            const inOthers = parseInt(document.getElementById(`in-others-${ghatId}`).value) || 0;

                            const outMen = parseInt(document.getElementById(`out-men-${ghatId}`).value) || 0;
                            const outWomen = parseInt(document.getElementById(`out-women-${ghatId}`).value) || 0;
                            const outOthers = parseInt(document.getElementById(`out-others-${ghatId}`).value) || 0;

                            const totalIn = inMen + inWomen + inOthers;
                            const totalOut = outMen + outWomen + outOthers;
                            
                            const maxAllowedIn = capacity + totalOut;
                            if (totalIn > maxAllowedIn) {
                                const excess = totalIn - maxAllowedIn;
                                el.value = Math.max(0, parseInt(el.value) - excess);
                            }
                        }

                        recalculateGhat(ghatId);
                        runAdvancedFilterSystem(); // Re-trigger filtering on density changes
                    });
                }
            });
        });

        // Bind dec/inc buttons
        const plusMinusButtons = document.querySelectorAll(".cnt-btn");
        plusMinusButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation(); // Stop card clicks
                
                const targetId = btn.getAttribute("data-target");
                const inputField = document.getElementById(targetId);
                if (!inputField) return;

                const parts = targetId.split("-");
                const ghatId = parts[parts.length - 1];

                const capacity = parseInt(document.getElementById(`capacity-${ghatId}`).value) || 5000;
                const inMen = parseInt(document.getElementById(`in-men-${ghatId}`).value) || 0;
                const inWomen = parseInt(document.getElementById(`in-women-${ghatId}`).value) || 0;
                const inOthers = parseInt(document.getElementById(`in-others-${ghatId}`).value) || 0;
                const outMen = parseInt(document.getElementById(`out-men-${ghatId}`).value) || 0;
                const outWomen = parseInt(document.getElementById(`out-women-${ghatId}`).value) || 0;
                const outOthers = parseInt(document.getElementById(`out-others-${ghatId}`).value) || 0;

                const currentCrowd = Math.max(0, (inMen + inWomen + inOthers) - (outMen + outWomen + outOthers));

                let currentVal = parseInt(inputField.value) || 0;
                if (btn.classList.contains("inc")) {
                    if (targetId.startsWith("in-") && currentCrowd >= capacity) {
                        return; // Entry Blocked
                    }
                    currentVal += 1;
                } else if (btn.classList.contains("dec")) {
                    currentVal = Math.max(0, currentVal - 1);
                }

                inputField.value = currentVal;
                
                recalculateGhat(ghatId);
                runAdvancedFilterSystem(); // Filter triggers
            });
        });
    }

    // --------------------------------------------------------------------------
    // 5. INTUITIVE REAL-TIME RECALCULATION & DENSITY TELEMETRY
    // --------------------------------------------------------------------------
    function recalculateGhat(ghatId) {
        if (!document.getElementById(`in-men-${ghatId}`)) return;

        const capacityInput = document.getElementById(`capacity-${ghatId}`);
        const capacity = parseInt(capacityInput.value) || 5000;

        const inMen = parseInt(document.getElementById(`in-men-${ghatId}`).value) || 0;
        const inWomen = parseInt(document.getElementById(`in-women-${ghatId}`).value) || 0;
        const inOthers = parseInt(document.getElementById(`in-others-${ghatId}`).value) || 0;

        const outMen = parseInt(document.getElementById(`out-men-${ghatId}`).value) || 0;
        const outWomen = parseInt(document.getElementById(`out-women-${ghatId}`).value) || 0;
        const outOthers = parseInt(document.getElementById(`out-others-${ghatId}`).value) || 0;

        const totalIn = inMen + inWomen + inOthers;
        const totalOut = outMen + outWomen + outOthers;
        const currentCrowd = Math.max(0, totalIn - totalOut);
        
        const remainingCapacity = Math.max(0, capacity - currentCrowd);
        const occupancyPct = ((currentCrowd / capacity) * 100).toFixed(1);

        // Write values back to global telemetry database to keep tabs perfectly synced
        const targetGhat = GHATS_METADATA.find(g => g.id === ghatId);
        if (targetGhat) {
            targetGhat.capacity = capacity;
            targetGhat.inMen = inMen;
            targetGhat.inWomen = inWomen;
            targetGhat.inOthers = inOthers;
            targetGhat.outMen = outMen;
            targetGhat.outWomen = outWomen;
            targetGhat.outOthers = outOthers;
            targetGhat.occupancy = currentCrowd;
            targetGhat.crowdDensity = parseFloat(occupancyPct);
            
            if (targetGhat.crowdDensity >= 88.0) {
                targetGhat.risk = "critical";
            } else if (targetGhat.crowdDensity >= 75.0) {
                targetGhat.risk = "busy";
            } else if (targetGhat.crowdDensity >= 50.0) {
                targetGhat.risk = "moderate";
            } else {
                targetGhat.risk = "safe";
            }
        }

        // Update Text Indicators
        document.getElementById(`tot-in-${ghatId}`).textContent = totalIn.toLocaleString();
        document.getElementById(`tot-out-${ghatId}`).textContent = totalOut.toLocaleString();
        document.getElementById(`current-${ghatId}`).textContent = currentCrowd.toLocaleString();
        document.getElementById(`remain-${ghatId}`).textContent = remainingCapacity.toLocaleString();
        
        // Progress Fill (keeps backwards logic for calculations)
        const progressFill = document.getElementById(`progress-${ghatId}`);
        const occupancyText = document.getElementById(`occupancy-txt-${ghatId}`);
        if (progressFill) progressFill.style.width = Math.min(100, (currentCrowd / capacity) * 100) + "%";
        if (occupancyText) occupancyText.textContent = `${occupancyPct}% occupied (${currentCrowd.toLocaleString()} / ${capacity.toLocaleString()})`;

        // Warning Banner
        const warningBanner = document.getElementById(`warning-${ghatId}`);
        const entryPlusButtons = document.querySelectorAll(`[data-target^="in-"][data-target$="-${ghatId}"].inc`);

        if (currentCrowd >= capacity) {
            if (warningBanner) {
                warningBanner.style.display = "flex";
                warningBanner.querySelector("span").innerHTML = `ENTRY BLOCKED &mdash; GHAT FULL (${currentCrowd.toLocaleString()} / ${capacity.toLocaleString()})`;
            }
            entryPlusButtons.forEach(btn => btn.disabled = true);
        } else {
            if (warningBanner) warningBanner.style.display = "none";
            entryPlusButtons.forEach(btn => btn.disabled = false);
        }

        // Capacity utilization dynamic progress ring SVG
        const ring = document.getElementById(`radial-fill-${ghatId}`);
        const ringTxt = document.getElementById(`radial-txt-${ghatId}`);
        const pctVal = parseFloat(occupancyPct);

        if (ring && ringTxt) {
            ringTxt.textContent = `${Math.round(pctVal)}%`;
            
            // stroke-dashoffset = circumference - (percent / 100 * circumference)
            // Circumference of radius 19 is exactly 119.38
            const circ = 119.38;
            const offset = circ - (Math.min(100, pctVal) / 100 * circ);
            ring.style.strokeDashoffset = offset;

            // Remove previous styling classes
            ring.classList.remove("bg-crit-pulse");
            
            // Assign responsive surveillance colors
            if (pctVal < 30) {
                ring.style.stroke = "#10B981"; // Safe Green
            } else if (pctVal <= 50) {
                ring.style.stroke = "#10B981"; // Safe Green
            } else if (pctVal <= 75) {
                ring.style.stroke = "#F59E0B"; // Yellow/Orange
            } else if (pctVal <= 90) {
                ring.style.stroke = "#EA580C"; // Busy Orange
            } else {
                ring.style.stroke = "#EF4444"; // Pulsing Critical Red
                ring.classList.add("bg-crit-pulse");
            }
        }

        // Apply Card Glowing occupancy status borders
        const card = document.getElementById(`monitor-ghat-${ghatId}`);
        const badge = document.getElementById(`badge-${ghatId}`);
        const riskBadge = document.getElementById(`risk-badge-${ghatId}`);

        if (card && badge && progressFill) {
            card.classList.remove("zone-open", "zone-crowded", "zone-highly-crowded");
            progressFill.classList.remove("bg-safe", "bg-warn", "bg-crit");

            if (pctVal < 30) {
                card.classList.add("zone-open");
                progressFill.classList.add("bg-safe");
                badge.textContent = "OPEN ZONE";
                
                if (riskBadge) {
                    riskBadge.className = "risk-level-badge safe";
                    riskBadge.textContent = "SAFE ZONE";
                }
            } else if (pctVal <= 65) {
                card.classList.add("zone-crowded");
                progressFill.classList.add("bg-warn");
                badge.textContent = "CROWDED";

                if (riskBadge) {
                    riskBadge.className = "risk-level-badge warn";
                    if (pctVal <= 50) {
                        riskBadge.textContent = "SAFE ZONE";
                    } else {
                        riskBadge.textContent = "MODERATE RISK";
                        riskBadge.className = "risk-level-badge busy";
                    }
                }
            } else {
                card.classList.add("zone-highly-crowded");
                progressFill.classList.add("bg-crit");
                badge.textContent = "HIGHLY CROWDED";

                if (riskBadge) {
                    riskBadge.className = "risk-level-badge crit";
                    riskBadge.textContent = "CRITICAL LIMIT";
                }
            }
        }

        // Update district averages and global ICCC system telemetry
        recalculateDistrictAverages();
        recalculateGlobalCommandCenterTelemetry();
        if (window.updateOverviewDashboard) {
            window.updateOverviewDashboard();
        }
        localStorage.setItem("pushkara_nigha_telemetry", JSON.stringify(window.SmartCityTelemetry));
    }

    // Recalculates district aggregate averages dynamically
    function recalculateDistrictAverages() {
        sortedDataStructure.forEach(areaGroup => {
            const districtSafeId = areaGroup.district.replace(/\s+/g, "-").toLowerCase();
            const badgeAvg = document.getElementById(`area-avg-${districtSafeId}`);
            const badgeCrowd = document.getElementById(`area-crowd-${districtSafeId}`);
            if (!badgeAvg && !badgeCrowd) return;

            let totalCapacity = 0;
            let totalCrowd = 0;

            areaGroup.ghats.forEach(ghat => {
                const capVal = parseInt(document.getElementById(`capacity-${ghat.id}`).value) || ghat.capacity;
                
                const inMen = parseInt(document.getElementById(`in-men-${ghat.id}`).value) || 0;
                const inWomen = parseInt(document.getElementById(`in-women-${ghat.id}`).value) || 0;
                const inOthers = parseInt(document.getElementById(`in-others-${ghat.id}`).value) || 0;

                const outMen = parseInt(document.getElementById(`out-men-${ghat.id}`).value) || 0;
                const outWomen = parseInt(document.getElementById(`out-women-${ghat.id}`).value) || 0;
                const outOthers = parseInt(document.getElementById(`out-others-${ghat.id}`).value) || 0;

                const current = Math.max(0, (inMen + inWomen + inOthers) - (outMen + outWomen + outOthers));

                totalCapacity += capVal;
                totalCrowd += current;
            });

            const avgOccupancy = totalCapacity > 0 ? ((totalCrowd / totalCapacity) * 100).toFixed(1) : "0.0";
            if (badgeAvg) badgeAvg.textContent = `${avgOccupancy}%`;
            if (badgeCrowd) badgeCrowd.textContent = totalCrowd.toLocaleString();
        });
    }

    // Dynamic ICCC stats ( live crowd, most crowded, and safest district )
    function recalculateGlobalCommandCenterTelemetry() {
        let totalLiveCrowd = 0;
        let totalActiveGhats = 0;

        let mostCrowdedDistrict = "N/A";
        let maxDistrictPct = -1;

        let safestDistrict = "N/A";
        let minDistrictPct = 999;

        sortedDataStructure.forEach(areaGroup => {
            let districtCapacity = 0;
            let districtCrowd = 0;

            areaGroup.ghats.forEach(ghat => {
                const card = document.getElementById(`monitor-ghat-${ghat.id}`);
                // Only count sectors that are not completely hidden by active searches/filters
                const isHidden = card ? card.classList.contains("hidden-card") : false;

                const capVal = parseInt(document.getElementById(`capacity-${ghat.id}`).value) || ghat.capacity;
                const inMen = parseInt(document.getElementById(`in-men-${ghat.id}`).value) || 0;
                const inWomen = parseInt(document.getElementById(`in-women-${ghat.id}`).value) || 0;
                const inOthers = parseInt(document.getElementById(`in-others-${ghat.id}`).value) || 0;
                const outMen = parseInt(document.getElementById(`out-men-${ghat.id}`).value) || 0;
                const outWomen = parseInt(document.getElementById(`out-women-${ghat.id}`).value) || 0;
                const outOthers = parseInt(document.getElementById(`out-others-${ghat.id}`).value) || 0;

                const current = Math.max(0, (inMen + inWomen + inOthers) - (outMen + outWomen + outOthers));

                // Command Footprint totals (always compute overall footprint)
                totalLiveCrowd += current;
                if (!isHidden) {
                    totalActiveGhats += 1;
                }

                districtCapacity += capVal;
                districtCrowd += current;
            });

            const distPct = districtCapacity > 0 ? (districtCrowd / districtCapacity) * 100 : 0;
            
            if (distPct > maxDistrictPct) {
                maxDistrictPct = distPct;
                mostCrowdedDistrict = `${areaGroup.district} (${distPct.toFixed(1)}%)`;
            }
            if (distPct < minDistrictPct) {
                minDistrictPct = distPct;
                safestDistrict = `${areaGroup.district} (${distPct.toFixed(1)}%)`;
            }
        });

        // Set telemetry labels
        const crowdEl = document.getElementById("stats-total-crowd");
        const visibleEl = document.getElementById("stats-total-ghats");
        const crowdedEl = document.getElementById("stats-most-crowded");
        const safestEl = document.getElementById("stats-safest-ghat");

        if (crowdEl) crowdEl.textContent = totalLiveCrowd.toLocaleString();
        if (visibleEl) visibleEl.textContent = totalActiveGhats;
        if (crowdedEl) crowdedEl.textContent = mostCrowdedDistrict;
        if (safestEl) safestEl.textContent = safestDistrict;
    }

    // --------------------------------------------------------------------------
    // 6. REAL-TIME SEARCH & COMBINED NEURAL FILTERS
    // --------------------------------------------------------------------------
    function runAdvancedFilterSystem() {
        const query = document.getElementById("command-search-input").value.trim().toLowerCase();
        const areaFilter = document.getElementById("filter-area").value;
        const statusFilter = document.getElementById("filter-status").value;
        const capacityFilter = document.getElementById("filter-capacity").value;

        const container = document.getElementById("command-search-bar-container");
        if (container) {
            if (query.length > 0) {
                container.classList.add("command-search-input-active");
            } else {
                container.classList.remove("command-search-input-active");
            }
        }

        let totalCardsVisible = 0;

        sortedDataStructure.forEach(areaGroup => {
            const districtSafeId = areaGroup.district.replace(/\s+/g, "-").toLowerCase();
            const areaSection = document.getElementById(`area-group-${districtSafeId}`);
            if (!areaSection) return;

            let visibleGhatsInDistrict = 0;

            areaGroup.ghats.forEach(ghat => {
                const card = document.getElementById(`monitor-ghat-${ghat.id}`);
                if (!card) return;

                // Grab dynamic telemetry attributes for accurate filtering
                const capacity = parseInt(document.getElementById(`capacity-${ghat.id}`).value) || ghat.capacity;
                const inMen = parseInt(document.getElementById(`in-men-${ghat.id}`).value) || 0;
                const inWomen = parseInt(document.getElementById(`in-women-${ghat.id}`).value) || 0;
                const inOthers = parseInt(document.getElementById(`in-others-${ghat.id}`).value) || 0;
                const outMen = parseInt(document.getElementById(`out-men-${ghat.id}`).value) || 0;
                const outWomen = parseInt(document.getElementById(`out-women-${ghat.id}`).value) || 0;
                const outOthers = parseInt(document.getElementById(`out-others-${ghat.id}`).value) || 0;

                const current = Math.max(0, (inMen + inWomen + inOthers) - (outMen + outWomen + outOthers));
                const occupancyPct = capacity > 0 ? (current / capacity) * 100 : 0;
                const camInId = card.querySelector(".cctv-feed-box[data-cam-type='IN'] .cctv-cam-id").textContent.toLowerCase();
                const camOutId = card.querySelector(".cctv-feed-box[data-cam-type='OUT'] .cctv-cam-id").textContent.toLowerCase();

                // Check 1: Search Bar (Ghat name, district, camera IDs)
                const matchesSearch = 
                    ghat.name.toLowerCase().includes(query) || 
                    ghat.districtFull.toLowerCase().includes(query) ||
                    camInId.includes(query) || 
                    camOutId.includes(query);

                // Check 2: District Filter Dropdown
                const matchesArea = (areaFilter === "all" || ghat.district === areaFilter);

                // Check 3: Density Status Filter Dropdown
                let matchesStatus = false;
                if (statusFilter === "all") {
                    matchesStatus = true;
                } else if (statusFilter === "open" && occupancyPct < 30) {
                    matchesStatus = true;
                } else if (statusFilter === "crowded" && occupancyPct >= 30 && occupancyPct <= 65) {
                    matchesStatus = true;
                } else if (statusFilter === "highly-crowded" && occupancyPct > 65) {
                    matchesStatus = true;
                }

                // Check 4: Capacity Limit range
                let matchesCapacity = false;
                if (capacityFilter === "all") {
                    matchesCapacity = true;
                } else if (capacityFilter === "low" && capacity < 7000) {
                    matchesCapacity = true;
                } else if (capacityFilter === "mid" && capacity >= 7000 && capacity <= 8500) {
                    matchesCapacity = true;
                } else if (capacityFilter === "high" && capacity > 8500) {
                    matchesCapacity = true;
                }

                // Combined visibility evaluation
                if (matchesSearch && matchesArea && matchesStatus && matchesCapacity) {
                    card.classList.remove("hidden-card");
                    visibleGhatsInDistrict++;
                    totalCardsVisible++;
                } else {
                    card.classList.add("hidden-card");
                }
            });

            // Toggle District section container visibility if no ghats are visible under it
            if (visibleGhatsInDistrict > 0) {
                areaSection.classList.remove("hidden-section");
            } else {
                areaSection.classList.add("hidden-section");
            }
        });

        // Toggle command empty state display
        const emptyState = document.getElementById("command-empty-state");
        if (emptyState) {
            if (totalCardsVisible === 0) {
                emptyState.style.display = "flex";
            } else {
                emptyState.style.display = "none";
            }
        }

        // Live statistics update
        recalculateGlobalCommandCenterTelemetry();
    }

    // Set up search and filter bar event listeners
    function initNeuralFilterBindings() {
        const searchInput = document.getElementById("command-search-input");
        const areaSelect = document.getElementById("filter-area");
        const statusSelect = document.getElementById("filter-status");
        const capSelect = document.getElementById("filter-capacity");
        const resetBtn = document.getElementById("btn-reset-filters");

        const skeleton = document.getElementById("command-loading-skeleton");
        const areaContainer = document.getElementById("monitoring-areas-container");

        function triggerFilterWithSkeletonEffect() {
            // Realistic simulated command-center loading skeleton trigger
            if (skeleton && areaContainer) {
                areaContainer.style.display = "none";
                skeleton.style.display = "flex";

                setTimeout(() => {
                    skeleton.style.display = "none";
                    areaContainer.style.display = "flex";
                    runAdvancedFilterSystem();
                }, 180);
            } else {
                runAdvancedFilterSystem();
            }
        }

        if (searchInput && !searchInput.dataset.wired) {
            searchInput.dataset.wired = 'true';
            searchInput.addEventListener("input", runAdvancedFilterSystem); // Live search
        }
        if (areaSelect && !areaSelect.dataset.wired) {
            areaSelect.dataset.wired = 'true';
            areaSelect.addEventListener("change", triggerFilterWithSkeletonEffect);
        }
        if (statusSelect && !statusSelect.dataset.wired) {
            statusSelect.dataset.wired = 'true';
            statusSelect.addEventListener("change", triggerFilterWithSkeletonEffect);
        }
        if (capSelect && !capSelect.dataset.wired) {
            capSelect.dataset.wired = 'true';
            capSelect.addEventListener("change", triggerFilterWithSkeletonEffect);
        }

        // Bind Reset Filters Button
        if (resetBtn && !resetBtn.dataset.wired) {
            resetBtn.dataset.wired = 'true';
            resetBtn.addEventListener("click", () => {
                // Clear all input elements
                if (searchInput) searchInput.value = "";
                if (areaSelect) areaSelect.value = "all";
                if (statusSelect) statusSelect.value = "all";
                if (capSelect) capSelect.value = "all";

                // Add scan telemetry advisory
                if (window.showSystemBanner) {
                    window.showSystemBanner("Diagnostics: Neural command filters successfully cleared. Restoring camera footprints...");
                }

                // Run filters with premium skeleton effect
                triggerFilterWithSkeletonEffect();
            });
        }
    }

    // --------------------------------------------------------------------------
    // 7. CCTV SURVEILLANCE MEDIA PLAYBACK ENGINE (UPGRADED)
    // --------------------------------------------------------------------------
    function initCctvVideoFeatures() {
        const screens = document.querySelectorAll(".cctv-screen");
        
        screens.forEach((screen, screenIndex) => {
            const scanline = screen.querySelector(".cctv-scanline");
            const hud = screen.querySelector(".cctv-hud-top");
            
            const camId = hud ? hud.querySelector(".cctv-cam-id").textContent : `CAM-${screenIndex}`;
            
            // Create dynamic file input
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.className = "cctv-upload-input";
            fileInput.accept = "video/mp4,video/webm,video/quicktime,.mov";
            fileInput.style.display = "none";
            screen.appendChild(fileInput);
            
            // Create dynamic video player
            const videoPlayer = document.createElement("video");
            videoPlayer.className = "cctv-video-player";
            videoPlayer.loop = true;
            videoPlayer.muted = true;
            videoPlayer.autoplay = true;
            videoPlayer.setAttribute("playsinline", "");
            videoPlayer.style.display = "none";
            screen.appendChild(videoPlayer);
            
            // Create Drag & Drop overlay
            const dragOverlay = document.createElement("div");
            dragOverlay.className = "cctv-drag-overlay";
            dragOverlay.innerHTML = `
                <i data-lucide="upload" class="drag-icon"></i>
                <span>DROP TO LIVE STREAM</span>
            `;
            screen.appendChild(dragOverlay);
            
            // Create Fallback Placeholder
            const placeholder = document.createElement("div");
            placeholder.className = "cctv-placeholder";
            placeholder.innerHTML = `
                <div class="cctv-center-icon">
                    <i data-lucide="video" style="width: 24px; height: 24px; color: rgba(255,255,255,0.45);"></i>
                </div>
                <button class="cctv-upload-trigger-btn">
                    <i data-lucide="plus" style="width: 12px; height: 12px;"></i> Upload footage
                </button>
            `;
            screen.appendChild(placeholder);
            
            // Create floating diagnostics HUD menu
            const controlsOverlay = document.createElement("div");
            controlsOverlay.className = "cctv-controls-overlay";
            controlsOverlay.innerHTML = `
                <button class="cctv-control-btn btn-change" title="Change Video">
                    <i data-lucide="refresh-cw"></i>
                </button>
                <button class="cctv-control-btn btn-toggle-controls" title="Toggle Controls">
                    <i data-lucide="sliders"></i>
                </button>
                <button class="cctv-control-btn btn-fullscreen" title="Fullscreen Mode">
                    <i data-lucide="maximize-2"></i>
                </button>
                <button class="cctv-control-btn btn-remove" title="Remove Video">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            screen.appendChild(controlsOverlay);

            // Re-render Lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
            }

            let currentObjectUrl = null;

            // Load local video file
            function loadVideoFile(file) {
                if (!file) return;
                
                const isVideo = file.type.startsWith("video/") || file.name.endsWith(".mov") || file.name.endsWith(".mp4") || file.name.endsWith(".webm");
                
                if (!isVideo) {
                    if (window.showSystemBanner) {
                        window.showSystemBanner("Invalid file type. Please upload a video (MP4, WebM, or MOV).", "error");
                    } else {
                        alert("Please upload a supported video file (MP4, WebM, or MOV).");
                    }
                    return;
                }

                if (currentObjectUrl) {
                    URL.revokeObjectURL(currentObjectUrl);
                }

                currentObjectUrl = URL.createObjectURL(file);
                videoPlayer.src = currentObjectUrl;
                videoPlayer.style.display = "block";
                placeholder.style.display = "none";
                
                videoPlayer.load();
                videoPlayer.play().catch(err => console.log("Playback error:", err));

                if (window.showSystemBanner) {
                    window.showSystemBanner(`Surveillance Feed ${camId} successfully updated with user crowd footage.`);
                }
            }

            // Reset video stream
            function removeVideoFeed() {
                videoPlayer.pause();
                videoPlayer.src = "";
                videoPlayer.style.display = "none";
                placeholder.style.display = "flex";
                
                if (currentObjectUrl) {
                    URL.revokeObjectURL(currentObjectUrl);
                    currentObjectUrl = null;
                }

                videoPlayer.removeAttribute("controls");

                if (window.showSystemBanner) {
                    window.showSystemBanner(`Surveillance Feed ${camId} reset to standard inactive CCTV state.`);
                }
            }

            // Click triggers
            fileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) loadVideoFile(file);
            });

            const uploadBtn = placeholder.querySelector(".cctv-upload-trigger-btn");
            uploadBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                fileInput.click();
            });

            screen.addEventListener("click", (e) => {
                if (!currentObjectUrl && !e.target.closest("button")) {
                    fileInput.click();
                }
            });

            // Drag & Drop
            screen.addEventListener("dragenter", (e) => {
                e.preventDefault();
                e.stopPropagation();
                screen.classList.add("drag-active");
            });

            screen.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.stopPropagation();
                screen.classList.add("drag-active");
            });

            screen.addEventListener("dragleave", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = screen.getBoundingClientRect();
                if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY >= rect.bottom) {
                    screen.classList.remove("drag-active");
                }
            });

            screen.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation();
                screen.classList.remove("drag-active");

                const files = e.dataTransfer.files;
                if (files.length > 0) loadVideoFile(files[0]);
            });

            // Operator actions
            controlsOverlay.querySelector(".btn-change").addEventListener("click", (e) => {
                e.stopPropagation();
                fileInput.click();
            });

            controlsOverlay.querySelector(".btn-toggle-controls").addEventListener("click", (e) => {
                e.stopPropagation();
                if (videoPlayer.hasAttribute("controls")) {
                    videoPlayer.removeAttribute("controls");
                    if (window.showSystemBanner) window.showSystemBanner(`Playback controls hidden on ${camId}`);
                } else {
                    videoPlayer.setAttribute("controls", "true");
                    if (window.showSystemBanner) window.showSystemBanner(`Playback controls enabled on ${camId}`);
                }
            });

            const btnFullscreen = controlsOverlay.querySelector(".btn-fullscreen");
            btnFullscreen.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!document.fullscreenElement) {
                    screen.requestFullscreen().catch(err => console.error(err));
                } else {
                    document.exitFullscreen();
                }
            });

            controlsOverlay.querySelector(".btn-remove").addEventListener("click", (e) => {
                e.stopPropagation();
                removeVideoFeed();
            });

            document.addEventListener("fullscreenchange", () => {
                const icon = btnFullscreen.querySelector("i") || btnFullscreen.querySelector("svg");
                if (document.fullscreenElement === screen) {
                    if (icon) icon.setAttribute("data-lucide", "minimize-2");
                } else {
                    if (icon) icon.setAttribute("data-lucide", "maximize-2");
                }
                if (window.lucide) window.lucide.createIcons();
            });
        });
    }

    // --------------------------------------------------------------------------
    // 8. MASTER SURVEILLANCE INITIALIZATION SEQUENCE
    // --------------------------------------------------------------------------
    function initSurveillanceCommandCenter() {
        // Step 1: RenderCollapsibleAreas ordered alphabetically
        renderCollapsibleAreas();

        // Step 2: Bind entry/exit input listeners, counters, dec/inc buttons
        bindCountersAndInputs();

        // Step 3: Run recalculate on all ghats to compute occupancy rings, border status glow
        GHATS.forEach(id => recalculateGhat(id));

        // Step 4: Inject and initialize the dynamic CCTV camera feed local uploads
        initCctvVideoFeatures();

        // Step 5: Bind the Sticky Advanced search bar & districts dropdown selectors
        initNeuralFilterBindings();
        
        // Step 6: Recalculate Global Command statistics
        recalculateGlobalCommandCenterTelemetry();
    // Expose inner function
    window.initSurveillanceCommandCenter = initSurveillanceCommandCenter;

    // Fire the command sequence
    initSurveillanceCommandCenter();
}

window.initMonitoringModule = initMonitoringModule;

if (document.readyState === "complete" || document.readyState === "interactive") {
    initMonitoringModule();
} else {
    document.addEventListener("DOMContentLoaded", initMonitoringModule);
}
