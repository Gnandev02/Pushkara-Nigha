"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useSocket } from "@/components/SocketProvider";
import { 
  Users, 
  Video, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  Search,
  MapPin,
  Activity,
  AlertOctagon,
  Play
} from "lucide-react";

// The 12 Monitored Ghats baseline data matching Mock-data exactly
const BASELINE_GHATS = [
  {
    id: "ghat-dowleswaram",
    cameraId: "ghat_dowleswaram",
    name: "Dowleswaram Ghat",
    district: "East Godavari",
    capacity: 8000,
    occupancy: 4500,
    risk: "busy",
    camerasCount: 24,
    coordinates: { x: 42, y: 20 },
    inMen: 2500, inWomen: 2300, inOthers: 200,
    outMen: 300, outWomen: 150, outOthers: 50,
  },
  {
    id: "ghat-goshpada",
    cameraId: "local_webcam", // Map local webcam simulator here
    name: "Goshpada Ghat",
    district: "East Godavari",
    capacity: 6500,
    occupancy: 2800,
    risk: "moderate",
    camerasCount: 18,
    coordinates: { x: 48, y: 28 },
    inMen: 1500, inWomen: 1600, inOthers: 100,
    outMen: 200, outWomen: 150, outOthers: 50,
  },
  {
    id: "ghat-kotipalli",
    cameraId: "ghat_kotipalli",
    name: "Kotipalli Ghat",
    district: "East Godavari",
    capacity: 5000,
    occupancy: 1200,
    risk: "safe",
    camerasCount: 12,
    coordinates: { x: 55, y: 35 },
    inMen: 800, inWomen: 700, inOthers: 50,
    outMen: 200, outWomen: 100, outOthers: 50,
  },
  {
    id: "ghat-pushkar",
    cameraId: "ghat_1", // Map Python app.py YOLO model here
    name: "Pushkar Ghat",
    district: "East Godavari",
    capacity: 9000,
    occupancy: 7200,
    risk: "busy",
    camerasCount: 36,
    coordinates: { x: 50, y: 12 },
    inMen: 4200, inWomen: 4000, inOthers: 300,
    outMen: 800, outWomen: 400, outOthers: 100,
  },
  {
    id: "ghat-kovvur",
    cameraId: "ghat_kovvur",
    name: "Kovvur Ghat",
    district: "West Godavari",
    capacity: 7500,
    occupancy: 4800,
    risk: "busy",
    camerasCount: 22,
    coordinates: { x: 62, y: 48 },
    inMen: 2800, inWomen: 2600, inOthers: 150,
    outMen: 400, outWomen: 300, outOthers: 50,
  },
  {
    id: "ghat-narasapuram",
    cameraId: "ghat_narasapuram",
    name: "Narasapuram Ghat",
    district: "West Godavari",
    capacity: 6000,
    occupancy: 1500,
    risk: "safe",
    camerasCount: 14,
    coordinates: { x: 68, y: 56 },
    inMen: 1000, inWomen: 900, inOthers: 50,
    outMen: 250, outWomen: 150, outOthers: 50,
  },
  {
    id: "ghat-pattiseema",
    cameraId: "ghat_pattiseema",
    name: "Pattiseema Ghat",
    district: "West Godavari",
    capacity: 7000,
    occupancy: 5400,
    risk: "busy",
    camerasCount: 28,
    coordinates: { x: 78, y: 72 },
    inMen: 3200, inWomen: 3000, inOthers: 100,
    outMen: 500, outWomen: 350, outOthers: 50,
  },
  {
    id: "ghat-siddhantam",
    cameraId: "ghat_siddhantam",
    name: "Siddhantam Ghat",
    district: "West Godavari",
    capacity: 5500,
    occupancy: 1100,
    risk: "safe",
    camerasCount: 10,
    coordinates: { x: 72, y: 64 },
    inMen: 700, inWomen: 600, inOthers: 50,
    outMen: 150, outWomen: 80, outOthers: 20,
  },
  {
    id: "ghat-bhadrachalam",
    cameraId: "ghat_bhadrachalam",
    name: "Bhadrachalam Main Ghat",
    district: "Khammam",
    capacity: 7500,
    occupancy: 5920,
    risk: "busy",
    camerasCount: 34,
    coordinates: { x: 78, y: 30 },
    inMen: 3500, inWomen: 3200, inOthers: 150,
    outMen: 500, outWomen: 350, outOthers: 80,
  },
  {
    id: "ghat-edugurallapalli",
    cameraId: "ghat_edugurallapalli",
    name: "Edugurallapalli Ghat",
    district: "Khammam",
    capacity: 5000,
    occupancy: 950,
    risk: "safe",
    camerasCount: 8,
    coordinates: { x: 82, y: 22 },
    inMen: 600, inWomen: 550, inOthers: 30,
    outMen: 120, outWomen: 80, outOthers: 30,
  },
  {
    id: "ghat-koonavaram",
    cameraId: "ghat_koonavaram",
    name: "Koonavaram Ghat",
    district: "Khammam",
    capacity: 6000,
    occupancy: 2100,
    risk: "moderate",
    camerasCount: 16,
    coordinates: { x: 86, y: 38 },
    inMen: 1200, inWomen: 1100, inOthers: 100,
    outMen: 180, outWomen: 100, outOthers: 20,
  },
  {
    id: "ghat-seetharama",
    cameraId: "ghat_seetharama",
    name: "Seetharama Ghat",
    district: "Khammam",
    capacity: 7000,
    occupancy: 5100,
    risk: "busy",
    camerasCount: 24,
    coordinates: { x: 90, y: 45 },
    inMen: 3000, inWomen: 2800, inOthers: 100,
    outMen: 400, outWomen: 350, outOthers: 50,
  }
];

