"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Monitoring", href: "/monitoring", icon: Activity },
  { name: "Reporting", href: "/reporting", icon: FileText },
  { name: "User Management", href: "/users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true); // default to true to prevent hydration mismatch on mobile
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("pushkara_user_role"));
    
    // Auto-collapse on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // trigger on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    // During hydration/SSR, default to showing everything to prevent layout shift,
    // or you can default to safe items.
    if (!userRole || userRole === "admin") return true;
    
    // Command Supervisor can only see Monitoring and Reporting
    return item.name === "Monitoring" || item.name === "Reporting";
  });

  const handleSignOut = () => {
    localStorage.removeItem("pushkara_is_auth");
    localStorage.removeItem("pushkara_user_role");
    router.push("/login");
  };

  return (
    <aside
      className={`sticky top-0 h-screen z-50 flex-shrink-0 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
      style={{ background: "#071827", borderRight: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-200 hover:scale-110"
        style={{ background: "#0D9488", border: "2px solid #071827", color: "#fff" }}
      >
        <ChevronLeft
          className="w-3 h-3 transition-transform duration-300"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Brand */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #0B6B53, #0D9488)" }}
        >
          PN
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-extrabold text-sm tracking-wide leading-tight truncate">
              Pushkara Nigha
            </p>
            <p className="text-[10px] font-semibold tracking-widest uppercase leading-tight truncate" style={{ color: "#2DD4BF" }}>
              AI Crowd Command
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "sidebar-nav-active text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <Icon
                className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-[#2DD4BF]" : ""
                }`}
                style={{ width: 18, height: 18 }}
              />
              {!collapsed && (
                <span className="text-sm tracking-wide truncate">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}

      </nav>

      {/* Sign Out */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-slate-400 hover:text-red-400 hover:bg-red-500/5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          {!collapsed && (
            <span className="text-sm font-semibold tracking-wide">Sign Out</span>
          )}
        </button>
      </div>

      {/* AI Pipeline status */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" style={{ color: "#0D9488" }} />
              <span className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider">AI PIPELINE</span>
            </div>
            <span
              className="px-2 py-0.5 text-[9px] font-extrabold font-mono rounded"
              style={{
                background: "rgba(16,185,129,0.15)",
                color: "#10B981",
                border: "1px solid rgba(16,185,129,0.25)",
              }}
            >
              LIVE
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
