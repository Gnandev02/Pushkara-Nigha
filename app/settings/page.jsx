"use client";

import { Settings, Cpu, Shield, Database, Activity } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">ICCC NODE CONFIGURATION</span>
          <h1 className="gov-header-title">System Settings & Calibration</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Core AI Pipelines */}
        <div className="xl:col-span-2 space-y-4">
          <div className="dashboard-card">
            <h3 className="card-heading mb-4 pb-3 border-b border-slate-100">Core AI Model Pipelines</h3>
            <div className="space-y-3">
              {[
                { label: "Occupancy Vectors Tracking", desc: "Calibrates entry/exit gating limits automatically", enabled: true },
                { label: "Devotee Pacing & Velocity Engine", desc: "Alerts if speed falls below 0.3m/s (potential crush warnings)", enabled: true },
                { label: "Weather Calibration Alerts", desc: "Triggers alerts based on humidity and river currents indices", enabled: false },
                { label: "YOLOv8 AI Vision Processing", desc: "Real-time object detection from RTSP camera feeds", enabled: true },
                { label: "ByteTrack Unique ID Caching", desc: "Prevents duplicate counting via multi-object tracking", enabled: true },
                { label: "Gender Demographic Analytics", desc: "Male/Female/Unknown classification from AI vision", enabled: true },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors" style={{ background: "rgba(15,23,42,0.01)" }}>
                  <div>
                    <strong className="text-sm font-semibold text-slate-800 block">{item.label}</strong>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0B6B53]" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Node Details */}
          <div className="dashboard-card">
            <div className="flex items-center gap-2 mb-4">
              <Database style={{ width: 16, height: 16, color: "#0D9488" }} />
              <h3 className="card-heading">Node Details</h3>
            </div>
            <div className="space-y-2.5 text-xs">
              {[
                { label: "Active Database", value: "Neon PostgreSQL" },
                { label: "ORM", value: "Prisma v5.22.0" },
                { label: "Security Handshake", value: "SHA-256 HUD Crypt" },
                { label: "Inference Latency", value: "38ms (Nominal)", green: true },
                { label: "AI Model", value: "YOLOv8 + ByteTrack" },
                { label: "WebSocket", value: "Socket.IO Active", green: true },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">{item.label}:</span>
                  <strong className={`font-mono font-bold ${item.green ? "text-[#059669]" : "text-slate-700"}`}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pipeline Status */}
          <div className="dashboard-card">
            <div className="flex items-center gap-2 mb-4">
              <Activity style={{ width: 16, height: 16, color: "#0D9488" }} />
              <h3 className="card-heading">Pipeline Status</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "API /update", status: "listening" },
                { label: "API /cameras", status: "active" },
                { label: "API /analytics", status: "active" },
                { label: "API /alerts", status: "active" },
                { label: "WebSocket", status: "active" },
                { label: "Prisma ORM", status: "active" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-1.5">
                  <span className="text-xs font-semibold text-slate-500 font-mono">{item.label}</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.12)", color: "#047857" }}>
                    <span className="w-1.5 h-1.5 bg-[#059669] rounded-full animate-pulse" />
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
