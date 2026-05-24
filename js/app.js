

document.addEventListener("DOMContentLoaded", () => {
    
    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    
    
    const savedTheme = localStorage.getItem("command-center-theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    updateThemeToggleIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("command-center-theme", newTheme);
            
            updateThemeToggleIcon(newTheme);
            
            if (window.showSystemBanner) {
                window.showSystemBanner(`Interface theme switched to: ${newTheme.toUpperCase()} MODE`);
            }
        });
    }

    function updateThemeToggleIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector("i");
        if (icon) {
            if (theme === "dark") {
                icon.setAttribute("data-lucide", "sun");
                themeToggleBtn.setAttribute("title", "Switch to Light Theme");
            } else {
                icon.setAttribute("data-lucide", "moon");
                themeToggleBtn.setAttribute("title", "Switch to Dark Theme");
            }
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    
    function updateSyncTime() {
        const syncTimeValue = document.getElementById("sync-time-value");
        if (!syncTimeValue) return;

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const hoursStr = hours < 10 ? '0' + hours : hours;
        
        syncTimeValue.textContent = `${hoursStr}:${minutesStr} ${ampm}`;
    }

    
    updateSyncTime();

    
    const refreshBtn = document.querySelector(".refresh-btn");
    const syncDot = document.getElementById("sync-dot");
    const syncText = document.getElementById("sync-text");

    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            
            const icon = refreshBtn.querySelector("i");
            if (icon) {
                icon.style.transition = "transform 0.8s ease";
                icon.style.transform = "rotate(360deg)";
                setTimeout(() => {
                    icon.style.transform = "rotate(0deg)";
                    icon.style.transition = "none";
                }, 800);
            }

            
            updateSyncTime();

            
            if (syncDot && syncText) {
                syncDot.style.backgroundColor = "var(--color-moderate)";
                syncText.textContent = "INDEXING FEEDS...";
            }

            
            if (window.showSystemBanner) {
                window.showSystemBanner("Neural-grid re-scan initiated. Calibrating live telemetry...");
            }

            
            setTimeout(() => {
                const db = window.SmartCityTelemetry;
                if (db) {
                    db.MONITORED_GHATS.forEach(ghat => {
                        
                        const noise = Math.floor(Math.random() * 200 - 100);
                        ghat.occupancy = Math.max(100, ghat.occupancy + noise);
                        ghat.crowdDensity = (ghat.occupancy / ghat.capacity) * 100;
                    });
                    
                    
                    const event = new Event("DOMContentLoaded");
                    document.dispatchEvent(event);
                }

                
                updateSyncTime();

                
                if (syncDot && syncText) {
                    syncDot.style.backgroundColor = "var(--color-safe)";
                    syncText.textContent = "SYNCHRONIZED";
                }
            }, 1000);
        });
    }

    
    const notificationBtn = document.querySelector(".notification-btn");
    let notificationDropdown = null;

    if (notificationBtn) {
        
        notificationBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            
            const badge = notificationBtn.querySelector(".nav-notification-indicator");
            if (badge) badge.style.display = "none";

            toggleNotificationDropdown();
        });
    }

    function toggleNotificationDropdown() {
        if (notificationDropdown) {
            notificationDropdown.remove();
            notificationDropdown = null;
            return;
        }

        notificationDropdown = document.createElement("div");
        notificationDropdown.className = "notification-popover-dropdown";
        
        
        const db = window.SmartCityTelemetry;
        const currentAlerts = db ? db.INCIDENT_LOGS.slice(0, 4) : [];
        
        let alertsHTML = "";
        if (currentAlerts.length === 0) {
            alertsHTML = `<div class="empty-notif-msg">No critical system alerts active.</div>`;
        } else {
            currentAlerts.forEach(alert => {
                alertsHTML += `
                    <div class="notif-dropdown-item ${alert.severity}">
                        <div class="notif-item-marker"></div>
                        <div class="notif-item-body">
                            <span class="notif-item-time">${alert.time} - ${alert.location}</span>
                            <p class="notif-item-text"><strong>${alert.category}</strong>: ${alert.description}</p>
                        </div>
                    </div>
                `;
            });
        }

        notificationDropdown.innerHTML = `
            <div class="notif-dropdown-header">
                <strong>Active System Incidents</strong>
                <button class="clear-all-notif-btn">Acknowledge All</button>
            </div>
            <div class="notif-dropdown-scroller">
                ${alertsHTML}
            </div>
            <div class="notif-dropdown-footer">
                AI Command Center Telemetry
            </div>
        `;

        
        Object.assign(notificationDropdown.style, {
            position: "absolute",
            top: "65px",
            right: "0px",
            width: "360px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-premium), 0 20px 40px rgba(0,0,0,0.15)",
            zIndex: "150",
            overflow: "hidden",
            fontFamily: "'Inter', sans-serif"
        });

        notificationBtn.appendChild(notificationDropdown);

        
        const clearBtn = notificationDropdown.querySelector(".clear-all-notif-btn");
        if (clearBtn) {
            clearBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (db) db.INCIDENT_LOGS.forEach(log => log.status = "resolved");
                
                if (window.showSystemBanner) {
                    window.showSystemBanner("System events acknowledged by operator");
                }
                
                notificationDropdown.remove();
                notificationDropdown = null;
                
                
                const event = new Event("DOMContentLoaded");
                document.dispatchEvent(event);
            });
        }
    }

    
    document.addEventListener("click", () => {
        if (notificationDropdown) {
            notificationDropdown.remove();
            notificationDropdown = null;
        }
    });

    
    const searchInput = document.querySelector(".header-search-bar input");
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const query = searchInput.value.trim().toLowerCase();
                if (!query) return;

                const db = window.SmartCityTelemetry;
                if (db) {
                    const matchedGhat = db.MONITORED_GHATS.find(g => g.name.toLowerCase().includes(query));
                    if (matchedGhat) {
                        
                        const marker = document.getElementById(`marker-${matchedGhat.id}`);
                        if (marker) {
                            marker.click();
                            
                            document.querySelector(".map-visualization-wrapper").scrollIntoView({ behavior: "smooth" });
                        }
                    } else {
                        if (window.showSystemBanner) {
                            window.showSystemBanner(`No sectors found matching search: "${searchInput.value}"`);
                        }
                    }
                }
                searchInput.value = "";
            }
        });
    }

    
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
