"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Camera, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  Cpu, 
  Activity,
  UploadCloud
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Cameras", href: "/cameras", icon: Camera },
    { name: "Upload Video", href: "/upload", icon: UploadCloud },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 fixed h-screen glassmorphism border-r border-glassBorder flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-6 border-b border-glassBorder flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-neonPurple to-neonBlue shadow-neonGlow">
          <Cpu className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-darkBg animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg bg-gradient-to-r from-neonPurple to-neonBlue bg-clip-text text-transparent tracking-wider">
            NEURALCROWD
          </h1>
          <p className="text-[10px] text-gray-400 tracking-widest font-mono">
            AI COMMAND CENTER
          </p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-2 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} className="relative block">
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 hover:text-white ${
                  isActive 
                    ? "text-white" 
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-neonPurple/25 to-neonBlue/10 border border-neonPurple/40 rounded-xl -z-10 shadow-neonGlow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-neonPurple" : "group-hover:scale-110"}`} />
                <span className="tracking-wide text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-4 border-t border-glassBorder bg-darkBg/30">
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-neonBlue animate-pulse" />
            <span className="text-[11px] text-gray-400 font-mono">AI PIPELINE</span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-extrabold font-mono bg-green-500/20 text-green-400 border border-green-500/30 rounded">
            CONNECTED
          </span>
        </div>
      </div>
    </aside>
  );
}
