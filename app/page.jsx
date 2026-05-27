"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useSocket } from "@/components/SocketProvider";
import { MONITORED_GHATS } from "@/lib/ghats-data";
import {
  Layers, Users, Video, AlertTriangle, ShieldCheck, Cpu, RefreshCw
} from "lucide-react";

const GhatMap = dynamic(() => import("@/components/GhatMap"), { ssr: false });

// ─── Helpers ────────────────────────────────────────────────
function getRiskClass(risk) {
  if (risk === "safe") return "safe";
  if (risk === "moderate") return "moderate";
  if (risk === "busy") return "busy";
  return "critical";
}
function getHeatmapClass(density) {
  if (density < 30) return "safe";
  if (density < 55) return "moderate";
  if (density < 70) return "busy";
  return "critical";
}

// ─── Main Page ───────────────────────────────────────────────
export default function OverviewPage() {
  const { analytics, summary, alerts } = useSocket();
  const [now, setNow] = useState(() => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
  const timerRef = useRef(null);
  
  // Sync with manual inputs from the Monitoring page
  const [monitoringState, setMonitoringState] = useState(null);

  useEffect(() => {
    // Initial load from local storage for instant UI
    const saved = localStorage.getItem("pushkara_monitoring_state");
    if (saved) {
      try {
        setMonitoringState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse monitoring state", e);
      }
    }

    // Fetch actual global state from API to ensure cross-device sync
    const fetchGlobalState = () => {
      fetch("/api/state")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.state) {
            setMonitoringState(data.state);
            localStorage.setItem("pushkara_monitoring_state", JSON.stringify(data.state));
          }
        })
        .catch(console.error);
    };
    fetchGlobalState();

    // Listen for cross-tab updates (e.g. if user is editing in Monitoring tab)
    const handleStorageChange = (e) => {
      if (e.key === "pushkara_monitoring_state" && e.newValue) {
        setMonitoringState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    timerRef.current = setInterval(() => {
      setNow(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
      fetchGlobalState(); // Keep overview in sync with other devices every 30s
    }, 30000);
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current); 
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Get live ghats data merged with real-time socket/API telemetry and manual inputs
  const liveGhats = MONITORED_GHATS.map(g => {
    const liveIn = analytics && analytics[g.camInId];
    const liveOut = analytics && analytics[g.camOutId];
    const monState = monitoringState && monitoringState[g.id];

    // Priority:
    // 1. Live AI backend feed (if > 0, to avoid blanking out during resets)
    // 2. Manual inputs from Monitoring page (monState)
    // 3. Fallback mock data from ghats-data.ts (g)
    const getVal = (liveData, monVal, fallbackVal, field) => {
      if (liveData && liveData[field] > 0) return liveData[field];
      if (monState !== undefined && monVal !== undefined) return monVal;
      return fallbackVal;
    };

    const inMen = getVal(liveIn, monState?.inMen, g.inMen, 'maleCount');
    const inWomen = getVal(liveIn, monState?.inWomen, g.inWomen, 'femaleCount');
    const inOthers = getVal(liveIn, monState?.inOthers, g.inOthers, 'unknownGender');

    const outMen = getVal(liveOut, monState?.outMen, g.outMen, 'maleCount');
    const outWomen = getVal(liveOut, monState?.outWomen, g.outWomen, 'femaleCount');
    const outOthers = getVal(liveOut, monState?.outOthers, g.outOthers, 'unknownGender');

    const capacity = monState?.capacity || g.capacity;

    const crowd = Math.max(0, (inMen + inWomen + inOthers) - (outMen + outWomen + outOthers));
    const crowdDensity = capacity > 0 ? (crowd / capacity) * 100 : 0;

    let risk = g.risk;
    if (liveIn || liveOut) {
      if (crowdDensity < 30) risk = "safe";
      else if (crowdDensity <= 55) risk = "moderate";
      else if (crowdDensity <= 80) risk = "busy";
      else risk = "critical";
    }

    // Check alerts
    const hasActiveAlert = Array.isArray(alerts) && alerts.some(a => !a.resolved && (a.cameraId === g.camInId || a.cameraId === g.camOutId));
    if (hasActiveAlert) {
      risk = "critical";
    }

    return {
      ...g,
      inMen,
      inWomen,
      inOthers,
      outMen,
      outWomen,
      outOthers,
      crowd,
      crowdDensity,
      risk,
      hasActiveAlert,
    };
  });

  // KPI calculations using liveGhats
  const totalLiveCrowd = liveGhats.reduce((s, g) => s + g.crowd, 0);
  const highRisk = liveGhats.filter(g => g.crowdDensity > 65).length;
  const nominalZones = liveGhats.filter(g => g.crowdDensity < 30).length;
  const activeGhats = liveGhats.length;
  const totalCameras = liveGhats.reduce((s, g) => s + g.camerasCount, 0);
  const activeAlerts = Array.isArray(alerts) ? alerts.length : 0;

  // Priority ghats (highest density)
  const priorityGhats = [...liveGhats].sort((a, b) => b.crowdDensity - a.crowdDensity).slice(0, 5);

  return (
    <div className="p-6 space-y-5">

      {/* Gov Header Card */}
      <div className="gov-header-card">
        <div className="flex items-center gap-3">
          <div>
            <span className="gov-header-subtitle">GOVERNMENT OF ANDHRA PRADESH</span>
            <h1 className="gov-header-title">AI Crowd Management and Reporting Platform</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="gov-sync-badge">
            <span className="gov-sync-dot">●</span>
            Synced&nbsp;<span className="font-mono font-bold">{now}</span>
          </div>
          <button
            onClick={() => setNow(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }))}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-[#0D9488]"
            title="Refresh telemetry"
          >
            <RefreshCw style={{ width: 14, height: 14 }} />
          </button>
          <div className="profile-pill">
            <div className="profile-avatar-circle">OP</div>
            <span className="text-xs font-semibold text-slate-600">System Operator</span>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="gov-info-bar">
        <div className="gov-info-col">
          <span className="gov-info-label">Event window</span>
          <span className="gov-info-value">26 Jun 2027 to 7 Jul 2027 (12 days)</span>
        </div>
        <div className="gov-info-col">
          <span className="gov-info-label">Operating model</span>
          <span className="gov-info-value">ICCC led, field verified</span>
        </div>
        <div className="gov-info-col">
          <span className="gov-info-label">Public output</span>
          <span className="gov-info-value">Approved advisories only</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Active Ghats", value: activeGhats, sub: "12 Total monitored", icon: Layers, colorClass: "" },
          { label: "Live Active Crowd", value: totalLiveCrowd.toLocaleString(), sub: "Real-time devotee flow", icon: Users, colorClass: "" },
          { label: "Active AI Feeds", value: totalCameras, sub: "Streaming smart grids", icon: Video, colorClass: "" },
          { label: "High Risk Sectors", value: highRisk, sub: "Occupancy exceeding 65%", icon: AlertTriangle, colorClass: "red" },
          { label: "Nominal Zones", value: nominalZones, sub: "Under 30% utilization", icon: ShieldCheck, colorClass: "green" },
          { label: "Active AI Alerts", value: activeAlerts, sub: "Anomalies cataloged", icon: Cpu, colorClass: "" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="overview-stat-card">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(11,107,83,0.08)" }}>
                  <Icon className="text-[#0B6B53]" style={{ width: 16, height: 16 }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800 font-mono mb-1">{kpi.value}</div>
              <div className="text-[10px] text-slate-400 font-medium">{kpi.sub}</div>
              <div className={`stat-glow-border ${kpi.colorClass}`} />
            </div>
          );
        })}
      </section>

      {/* ROW 1: Google Maps (Left) and Priority/System Status (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">
        
        {/* Left: Google Maps Live Ghat Visualization */}
        <div className="xl:col-span-2 flex flex-col">
          <div className="dashboard-card p-0 overflow-hidden relative flex-1 flex flex-col min-h-[550px]">
            <div className="flex items-center justify-between px-5 py-4 bg-white z-10 relative" style={{ borderBottom: "1px solid #F1F5F9" }}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0D9488]"></span>
                </span>
                <h3 className="card-heading">LIVE GODAVARI PUSHKAR GHAT MAP</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(13,148,136,0.1)", color: "#0D9488" }}>
                  Real-time GIS Command Overlay
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold font-mono">
                ICCC DIRECT ACTIVE FEED
              </div>
            </div>
            <div className="w-full flex-1 relative bg-slate-50">
              <GhatMap liveGhats={liveGhats} />
            </div>
          </div>
        </div>

        {/* Right: Highest Priority Ghats & System Status */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="dashboard-card flex-1">
            <div className="card-header-row mb-4">
              <div className="card-title-group">
                <div className="card-icon-container" style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626" }}>
                  <AlertTriangle style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h3 className="card-heading">Highest Priority Ghats</h3>
                  <span className="text-[11px] text-slate-400">Crowd density and occupancy monitoring</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {priorityGhats.map((g) => {
                const crowd = g.crowd;
                const pct = g.capacity > 0 ? ((crowd / g.capacity) * 100).toFixed(1) : "0.0";
                const cls = getRiskClass(g.risk);
                return (
                  <div key={g.id} className={`alert-queue-item ${cls}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{g.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{g.district}</p>
                      </div>
                      <span className={`table-risk-badge ${cls}`}>
                        {g.crowdDensity.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar-container" style={{ flex: 1 }}>
                        <div
                          className={`progress-bar-fill ${cls === "safe" ? "bg-safe" : cls === "moderate" ? "bg-warn" : "bg-crit"}`}
                          style={{ width: `${Math.min(100, g.crowdDensity)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{crowd.toLocaleString()} / {g.capacity.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="dashboard-card">
            <h3 className="card-heading mb-3">System Status</h3>
            <div className="space-y-2">
              {[
                { label: "AI Model Accuracy", value: "97.4%", color: "#059669" },
                { label: "Inference Latency", value: "38ms", color: "#059669" },
                { label: "Online Sensors", value: "112", color: "#0F172A" },
                { label: "Incidents Resolved", value: "18 today", color: "#0F172A" },
                { label: "Citizen Reports", value: "96 received", color: "#0F172A" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-medium text-slate-500">{item.label}</span>
                  <strong className="text-xs font-bold font-mono" style={{ color: item.color }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Live Monitoring Tables and Cards (Full Width Below) */}
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-5">
          
          {/* 12 Ghat Surveillance Table */}
          <div className="dashboard-card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
              <div className="flex items-center gap-2">
                <Activity className="text-[#0B6B53]" style={{ width: 18, height: 18 }} />
                <h3 className="card-heading">12 GHAT LIVE SURVEILLANCE LIST</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#047857" }}>
                  <span className="hud-status-dot" />ICCC Core Active
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                <span>Monitored: <strong className="text-slate-700">12</strong></span>
                <span>|</span>
                <span>Cameras: <strong className="text-slate-700">{totalCameras}</strong></span>
                <span>|</span>
                <span>Live Crowd: <strong className="text-slate-700">{totalLiveCrowd.toLocaleString()}</strong></span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="surveillance-cyber-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ghat Name</th>
                    <th>District</th>
                    <th>Zone Status</th>
                    <th>Capacity</th>
                    <th>Current Crowd</th>
                    <th>Occupancy %</th>
                    <th>Cameras</th>
                    <th>Risk Status</th>
                    <th>Last Updated</th>
                    <th>Live Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveGhats.map((g, i) => {
                    const crowd = g.crowd;
                    const pct = g.capacity > 0 ? ((crowd / g.capacity) * 100).toFixed(1) : "0.0";
                    const pctNum = parseFloat(pct);
                    const zoneLabel = pctNum < 30 ? "OPEN ZONE" : pctNum <= 65 ? "CROWDED" : "HIGHLY CROWDED";
                    const riskClass = getRiskClass(g.risk);
                    const overCapacity = crowd >= g.capacity;
                    return (
                      <tr key={g.id}>
                        <td className="text-slate-400 font-mono text-xs">{String(i + 1).padStart(2, "0")}</td>
                        <td className="font-bold text-slate-800">{g.name}</td>
                        <td className="text-slate-500">{g.district}</td>
                        <td>
                          <span className={`zone-badge zone-${pctNum < 30 ? "safe" : pctNum <= 65 ? "warn" : "crit"}`}>
                            {zoneLabel}
                          </span>
                        </td>
                        <td className="font-mono font-semibold">{g.capacity.toLocaleString()}</td>
                        <td className="font-mono font-bold text-slate-900">{crowd.toLocaleString()}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="progress-bar-container" style={{ width: 80 }}>
                              <div
                                className={`progress-bar-fill ${pctNum < 50 ? "bg-safe" : pctNum <= 80 ? "bg-warn" : "bg-crit"}`}
                                style={{ width: `${Math.min(100, pctNum)}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold font-mono text-slate-600">{pct}%</span>
                          </div>
                        </td>
                        <td className="font-mono">{g.camerasCount}</td>
                        <td>
                          <span className={`table-risk-badge ${riskClass}`}>
                            {riskClass === "safe" ? "SAFE" : riskClass === "moderate" ? "MODERATE" : riskClass === "busy" ? "ELEVATED" : "CRITICAL"}
                          </span>
                        </td>
                        <td className="text-slate-400 text-[11px] font-mono">{g.lastUpdated}</td>
                        <td>
                          <span className={`table-live-status ${overCapacity ? "critical" : ""}`}>
                            <span className="table-live-status-dot" />
                            {overCapacity ? "AT CAPACITY" : "LIVE"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Density Heatmap Grid */}
          <div className="dashboard-card">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="card-heading">Live Devotee Density Heatmap Matrix</h3>
              <span className="ml-auto text-[10px] font-bold text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded">✦ Interactive Real-time Map grid</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {liveGhats.map((g) => {
                const crowd = g.crowd;
                const cls = getHeatmapClass(g.crowdDensity);
                return (
                  <div key={g.id} className={`heatmap-block ${cls}`}>
                    <span className="heatmap-pulse-dot" />
                    <span className="heatmap-block-name">{g.name.replace(" Ghat", "")}</span>
                    <span className="heatmap-block-pct">{g.crowdDensity.toFixed(1)}%</span>
                    <span className="text-[9px] font-semibold text-slate-500 font-mono">{crowd.toLocaleString()} ppl</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Required: import Activity locally (workaround for dynamic imports)
function Activity({ className, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
