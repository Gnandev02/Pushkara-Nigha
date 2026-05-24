import React from 'react';

const Navbar = ({ user, onLogout }) => {
    const activeUser = user || { fullName: 'Operator Node', role: 'command-supervisor', district: 'Godavari Corridor' };

    // Parse active operator initials
    const names = activeUser.fullName.split(" ");
    const initials = names.map(n => n[0]).join("").substring(0, 2).toUpperCase();

    return (
        <div className="gov-header-card select-none">
            {/* Left Column: Official government labels */}
            <div className="gov-header-left">
                <button className="mobile-menu-trigger gov-mobile-menu-trigger" title="Open Menu" style={{ display: 'none' }}>
                    <i data-lucide="menu" style={{ width: '18px', height: '18px' }}></i>
                </button>
                <div className="gov-header-title-container">
                    <span className="gov-header-subtitle font-semibold">
                        GOVERNMENT OF ANDHRA PRADESH &nbsp;|&nbsp; 
                        <span style={{ color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                            [{activeUser.role.replace("-", " ")}]
                        </span>
                    </span>
                    <h1 className="gov-header-title text-base font-extrabold tracking-tight">AI Crowd Management and Reporting Platform</h1>
                </div>
            </div>
            
            {/* Right Column: Sync Badge, Refresh controls, and Profile Pill */}
            <div className="gov-header-right flex items-center gap-3">
                <div className="gov-sync-badge">
                    <span className="gov-sync-dot">●</span> Synced <span id="sync-time-value">03:30 PM</span>
                </div>
                
                <button className="gov-refresh-btn refresh-btn" title="Force Refresh Telemetry" style={{ marginRight: '8px' }}>
                    <i data-lucide="refresh-cw" style={{ width: '14px', height: '14px' }}></i>
                </button>
                
                {/* Active Operator profile pill clickable for logout */}
                <div 
                    className="profile-pill flex items-center gap-2 cursor-pointer"
                    id="header-profile-pill"
                    onClick={onLogout}
                    title="Terminate secures session"
                >
                    <div 
                        className="profile-avatar-circle"
                        style={{
                            backgroundColor: activeUser.role === 'admin' ? 'var(--primary)' : 'var(--secondary-teal)'
                        }}
                    >
                        {initials}
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{activeUser.fullName}</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
