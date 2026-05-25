"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
  Cpu,
  Video,
  Settings,
  Bell,
  UploadCloud,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Monitoring", href: "/monitoring", icon: Activity },
  { name: "Reporting", href: "/reporting", icon: FileText },
  { name: "User Management", href: "/users", icon: Users },
];

const BOTTOM_ACTIONS = [
  { label: "Video analytics demo", href: "/upload" },
  { label: "Citizen app", href: "#" },
  { label: "Control center", href: "#" },
  { label: "Response desk", href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("pushkara_is_auth");
    localStorage.removeItem("pushkara_user_role");
    router.push("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ${
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
            <p className="text-[10px] font-bold tracking-widest uppercase leading-tight truncate" style={{ color: "#2DD4BF" }}>
              AI Crowd Command
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
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
                  ? "text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              style={
                isActive
                  ? {
                      background: "rgba(13,148,136,0.15)",
                      borderLeft: "3px solid #0D9488",
                    }
                  : {}
              }
            >
              <Icon
                className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-[#2DD4BF]" : ""
                }`}
                style={{ width: 18, height: 18 }}
              />
              {!collapsed && (
                <span className="text-sm font-semibold tracking-wide truncate">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-white/5" />

        {/* Extra pages */}
        {[
          { name: "AI Alerts", href: "/alerts", icon: Bell },
          { name: "Upload Video", href: "/upload", icon: UploadCloud },
          { name: "Settings", href: "/settings", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <Icon style={{ width: 16, height: 16 }} />
              {!collapsed && (
                <span className="text-xs font-semibold tracking-wide truncate text-slate-500">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom action buttons */}
      {!collapsed && (
        <div className="p-3 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {BOTTOM_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="block w-full text-left px-3 py-2 text-[11px] font-semibold rounded-lg transition-all duration-150 hover:bg-white/8"
              style={{ color: "#64748B" }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}

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
              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">AI PIPELINE</span>
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
