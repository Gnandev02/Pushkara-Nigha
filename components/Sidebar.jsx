"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Camera, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Monitoring", href: "/cameras", icon: Camera },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("pushkara_is_auth");
    localStorage.removeItem("pushkara_nigha_session");
    window.location.reload();
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar Collapse Toggle Button */}
      <button 
        className="sidebar-toggle-btn" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Brand Header */}
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
      
      {/* Nav List */}
      <ul className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.name}>
              <Link 
                href={item.href} 
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                <span className="sidebar-collapsed-hide">{item.name}</span>
              </Link>
            </li>
          );
        })}

        {/* Sign Out Button Spacer */}
        <li className="sidebar-signout-spacer">
          <button 
            onClick={handleLogout} 
            className="sidebar-nav-item sidebar-signout-btn w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span className="sidebar-collapsed-hide">Sign Out</span>
          </button>
        </li>
      </ul>
      
      {/* Sidebar Bottom Actions */}
      <div className="sidebar-bottom-actions sidebar-collapsed-hide">
        <button 
          onClick={() => alert("Video analytics demo initialized.")}
          className="sidebar-action-btn"
        >
          Video analytics demo
        </button>
        <button 
          onClick={() => alert("Redirecting to Citizen App portal...")}
          className="sidebar-action-btn"
        >
          Citizen app
        </button>
        <button 
          onClick={() => alert("Connecting to District Control Center...")}
          className="sidebar-action-btn"
        >
          Control center
        </button>
        <button 
          onClick={() => alert("Opening Incident Response Desk...")}
          className="sidebar-action-btn"
        >
          Response desk
        </button>
      </div>
    </aside>
  );
}
