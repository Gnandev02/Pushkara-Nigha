

function initDashboardModule() {
    
    const db = window.SmartCityTelemetry;
    if (!db) {
        console.error("Smart City Crowd Telemetry database not loaded.");
        return;
    }

    
    const mapHotspotLayer = document.querySelector(".map-hotspots-layer");
    const mapTooltip = document.querySelector(".map-tooltip");
    const alertQueueContainer = document.getElementById("alert-queue-container");
    const cctvGridContainer = document.getElementById("cctv-grid-container");
    const aiPredictionsContainer = document.getElementById("ai-predictions-container");
    
    
    let selectedGhatId = "ghat-dowleswaram";

    
    renderKPIs(db.SYSTEM_STATUS, db.MONITORED_GHATS);
    renderMapHotspots(db.MONITORED_GHATS);
    renderAlertQueue(db.MONITORED_GHATS);
    renderCCTVFeeds(db.CCTV_FEEDS);
    renderAIPredictions(db.AI_RECOMMENDATIONS);
    initOverviewDashboard();

    
    function animateCounter(elementId, targetValue, duration = 1500, suffix = "", isLocale = true) {
        const el = document.getElementById(elementId);
        if (!el) return;

        let start = 0;
        const increment = targetValue / (duration / 16); 

        function update() {
            start += increment;
            if (start >= targetValue) {
                el.textContent = isLocale ? Math.floor(targetValue).toLocaleString() + suffix : Math.floor(targetValue) + suffix;
            } else {
                el.textContent = isLocale ? Math.floor(start).toLocaleString() + suffix : Math.floor(start) + suffix;
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    function renderKPIs(status, ghats) {
        const totalOccupancy = ghats.reduce((acc, g) => acc + g.occupancy, 0);
        const totalCapacity = ghats.reduce((acc, g) => acc + g.capacity, 0);
        const occupancyPct = ((totalOccupancy / totalCapacity) * 100).toFixed(1);
        const activeIncidents = db.INCIDENT_LOGS.filter(inc => inc.status !== "resolved").length;
        const criticalAlerts = ghats.filter(g => g.risk === "critical").length;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        set("kpi-monitored-ghats", status.totalMonitoredGhats);
        set("kpi-live-occupancy", occupancyPct + "%");
        set("kpi-open-incidents", activeIncidents);
        set("kpi-critical-alerts", criticalAlerts);
        set("kpi-citizen-reports", status.citizenReportsReceived);
        set("kpi-camera-footprint", status.activeFeeds.toLocaleString());
    }

    
    function renderMapHotspots(ghats) {
        if (!mapHotspotLayer) return;
        mapHotspotLayer.innerHTML = ""; 

        ghats.forEach(ghat => {
            const marker = document.createElement("div");
            marker.className = `map-marker ${ghat.risk}`;
            marker.style.left = `${ghat.coordinates.x}%`;
            marker.style.top = `${ghat.coordinates.y}%`;
            marker.id = `marker-${ghat.id}`;

            
            const wave = document.createElement("div");
            wave.className = "radar-wave";
            marker.appendChild(wave);

            
            const dot = document.createElement("div");
            dot.className = "marker-dot";
            marker.appendChild(dot);

            
            mapHotspotLayer.appendChild(marker);

            
            marker.addEventListener("mouseenter", (e) => {
                showMapTooltip(e, ghat);
                marker.classList.add("hovered");
            });

            marker.addEventListener("mouseleave", () => {
                hideMapTooltip();
                marker.classList.remove("hovered");
            });

            marker.addEventListener("mousemove", (e) => {
                positionMapTooltip(e);
            });

            
            marker.addEventListener("click", () => {
                selectedGhatId = ghat.id;
                
                
                document.querySelectorAll(".map-marker").forEach(m => m.classList.remove("active-selected"));
                marker.classList.add("active-selected");

                
                filterCCTVFeedsByGhat(ghat);

                if (window.showSystemBanner) {
                    window.showSystemBanner(`Selected: ${ghat.name} - ${ghat.occupancy.toLocaleString()} active devotees`);
                }
            });
        });
    }

    function showMapTooltip(e, ghat) {
        if (!mapTooltip) return;

        const occupancyPct = ghat.crowdDensity.toFixed(1);
        
        mapTooltip.innerHTML = `
            <div class="tooltip-name">${ghat.name}</div>
            <div class="tooltip-occupancy">${occupancyPct}% occupied</div>
        `;

        mapTooltip.classList.add("visible");
        positionMapTooltip(e);
    }

    function positionMapTooltip(e) {
        if (!mapTooltip) return;
        
        const mapContainer = document.querySelector(".map-visualization-wrapper");
        const rect = mapContainer.getBoundingClientRect();
        
        
        const x = e.clientX - rect.left + 15;
        const y = e.clientY - rect.top + 15;
        
        
        const tooltipWidth = mapTooltip.offsetWidth || 220;
        const tooltipHeight = mapTooltip.offsetHeight || 130;
        
        let finalX = x;
        let finalY = y;
        
        if (x + tooltipWidth > rect.width) {
            finalX = x - tooltipWidth - 30;
        }
        if (y + tooltipHeight > rect.height) {
            finalY = rect.height - tooltipHeight - 15;
        }

        mapTooltip.style.left = `${finalX}px`;
        mapTooltip.style.top = `${finalY}px`;
    }

    function hideMapTooltip() {
        if (mapTooltip) {
            mapTooltip.classList.remove("visible");
        }
    }

    
    function renderAlertQueue(ghats) {
        if (!alertQueueContainer) return;
        alertQueueContainer.innerHTML = "";

        
        const sortedGhats = [...ghats].sort((a, b) => b.crowdDensity - a.crowdDensity);

        sortedGhats.forEach(ghat => {
            const density = ghat.crowdDensity;
            let progressColor = "var(--color-safe)";
            if (ghat.risk === "critical") progressColor = "var(--color-critical)";
            else if (ghat.risk === "busy") progressColor = "var(--color-busy)";
            else if (ghat.risk === "moderate") progressColor = "var(--color-moderate)";

            const queueItem = document.createElement("div");
            queueItem.className = `alert-queue-item ${ghat.risk}`;
            
            queueItem.innerHTML = `
                <div class="queue-item-header">
                    <div>
                        <h4 class="queue-item-title">${ghat.name}</h4>
                        <span class="queue-item-subtitle">${ghat.district}</span>
                    </div>
                    <span class="queue-badge ${ghat.risk}">${ghat.risk}</span>
                </div>
                <div class="queue-item-progress">
                    <div class="progress-info">
                        <span>Density Index</span>
                        <strong>${density.toFixed(1)}%</strong>
                    </div>
                    <div class="progress-bar-track" style="height: 6px; background-color: var(--border-light); border-radius: 999px; overflow: hidden; margin-top: 6px;">
                        <div class="progress-bar-fill" style="width: 0%; height: 100%; background-color: ${progressColor}; border-radius: 999px;"></div>
                    </div>
                    <div class="queue-footer-stats">
                        <span>${ghat.occupancy.toLocaleString()} / ${ghat.capacity.toLocaleString()} max</span>
                        <span>${ghat.camerasCount} Active Cams</span>
                    </div>
                </div>
            `;

            alertQueueContainer.appendChild(queueItem);

            
            setTimeout(() => {
                const fill = queueItem.querySelector(".progress-bar-fill");
                if (fill) fill.style.width = `${density}%`;
            }, 100);
        });
    }

    
    function renderCCTVFeeds(feeds) {
        if (!cctvGridContainer) return;
        cctvGridContainer.innerHTML = "";

        feeds.forEach(feed => {
            const camCard = document.createElement("div");
            camCard.className = `camera-card ${feed.riskLevel}`;
            
            
            let boxesHTML = "";
            feed.boundingBoxes.forEach(box => {
                boxesHTML += `
                    <div class="cv-bounding-box" style="left: ${box.x}px; top: ${box.y}px; width: ${box.w}px; height: ${box.h}px;">
                        <span class="cv-box-label">${box.label}</span>
                    </div>
                `;
            });

            
            camCard.innerHTML = `
                <div class="camera-stream-wrapper">
                    <!-- Static Camera Grid Mesh Overlay -->
                    <div class="camera-mesh-overlay"></div>
                    <div class="camera-scanline"></div>
                    
                    <!-- Bounding boxes layer -->
                    <div class="cv-layer">${boxesHTML}</div>

                    <!-- CCTV Text HUD info -->
                    <div class="camera-hud-top">
                        <span class="hud-tag"><span class="recording-dot"></span> LIVE REC</span>
                        <span class="hud-resolution">${feed.resolution}</span>
                    </div>
                    
                    <div class="camera-hud-bottom">
                        <span class="hud-cam-id">${feed.id}</span>
                        <span class="hud-count"><i data-lucide="users" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> ${feed.peopleCount} DETECTED</span>
                    </div>
                </div>
                
                <div class="camera-info-row">
                    <div>
                        <h4 class="camera-loc-title">${feed.location}</h4>
                        <span class="camera-detection-summary">Anomaly Tags: ${feed.aiDetections.join(", ") || "None"}</span>
                    </div>
                    <span class="badge ${feed.riskLevel}">${feed.densityLabel}</span>
                </div>
            `;

            cctvGridContainer.appendChild(camCard);
        });

        
        if (window.lucide) {
            window.lucide.createIcons({
                attrs: {
                    "data-lucide": true
                },
                nodeList: cctvGridContainer.querySelectorAll("[data-lucide]")
            });
        }
    }

    function filterCCTVFeedsByGhat(ghat) {
        
        const cameraTitle = document.getElementById("video-analytics-header");
        if (cameraTitle) {
            cameraTitle.textContent = `Smart CCTV Feeds - ${ghat.name}`;
        }

        const localFeeds = [
            {
                id: `CAM-VNS-${ghat.name.substring(0, 4).toUpperCase()}-01`,
                location: `${ghat.name} - Entrance Gate Platform`,
                resolution: "4K UHD @ 30FPS",
                peopleCount: Math.floor(ghat.occupancy * 0.15),
                densityLabel: ghat.risk.toUpperCase(),
                aiDetections: ghat.anomaliesDetected > 0 ? ["High Density Node", "Entry Bottleneck"] : ["Standard Clearance Flow"],
                riskLevel: ghat.risk,
                boundingBoxes: ghat.risk === "critical" || ghat.risk === "busy" ? [
                    { x: 40, y: 50, w: 180, h: 140, label: "Congested Path 91%" },
                    { x: 260, y: 80, w: 100, h: 110, label: "Target Overload 87%" }
                ] : []
            },
            {
                id: `CAM-VNS-${ghat.name.substring(0, 4).toUpperCase()}-02`,
                location: `${ghat.name} - Sacred Stairs Bathing Basin`,
                resolution: "1080p HD @ 60FPS",
                peopleCount: Math.floor(ghat.occupancy * 0.25),
                densityLabel: ghat.risk === "critical" ? "HIGH" : "NORMAL",
                aiDetections: ["Bathing monitoring active"],
                riskLevel: ghat.risk === "critical" ? "busy" : "safe",
                boundingBoxes: []
            }
        ];

        renderCCTVFeeds(localFeeds);
    }

    
    function renderAIPredictions(recs) {
        if (!aiPredictionsContainer) return;
        aiPredictionsContainer.innerHTML = "";

        recs.forEach(rec => {
            let iconName = "cpu";
            if (rec.icon === "shield-alert") iconName = "shield-alert";
            else if (rec.icon === "git-branch") iconName = "git-branch";
            else if (rec.icon === "construction") iconName = "construction";

            const card = document.createElement("div");
            card.className = "ai-prediction-card";
            card.innerHTML = `
                <div class="ai-pred-icon">
                    <i data-lucide="${iconName}"></i>
                </div>
                <div class="ai-pred-details">
                    <div class="ai-pred-header-row">
                        <h4 class="ai-pred-title">${rec.title}</h4>
                        <span class="ai-pred-conf">${rec.confidence} Confidence</span>
                    </div>
                    <p class="ai-pred-desc">${rec.desc}</p>
                    <div class="ai-pred-actions">
                        <button class="ai-pred-btn-deploy"><i data-lucide="play" style="width: 10px; height: 10px; display: inline-block;"></i> Dispatch Commands</button>
                        <button class="ai-pred-btn-dismiss">Ignore</button>
                    </div>
                </div>
            `;

            aiPredictionsContainer.appendChild(card);
            
            
            card.querySelector(".ai-pred-btn-deploy").addEventListener("click", () => {
                if (window.showSystemBanner) {
                    window.showSystemBanner(`DISPATCHED: Preemptive order executed successfully!`);
                }
                card.style.opacity = "0.5";
                card.querySelector(".ai-pred-btn-deploy").disabled = true;
                card.querySelector(".ai-pred-btn-deploy").textContent = "Executed";
            });
            
            card.querySelector(".ai-pred-btn-dismiss").addEventListener("click", () => {
                card.remove();
            });
        });

        if (window.lucide) {
            window.lucide.createIcons({
                attrs: {
                    "data-lucide": true
                },
                nodeList: aiPredictionsContainer.querySelectorAll("[data-lucide]")
            });
        }
    }



    
    
    if (window.dashboardIntervalId) {
        clearInterval(window.dashboardIntervalId);
    }
    window.dashboardIntervalId = setInterval(() => {
        
        const randomIndex = Math.floor(Math.random() * db.MONITORED_GHATS.length);
        const targetGhat = db.MONITORED_GHATS[randomIndex];

        
        const fluctuationPercent = (Math.random() * 6 - 3) / 100; 
        const delta = Math.floor(targetGhat.occupancy * fluctuationPercent);
        targetGhat.occupancy = Math.max(200, Math.min(targetGhat.capacity, targetGhat.occupancy + delta));
        targetGhat.crowdDensity = (targetGhat.occupancy / targetGhat.capacity) * 100;

        
        if (targetGhat.crowdDensity >= 88.0) {
            targetGhat.risk = "critical";
            targetGhat.safetyStatus = "CRITICAL LIMIT EXCEEDED. Dispatch SWAT!";
        } else if (targetGhat.crowdDensity >= 75.0) {
            targetGhat.risk = "busy";
            targetGhat.safetyStatus = "Heavy density. Diverting pathway streams.";
        } else if (targetGhat.crowdDensity >= 50.0) {
            targetGhat.risk = "moderate";
            targetGhat.safetyStatus = "Steady volume. Continuous scan active.";
        } else {
            targetGhat.risk = "safe";
            targetGhat.safetyStatus = "Nominal clearing bounds.";
        }

        
        renderKPIs(db.SYSTEM_STATUS, db.MONITORED_GHATS);
        renderMapHotspots(db.MONITORED_GHATS);
        renderAlertQueue(db.MONITORED_GHATS);
        updateOverviewDashboard();
        
        
        if (targetGhat.id === selectedGhatId) {
            filterCCTVFeedsByGhat(targetGhat);
        }

        
        if (Math.random() > 0.7) {
            const badge = document.querySelector(".nav-notification-indicator");
            if (badge) {
                badge.style.display = "block";
                badge.style.transform = "scale(1.4)";
                setTimeout(() => badge.style.transform = "scale(1)", 300);
            }
        }

        
        const timestamp = new Date().toTimeString().split(" ")[0].substring(0, 5);
        const totalLiveCount = db.MONITORED_GHATS.reduce((acc, curr) => acc + curr.occupancy, 0);
        if (window.pushChartDataValue) {
            window.pushChartDataValue(timestamp, totalLiveCount, totalLiveCount + Math.floor(Math.random() * 1000 - 500));
        }

        
        const syncLight = document.getElementById("sync-dot");
        const syncText = document.getElementById("sync-text");
        if (syncLight && syncText) {
            syncLight.style.backgroundColor = "var(--color-safe)";
            syncText.textContent = "SYNCHRONIZED";
            setTimeout(() => {
                syncLight.style.backgroundColor = "var(--color-safe)";
                syncText.textContent = "SYNCED";
            }, 1000);
        }

        // Save fluctuations to localStorage to persist state
        localStorage.setItem("pushkara_nigha_telemetry", JSON.stringify(db));

    }, 6000);

    // --------------------------------------------------------------------------
    // NEW FUTURISTIC OVERVIEW DASHBOARD CORE: PROFESSIONAL LIST VIEW
    // --------------------------------------------------------------------------

    function initOverviewDashboard() {
        renderOverviewStats(db.MONITORED_GHATS);
        renderSurveillanceTable(db.MONITORED_GHATS);
        updateSurveillanceHeader(db.MONITORED_GHATS);
        renderLiveCrowdHeatmap(db.MONITORED_GHATS);
    }

    function updateOverviewDashboard() {
        renderOverviewStats(db.MONITORED_GHATS);
        updateSurveillanceTable(db.MONITORED_GHATS);
        updateSurveillanceHeader(db.MONITORED_GHATS);
        renderLiveCrowdHeatmap(db.MONITORED_GHATS);
    }

    function renderOverviewStats(ghats) {
        const totalActiveGhats = ghats.length;
        const totalLiveCrowd = ghats.reduce((acc, g) => acc + g.occupancy, 0);
        const totalActiveCameras = ghats.reduce((acc, g) => acc + g.camerasCount, 0);
        const highRiskGhats = ghats.filter(g => g.crowdDensity > 65).length;
        const safeZones = ghats.filter(g => g.crowdDensity < 30).length;
        const aiAlertCount = ghats.reduce((acc, g) => acc + g.anomaliesDetected, 0);

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) {
                const currentVal = parseInt(el.textContent.replace(/,/g, "")) || 0;
                if (currentVal !== val) {
                    animateCounter(id, val, 1000);
                }
            }
        };

        setVal("overview-kpi-active-ghats", totalActiveGhats);
        setVal("overview-kpi-live-crowd", totalLiveCrowd);
        setVal("overview-kpi-active-cameras", totalActiveCameras);
        setVal("overview-kpi-high-risk", highRiskGhats);
        setVal("overview-kpi-safe-zones", safeZones);
        setVal("overview-kpi-ai-alerts", aiAlertCount);
    }

    function renderSurveillanceTable(ghats) {
        const tbody = document.getElementById("overview-table-body");
        if (!tbody) return;

        let html = "";
        ghats.forEach((g, index) => {
            const density = g.crowdDensity;
            const pct = density.toFixed(1);
            let status = "open";
            let statusLabel = "OPEN ZONE";
            if (density > 65) {
                status = "highly-crowded";
                statusLabel = "HIGHLY CROWDED";
            } else if (density >= 30) {
                status = "crowded";
                statusLabel = "CROWDED";
            }

            let progressClass = "safe";
            if (g.risk === "critical") progressClass = "critical";
            else if (g.risk === "busy") progressClass = "busy";
            else if (g.risk === "moderate") progressClass = "moderate";

            const inflow = g.inMen + g.inWomen + g.inOthers;
            const outflow = g.outMen + g.outWomen + g.outOthers;

            html += `
                <tr id="table-row-${g.id}" onclick="scrollToMapMarker('${g.id}')">
                    <td class="table-serial-col">${index + 1}</td>
                    <td class="table-name-col">${g.name}</td>
                    <td>${g.district}</td>
                    <td><span class="table-zone-badge ${status}">${statusLabel}</span></td>
                    <td id="table-cell-cap-${g.id}">${g.capacity.toLocaleString()}</td>
                    <td id="table-cell-occ-${g.id}">${g.occupancy.toLocaleString()}</td>
                    <td>
                        <div class="table-progress-wrapper">
                            <div class="table-progress-bar-track">
                                <div class="table-progress-bar-fill ${progressClass}" id="table-fill-${g.id}" style="width: ${pct}%"></div>
                            </div>
                            <span class="table-progress-pct" id="table-pct-${g.id}">${pct}%</span>
                        </div>
                    </td>
                    <td id="table-cell-in-${g.id}">${inflow.toLocaleString()}</td>
                    <td id="table-cell-out-${g.id}">${outflow.toLocaleString()}</td>
                    <td>${g.camerasCount}</td>
                    <td><span class="table-risk-badge ${g.risk}" id="table-badge-${g.id}">${g.risk.toUpperCase()}</span></td>
                    <td>${g.lastUpdated}</td>
                    <td>
                        <span class="table-live-status ${g.risk === 'critical' ? 'critical' : ''}" id="table-live-${g.id}">
                            <span class="table-live-status-dot"></span> ACTIVE
                        </span>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    function updateSurveillanceTable(ghats) {
        ghats.forEach(g => {
            const capCell = document.getElementById(`table-cell-cap-${g.id}`);
            const occCell = document.getElementById(`table-cell-occ-${g.id}`);
            const inCell = document.getElementById(`table-cell-in-${g.id}`);
            const outCell = document.getElementById(`table-cell-out-${g.id}`);
            const fill = document.getElementById(`table-fill-${g.id}`);
            const pctText = document.getElementById(`table-pct-${g.id}`);
            const badge = document.getElementById(`table-badge-${g.id}`);
            const liveStatus = document.getElementById(`table-live-${g.id}`);

            const density = g.crowdDensity;
            const pct = density.toFixed(1);
            const inflow = g.inMen + g.inWomen + g.inOthers;
            const outflow = g.outMen + g.outWomen + g.outOthers;

            let progressClass = "safe";
            if (g.risk === "critical") progressClass = "critical";
            else if (g.risk === "busy") progressClass = "busy";
            else if (g.risk === "moderate") progressClass = "moderate";

            if (capCell) capCell.textContent = g.capacity.toLocaleString();
            if (occCell) occCell.textContent = g.occupancy.toLocaleString();
            if (inCell) inCell.textContent = inflow.toLocaleString();
            if (outCell) outCell.textContent = outflow.toLocaleString();
            if (pctText) pctText.textContent = `${pct}%`;
            if (fill) {
                fill.style.width = `${pct}%`;
                fill.className = `table-progress-bar-fill ${progressClass}`;
            }
            if (badge) {
                badge.className = `table-risk-badge ${g.risk}`;
                badge.textContent = g.risk.toUpperCase();
            }
            if (liveStatus) {
                liveStatus.className = `table-live-status ${g.risk === 'critical' ? 'critical' : ''}`;
            }

            const row = document.getElementById(`table-row-${g.id}`);
            if (row) {
                const zoneBadge = row.querySelector(".table-zone-badge");
                if (zoneBadge) {
                    let status = "open";
                    let statusLabel = "OPEN ZONE";
                    if (density > 65) {
                        status = "highly-crowded";
                        statusLabel = "HIGHLY CROWDED";
                    } else if (density >= 30) {
                        status = "crowded";
                        statusLabel = "CROWDED";
                    }
                    zoneBadge.className = `table-zone-badge ${status}`;
                    zoneBadge.textContent = statusLabel;
                }
            }
        });
    }

    function updateSurveillanceHeader(ghats) {
        const countEl = document.getElementById("hud-stats-monitored");
        const camsEl = document.getElementById("hud-stats-cameras");
        const crowdEl = document.getElementById("hud-stats-crowd");
        const syncedEl = document.getElementById("hud-stats-synced");

        const totalCams = ghats.reduce((sum, g) => sum + g.camerasCount, 0);
        const totalCrowd = ghats.reduce((sum, g) => sum + g.occupancy, 0);

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const hoursStr = hours < 10 ? '0' + hours : hours;
        const syncTime = `${hoursStr}:${minutesStr} ${ampm}`;

        if (countEl) countEl.textContent = ghats.length;
        if (camsEl) camsEl.textContent = totalCams.toLocaleString();
        if (crowdEl) crowdEl.textContent = totalCrowd.toLocaleString();
        if (syncedEl) syncedEl.textContent = syncTime;
    }

    function renderLiveCrowdHeatmap(ghats) {
        const container = document.getElementById("overview-heatmap-grid");
        if (!container) return;

        let html = "";
        ghats.forEach(g => {
            const pct = ((g.occupancy / g.capacity) * 100).toFixed(1);
            let statusClass = "safe";
            if (g.risk === "critical") statusClass = "critical";
            else if (g.risk === "busy") statusClass = "busy";
            else if (g.risk === "moderate") statusClass = "moderate";

            html += `
                <div class="heatmap-block ${statusClass}" onclick="scrollToGhatCard('${g.id}')">
                    <span class="heatmap-block-name">${g.name}</span>
                    <strong class="heatmap-block-pct">${Math.round(pct)}%</strong>
                    <div class="heatmap-pulse-dot"></div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    window.scrollToMapMarker = function(ghatId) {
        const marker = document.getElementById(`marker-${ghatId}`);
        if (marker) {
            marker.click();
            document.querySelector(".map-visualization-wrapper").scrollIntoView({ behavior: "smooth" });
        }
    };

    window.scrollToGhatCard = function(ghatId) {
        const row = document.getElementById(`table-row-${ghatId}`);
        if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
            row.style.background = "rgba(45, 212, 191, 0.15)";
            setTimeout(() => {
                row.style.background = "";
            }, 1500);
        }
    };


    window.updateOverviewDashboard = updateOverviewDashboard;
    window.initOverviewDashboard = initOverviewDashboard;

    // Initialize New Overview List View
    initOverviewDashboard();
}

window.initDashboardModule = initDashboardModule;

if (document.readyState === "complete" || document.readyState === "interactive") {
    initDashboardModule();
} else {
    document.addEventListener("DOMContentLoaded", initDashboardModule);
}
