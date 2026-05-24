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
                
                {/* 5. Bottom Terminate Logout trigger */}
                <li className="sidebar-signout-spacer">
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); onLogout(); }}
                        className="sidebar-nav-item sidebar-signout-btn"
                        id="sidebar-logout-btn"
                    >
                        <i data-lucide="log-out"></i>
                        <span className="sidebar-collapsed-hide">Sign Out</span>
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
