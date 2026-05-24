import React from 'react';

const Sidebar = ({ activeRole, currentSection, onNavigate, onLogout }) => {
    const isSupervisor = activeRole === 'command-supervisor';

    return (
        <aside className="app-sidebar select-none">
            {/* Sidebar Collapse Toggle Button */}
            <button className="sidebar-toggle-btn" title="Toggle Sidebar">
                <i data-lucide="chevron-left" style={{ width: '14px', height: '14px' }}></i>
            </button>
            
            {/* Logo Brand Brand Seal */}
            <div className="sidebar-brand-wrapper">
                <div className="sidebar-logo-group">
                    <div className="sidebar-logo-graphic">
                        <span>PN</span>
                    </div>
                    <div className="sidebar-brand-text-group sidebar-collapsed-hide">
                        <span className="sidebar-brand-name">Pushkara Nigha</span>
                        <span className="sidebar-brand-subtitle">AI Crowd Command</span>
                    </div>
                </div>
            </div>
            
            {/* Filtered Navigation Links */}
            <ul className="sidebar-nav">
                {/* 1. Overview (Admin Only) */}
                {!isSupervisor && (
                    <li>
                        <a 
                            href="#overview" 
                            onClick={(e) => { e.preventDefault(); onNavigate('overview'); }}
                            className={`sidebar-nav-item ${currentSection === 'overview' ? 'active' : ''}`}
                        >
                            <i data-lucide="layout-dashboard"></i>
                            <span className="sidebar-collapsed-hide">Overview</span>
                        </a>
                    </li>
                )}
                
                {/* 2. Monitoring (All Roles) */}
                <li>
                    <a 
                        href="#monitoring" 
                        onClick={(e) => { e.preventDefault(); onNavigate('monitoring'); }}
                        className={`sidebar-nav-item ${currentSection === 'monitoring' ? 'active' : ''}`}
                    >
                        <i data-lucide="activity"></i>
                        <span className="sidebar-collapsed-hide">Monitoring</span>
                    </a>
                </li>
                
                {/* 3. Reporting (All Roles) */}
                <li>
                    <a 
                        href="#reporting" 
                        onClick={(e) => { e.preventDefault(); onNavigate('reporting'); }}
                        className={`sidebar-nav-item ${currentSection === 'reporting' ? 'active' : ''}`}
                    >
                        <i data-lucide="file-text"></i>
                        <span className="sidebar-collapsed-hide">Reporting</span>
                    </a>
                </li>
                
                {/* 4. User Management (Admin Only) */}
                {!isSupervisor && (
                    <li>
                        <a 
                            href="#usermanagement" 
                            onClick={(e) => { e.preventDefault(); onNavigate('usermanagement'); }}
                            className={`sidebar-nav-item ${currentSection === 'usermanagement' ? 'active' : ''}`}
                        >
                            <i data-lucide="users"></i>
                            <span className="sidebar-collapsed-hide">User Management</span>
                        </a>
                    </li>
                )}
                
                {/* 5. AI Alerts (Admin Only) */}
                {!isSupervisor && (
                    <li>
                        <a 
                            href="#aialerts" 
                            onClick={(e) => { e.preventDefault(); onNavigate('aialerts'); }}
                            className={`sidebar-nav-item ${currentSection === 'aialerts' ? 'active' : ''}`}
                        >
                            <i data-lucide="cpu"></i>
                            <span className="sidebar-collapsed-hide">AI Alerts</span>
                        </a>
                    </li>
                )}
                
                {/* 6. Settings (Admin Only) */}
                {!isSupervisor && (
                    <li>
                        <a 
                            href="#settings" 
                            onClick={(e) => { e.preventDefault(); onNavigate('settings'); }}
                            className={`sidebar-nav-item ${currentSection === 'settings' ? 'active' : ''}`}
                        >
                            <i data-lucide="settings"></i>
                            <span className="sidebar-collapsed-hide">Settings</span>
                        </a>
                    </li>
                )}
                
                {/* 7. Bottom Terminate Logout trigger */}
                <li style={{ marginTop: 'auto', borderTop: '1px solid var(--sidebar-border)', paddingTop: '8px' }}>
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onLogout(); }}
                        className="sidebar-nav-item text-red-500 hover:text-red-400"
                        style={{ color: '#EF4444' }}
                    >
                        <i data-lucide="log-out"></i>
                        <span className="sidebar-collapsed-hide">Logout Session</span>
                    </a>
                </li>
            </ul>
            
            {/* Sidebar Bottom Demos (Admin Only) */}
            {!isSupervisor && (
                <div className="sidebar-bottom-actions sidebar-collapsed-hide">
                    <button className="sidebar-action-btn" id="btn-analytics-demo">Video analytics demo</button>
                    <button className="sidebar-action-btn" id="btn-citizen-app">Citizen app</button>
                    <button className="sidebar-action-btn" id="btn-control-center">Control center</button>
                    <button className="sidebar-action-btn" id="btn-response-desk">Response desk</button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