export default function Dashboard() {
  const { analytics, alerts, summary, resolveAlert } = useSocket();
  const [syncedTime, setSyncedTime] = useState("");

  // Update Synced Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      const hoursStr = hours < 10 ? '0' + hours : hours;
      setSyncedTime(`${hoursStr}:${minutesStr} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Map live telemetry dynamically onto the 12 ghats
  const liveGhats = useMemo(() => {
    return BASELINE_GHATS.map(ghat => {
      const liveData = analytics[ghat.cameraId];

      if (liveData) {
        const occupancy = liveData.totalPeople || 0;
        const capacity = ghat.capacity;
        const crowdDensity = (occupancy / capacity) * 100;
        
        let risk = "safe";
        if (crowdDensity > 80 || liveData.riskScore > 0.7) risk = "critical";
        else if (crowdDensity > 60 || liveData.riskScore > 0.4) risk = "busy";
        else if (crowdDensity > 30) risk = "moderate";

        // Map live gender telemetry
        const male = liveData.maleCount || 0;
        const female = liveData.femaleCount || 0;
        const unknown = liveData.unknownGender || 0;

        return {
          ...ghat,
          occupancy,
          crowdDensity,
          risk,
          inMen: male,
          inWomen: female,
          inOthers: unknown,
          lastUpdated: "Just Now",
          isLive: true
        };
      }

      // Default baseline density calculations
      const crowdDensity = (ghat.occupancy / ghat.capacity) * 100;
      return {
        ...ghat,
        crowdDensity,
        isLive: false,
        lastUpdated: "3 mins ago"
      };
    });
  }, [analytics]);

  // Aggregated dynamic stats
  const stats = useMemo(() => {
    const totalGhats = liveGhats.length;
    const totalCrowd = liveGhats.reduce((sum, g) => sum + g.occupancy, 0);
    const activeCams = liveGhats.reduce((sum, g) => sum + (g.isLive ? 1 : 0), 0);
    const highRiskSectors = liveGhats.filter(g => g.crowdDensity > 65).length;
    const safeZones = liveGhats.filter(g => g.crowdDensity < 30).length;
    const activeAlertsCount = alerts.length;

    return {
      totalGhats,
      totalCrowd,
      activeCams,
      highRiskSectors,
      safeZones,
      activeAlertsCount
    };
  }, [liveGhats, alerts]);

  // Priority queue sorted by crowd density
  const sortedPriorityGhats = useMemo(() => {
    return [...liveGhats].sort((a, b) => b.crowdDensity - a.crowdDensity);
  }, [liveGhats]);

  // Scrolling helpers
  const handleScrollToGhat = (id) => {
    const row = document.getElementById(`row-${id}`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      row.style.background = "rgba(13, 148, 136, 0.15)";
      setTimeout(() => {
        row.style.background = "";
      }, 2000);
    }
  };

  return (
    <div className="dashboard-content">
      {/* 1. Andhra Pradesh Government Header Card */}
      <div className="gov-header-card">
        <div className="gov-header-left">
          <div className="gov-header-title-container">
            <span className="gov-header-subtitle">GOVERNMENT OF ANDHRA PRADESH</span>
            <h1 className="gov-header-title">AI Crowd Management and Reporting Platform</h1>
          </div>
        </div>
        <div className="gov-header-right">
          <div className="gov-sync-badge">
            <span className="gov-sync-dot">●</span> Synced <span id="sync-time-value">{syncedTime}</span>
          </div>
          <button 
            className="gov-refresh-btn refresh-btn" 
            onClick={() => window.location.reload()}
            title="Force Sync Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          
          <div className="profile-pill">
            <div className="profile-avatar-circle">OP</div>
            <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>System Operator</span>
          </div>
        </div>
      </div>

      {/* 2. Government Info Bar */}
      <div className="gov-info-bar">
        <div className="gov-info-col">
          <span className="gov-info-label">Event window</span>
          <span className="gov-info-value font-mono">26 Jun 2027 to 7 Jul 2027 (12 days)</span>
        </div>
        <div className="gov-info-col">
          <span className="gov-info-label">Operating model</span>
          <span className="gov-info-value font-mono">ICCC led, field verified</span>
        </div>
        <div className="gov-info-col">
          <span className="gov-info-label">Public output</span>
          <span className="gov-info-value font-mono">Approved advisories only</span>
        </div>
      </div>

      {/* 3. Stats KPIs Grid */}
      <section className="overview-stats-grid">
        <div className="overview-stat-card active-ghats">
          <div className="stat-header">
            <span className="stat-title">Active Ghats</span>
            <div className="stat-icon-wrapper">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-body">
            <span className="stat-number">{stats.totalGhats}</span>
          </div>
          <div className="stat-footer-text">12 Total monitored</div>
          <div className="stat-glow-border"></div>
        </div>

        <div className="overview-stat-card live-crowd">
          <div className="stat-header">
            <span className="stat-title">Live Active Crowd</span>
            <div className="stat-icon-wrapper">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-body">
            <span className="stat-number">{stats.totalCrowd.toLocaleString()}</span>
          </div>
          <div className="stat-footer-text">Real-time devotee flow</div>
          <div className="stat-glow-border"></div>
        </div>

        <div className="overview-stat-card active-cams">
          <div className="stat-header">
            <span className="stat-title">Active AI Feeds</span>
            <div className="stat-icon-wrapper">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-body">
            <span className="stat-number">{stats.activeCams}</span>
          </div>
          <div className="stat-footer-text">Streaming smart grids</div>
          <div className="stat-glow-border"></div>
        </div>

        <div className="overview-stat-card high-risk">
          <div className="stat-header">
            <span className="stat-title">High Risk Sectors</span>
            <div className="stat-icon-wrapper">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-body">
            <span className="stat-number">{stats.highRiskSectors}</span>
          </div>
          <div className="stat-footer-text">Occupancy exceeding 65%</div>
          <div className="stat-glow-border"></div>
        </div>

        <div className="overview-stat-card safe-zones">
          <div className="stat-header">
            <span className="stat-title">Nominal Zones</span>
            <div className="stat-icon-wrapper">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-body">
            <span className="stat-number">{stats.safeZones}</span>
          </div>
          <div className="stat-footer-text">Under 30% utilization</div>
          <div className="stat-glow-border"></div>
        </div>

        <div className="overview-stat-card ai-alerts">
          <div className="stat-header">
            <span className="stat-title">Active AI Alerts</span>
            <div className="stat-icon-wrapper">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-body">
            <span className="stat-number text-neonPink">{stats.activeAlertsCount}</span>
          </div>
          <div className="stat-footer-text">Anomalies cataloged</div>
          <div className="stat-glow-border"></div>
        </div>
      </section>

      {/* 4. Split Grid Content */}
      <div className="dashboard-grid">
        <div className="left-panel-stack">
          {/* A. Live Godavari Map Visualization (Stylized SVG representation) */}
          <div className="dashboard-card map-card">
            <div className="map-header-row">
              <div className="map-header-left">
                <span className="map-section-label">GODAVARI CORRIDOR</span>
                <h3 className="map-title text-base font-bold">Live pushkar ghat risk map</h3>
              </div>
              <span className="map-ai-badge flex items-center gap-1">✦ AI assisted</span>
            </div>

            {/* Stylized Godavari river map representation */}
            <div className="relative w-full h-[320px] bg-slate-950 border border-slate-900 rounded-xl overflow-hidden mt-4 flex items-center justify-center">
              {/* Stylized Godavari River SVG winding backdrop */}
              <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 800 320" fill="none">
                <path d="M -50,160 Q 200,60 400,160 T 850,160" stroke="#0ea5e9" strokeWidth="24" strokeLinecap="round" className="animate-pulse" />
                <path d="M -50,160 Q 200,60 400,160 T 850,160" stroke="#00b4d8" strokeWidth="8" strokeLinecap="round" />
              </svg>

              {/* Grid overlay mesh */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-35" />

              {/* Active hot spots */}
              {liveGhats.map((ghat) => (
                <button
                  key={ghat.id}
                  onClick={() => handleScrollToGhat(ghat.id)}
                  style={{ left: `${ghat.coordinates.x}%`, top: `${ghat.coordinates.y}%` }}
                  className={`absolute w-4 h-4 -ml-2 -mt-2 group rounded-full z-20 flex items-center justify-center transition-all duration-300`}
                  title={`${ghat.name}: ${ghat.crowdDensity.toFixed(1)}% occupied`}
                >
                  <span className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                    ghat.risk === "critical" ? "bg-red-500" : ghat.risk === "busy" ? "bg-orange-500" : ghat.risk === "moderate" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <span className={`w-2.5 h-2.5 rounded-full border border-white/40 ${
                    ghat.risk === "critical" ? "bg-red-500" : ghat.risk === "busy" ? "bg-orange-500" : ghat.risk === "moderate" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  
                  {/* Tooltip Overlay */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 hidden group-hover:block bg-slate-900 border border-slate-800 text-left p-2.5 rounded-lg shadow-xl z-50 pointer-events-none">
                    <p className="text-[11px] font-bold text-white leading-tight">{ghat.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{ghat.crowdDensity.toFixed(1)}% density</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{ghat.occupancy.toLocaleString()} / {ghat.capacity.toLocaleString()} cap</p>
                  </div>
                </button>
              ))}
              
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 flex flex-col gap-1">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> Critical (&gt;80%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-500 rounded-full" /> Busy (60-80%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full" /> Moderate (30-60%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> Nominal (&lt;30%)</span>
              </div>
            </div>
          </div>

          {/* B. 12 GHAT LIVE SURVEILLANCE LIST */}
          <div className="surveillance-list-card">
            <div className="surveillance-list-hud-header">
              <div className="hud-header-left">
                <Activity className="w-5 h-5 text-teal-400" />
                <h3 className="hud-title font-extrabold text-base">12 GHAT LIVE SURVEILLANCE LIST</h3>
                <span className="hud-status-badge flex items-center gap-1 font-bold">
                  <span className="hud-status-dot animate-pulse"></span> ICCC Core Active
                </span>
              </div>
              
              <div className="hud-header-metrics font-mono">
                <div className="hud-metric-pill">
                  <span className="hud-metric-lbl">Monitored</span>
                  <strong className="hud-metric-val">{stats.totalGhats}</strong>
                </div>
                <div className="hud-metric-pill">
                  <span className="hud-metric-lbl">Live Feeds</span>
                  <strong className="hud-metric-val">{stats.activeCams}</strong>
                </div>
                <div className="hud-metric-pill">
                  <span className="hud-metric-lbl">Live Crowd</span>
                  <strong className="hud-metric-val">{stats.totalCrowd.toLocaleString()}</strong>
                </div>
                <div className="hud-metric-pill">
                  <span className="hud-metric-lbl">Synced</span>
                  <strong className="hud-metric-val">{syncedTime}</strong>
                </div>
              </div>
            </div>

            <div className="surveillance-table-responsive-wrapper">
              <table className="surveillance-cyber-table font-mono">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>#</th>
                    <th>Ghat Name</th>
                    <th>District</th>
                    <th>Zone Status</th>
                    <th>Capacity</th>
                    <th>Current Crowd</th>
                    <th style={{ minWidth: "140px" }}>Occupancy %</th>
                    <th>Inflow (M/F/O)</th>
                    <th>Cameras</th>
                    <th>Risk Status</th>
                    <th>Last Updated</th>
                    <th>Live Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveGhats.map((g, index) => {
                    const density = g.crowdDensity;
                    const pct = Math.min(100, Math.max(0, density)).toFixed(1);
                    
                    let zoneStatus = "open";
                    let zoneLabel = "OPEN ZONE";
                    if (density > 80) {
                      zoneStatus = "highly-crowded";
                      zoneLabel = "HIGH DENSITY";
                    } else if (density >= 50) {
                      zoneStatus = "crowded";
                      zoneLabel = "CROWDED";
                    }

                    return (
                      <tr 
                        key={g.id} 
                        id={`row-${g.id}`} 
                        className={`hover:bg-slate-900/50 transition-colors cursor-pointer ${g.isLive ? 'border-l-2 border-l-teal-500' : ''}`}
                      >
                        <td className="table-serial-col">{index + 1}</td>
                        <td className="table-name-col font-bold text-white">{g.name}</td>
                        <td>{g.district}</td>
                        <td>
                          <span className={`table-zone-badge ${zoneStatus}`}>{zoneLabel}</span>
                        </td>
                        <td>{g.capacity.toLocaleString()}</td>
                        <td className="font-bold text-slate-200">{g.occupancy.toLocaleString()}</td>
                        <td>
                          <div className="table-progress-wrapper flex items-center gap-2">
                            <div className="table-progress-bar-track flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`table-progress-bar-fill h-full rounded-full ${
                                  g.risk === "critical" ? "bg-red-500" : g.risk === "busy" ? "bg-orange-500" : g.risk === "moderate" ? "bg-amber-500" : "bg-emerald-500"
                                }`} 
                                style={{ width: `${pct}%` }} 
                              />
                            </div>
                            <span className="table-progress-pct text-[11px] font-bold min-w-[36px]">{pct}%</span>
                          </div>
                        </td>
                        <td className="text-slate-400 font-mono text-[10px]">
                          {g.inMen}/{g.inWomen}/{g.inOthers}
                        </td>
                        <td>{g.camerasCount}</td>
                        <td>
                          <span className={`table-risk-badge ${g.risk}`}>{g.risk.toUpperCase()}</span>
                        </td>
                        <td className="text-[10px] text-slate-500">{g.lastUpdated}</td>
                        <td>
                          <span className={`table-live-status ${g.isLive ? 'critical' : ''}`}>
                            <span className="table-live-status-dot"></span> {g.isLive ? "LIVE" : "ACTIVE"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* C. Live Heatmap Density Matrix */}
          <div className="overview-heatmap-section">
            <div className="heatmap-header">
              <div className="heatmap-title-group flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <h3 className="card-heading font-extrabold text-base">Live Devotee Density Heatmap Matrix</h3>
              </div>
              <span className="map-ai-badge">✦ Interactive Real-time Map grid</span>
            </div>

            <div className="heatmap-grid mt-4">
              {liveGhats.map((g) => (
                <div 
                  key={g.id} 
                  className={`heatmap-block ${g.risk} cursor-pointer`}
                  onClick={() => handleScrollToGhat(g.id)}
                >
                  <span className="heatmap-block-name font-bold">{g.name}</span>
                  <strong className="heatmap-block-pct font-mono">{Math.round(g.crowdDensity)}%</strong>
                  <div className="heatmap-pulse-dot"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Right Sidebar incident Queue */}
        <div className="right-sidebar-panel">
          <div className="dashboard-card">
            <div className="card-header-row mb-4">
              <div className="card-title-group flex items-center gap-2.5">
                <div className="card-icon-container bg-red-500/10 text-red-500">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="card-heading font-extrabold">Highest Priority Ghats</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Real-time capacity overload ranking</span>
                </div>
              </div>
            </div>

            <div className="alert-queue-container flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-1">
              {sortedPriorityGhats.map((ghat) => (
                <div 
                  key={ghat.id} 
                  className={`alert-queue-item ${ghat.risk} cursor-pointer hover:border-slate-700 transition-colors`}
                  onClick={() => handleScrollToGhat(ghat.id)}
                >
                  <div className="queue-item-header flex justify-between items-start">
                    <div>
                      <h4 className="queue-item-title font-bold text-white text-[12px]">{ghat.name}</h4>
                      <span className="queue-item-subtitle text-[10px] text-slate-500 font-mono">{ghat.district}</span>
                    </div>
                    <span className={`queue-badge ${ghat.risk} text-[9px] font-bold font-mono px-2 py-0.5 rounded capitalize`}>
                      {ghat.risk}
                    </span>
                  </div>

                  <div className="queue-item-progress mt-2.5 font-mono">
                    <div className="progress-info flex justify-between text-[10px] text-slate-400">
                      <span>Density Index</span>
                      <strong className="text-white">{ghat.crowdDensity.toFixed(1)}%</strong>
                    </div>

                    <div className="progress-bar-track bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className={`progress-bar-fill h-full rounded-full ${
                          ghat.risk === "critical" ? "bg-red-500" : ghat.risk === "busy" ? "bg-orange-500" : ghat.risk === "moderate" ? "bg-amber-500" : "bg-emerald-500"
                        }`} 
                        style={{ width: `${ghat.crowdDensity}%` }} 
                      />
                    </div>

                    <div className="queue-footer-stats flex justify-between text-[9px] text-slate-500 mt-2">
                      <span>{ghat.occupancy.toLocaleString()} / {ghat.capacity.toLocaleString()} max</span>
                      <span>{ghat.camerasCount} Active Cams</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
