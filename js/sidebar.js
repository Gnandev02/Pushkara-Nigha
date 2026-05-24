

function initSidebar() {
    const sidebar = document.querySelector(".app-sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle-btn");
    const mobileMenuTrigger = document.querySelector(".mobile-menu-trigger");
    const navItems = document.querySelectorAll(".sidebar-nav-item");
    
    // Ensure mobile sidebar overlay is created once
    let mobileOverlay = document.querySelector(".mobile-sidebar-overlay");
    if (!mobileOverlay) {
        mobileOverlay = document.createElement("div");
        mobileOverlay.className = "mobile-sidebar-overlay";
        document.body.appendChild(mobileOverlay);

        Object.assign(mobileOverlay.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            webkitBackdropFilter: "blur(4px)",
            zIndex: "95",
            opacity: "0",
            pointerEvents: "none",
            transition: "opacity 0.3s ease"
        });
    }

    
    if (sidebarToggle && sidebar && !sidebarToggle.dataset.wired) {
        sidebarToggle.dataset.wired = 'true';
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            
            const toggleIcon = sidebarToggle.querySelector("i");
            if (toggleIcon) {
                if (sidebar.classList.contains("collapsed")) {
                    toggleIcon.setAttribute("data-lucide", "chevron-right");
                } else {
                    toggleIcon.setAttribute("data-lucide", "chevron-left");
                }
                
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        });
    }

    
    if (mobileMenuTrigger && sidebar && !mobileMenuTrigger.dataset.wired) {
        mobileMenuTrigger.dataset.wired = 'true';
        mobileMenuTrigger.addEventListener("click", () => {
            sidebar.classList.add("mobile-open");
            mobileOverlay.style.opacity = "1";
            mobileOverlay.style.pointerEvents = "all";
        });
    }

    
    if (mobileOverlay && !mobileOverlay.dataset.wired) {
        mobileOverlay.dataset.wired = 'true';
        mobileOverlay.addEventListener("click", () => {
            dismissMobileSidebar();
        });
    }

    function dismissMobileSidebar() {
        if (sidebar) {
            sidebar.classList.remove("mobile-open");
        }
        mobileOverlay.style.opacity = "0";
        mobileOverlay.style.pointerEvents = "none";
    }

    
    navItems.forEach(item => {
        if (!item.dataset.wired) {
            item.dataset.wired = 'true';
            item.addEventListener("click", (e) => {
                e.preventDefault();
                
                navItems.forEach(nav => nav.classList.remove("active"));
                item.classList.add("active");
                
                if (window.innerWidth <= 1024) {
                    dismissMobileSidebar();
                }

                const targetSection = item.getAttribute("href").substring(1);
                triggerSectionTransition(targetSection);
            });
        }
    });

    function triggerSectionTransition(sectionName) {
        console.log(`Command Center navigating to sector view: ${sectionName}`);
        
        document.querySelectorAll(".dashboard-section").forEach(sec => {
            sec.classList.remove("active");
        });
        
        const targetSec = document.getElementById(`section-${sectionName}`);
        if (targetSec) {
            targetSec.classList.add("active");
        } else {
            const overviewSec = document.getElementById("section-overview");
            if (overviewSec) {
                overviewSec.classList.add("active");
            }
        }
        
        if (sectionName !== "overview") {
            const pageTitle = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
            showSystemBanner(`Loading ${pageTitle} Real-time feeds... [Telemetry Sim Active]`);
        }
    }

    function showSystemBanner(message) {
        let banner = document.querySelector(".system-toast-banner");
        if (!banner) {
            banner = document.createElement("div");
            banner.className = "system-toast-banner";
            Object.assign(banner.style, {
                position: "fixed",
                bottom: "30px",
                right: "30px",
                background: "linear-gradient(135deg, #0B6B53, #0D9488)",
                color: "#FFFFFF",
                padding: "14px 24px",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(11, 107, 83, 0.3)",
                zIndex: "200",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: "500",
                transform: "translateY(150%)",
                transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            });
            document.body.appendChild(banner);
        }
        
        banner.innerHTML = `<i data-lucide="info" style="width: 18px; height: 18px"></i> <span>${message}</span>`;
        if (window.lucide) {
            window.lucide.createIcons({
                attrs: {
                    "data-lucide": true
                },
                nodeList: [banner]
            });
        }
        
        setTimeout(() => {
            banner.style.transform = "translateY(0)";
        }, 100);

        setTimeout(() => {
            banner.style.transform = "translateY(150%)";
        }, 3500);
    }
    
    window.showSystemBanner = showSystemBanner;
}

window.initSidebar = initSidebar;

if (document.readyState === "complete" || document.readyState === "interactive") {
    initSidebar();
} else {
    document.addEventListener("DOMContentLoaded", initSidebar);
}

