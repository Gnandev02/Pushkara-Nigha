"use client";

import { useState, useCallback, useEffect } from "react";
import { MONITORED_GHATS, getZoneLabel, getRiskLabel } from "@/lib/ghats-data";
import { Search, MapPin, Activity, Users, RotateCcw, Layers, ChevronDown, AlertTriangle } from "lucide-react";

function initState() {
  const state = {};
  MONITORED_GHATS.forEach(g => {
    state[g.id] = {
      inMen: 0, inWomen: 0, inOthers: 0,
      outMen: 0, outWomen: 0, outOthers: 0,
      capacity: g.capacity,
    };
  });
  return state;
}

// ── IndexedDB Local Video Store ──────────────────────────────
const DB_NAME = "PushkaraCCTVStore";
const STORE_NAME = "videos";

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveVideoLocally(camId, file) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(file, camId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Local save failed", err);
  }
}

async function getVideoLocally(camId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(camId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Local load failed", err);
    return null;
  }
}

async function deleteVideoLocally(camId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(camId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Local delete failed", err);
  }
}


// ── Radial SVG Ring ──────────────────────────────────────────
function RadialRing({ pct }) {
  const CIRC = 119.38;
  const offset = CIRC - (Math.min(100, pct) / 100) * CIRC;
  const color = pct < 30 ? "#10B981" : pct <= 75 ? "#D97706" : pct <= 90 ? "#EA580C" : "#DC2626";
  return (
    <div className="capacity-radial-container">
      <svg className="radial-svg" width="46" height="46">
        <circle className="radial-bg-ring" cx="23" cy="23" r="19" />
        <circle
          className="radial-fill-ring"
          cx="23" cy="23" r="19"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ stroke: color, transition: "stroke-dashoffset 0.5s ease, stroke 0.3s" }}
        />
      </svg>
      <span className="radial-pct-text">{Math.round(pct)}%</span>
    </div>
  );
}

// ── CCTV Panel ───────────────────────────────────────────────
function CCTVPanel({ type, camId, title, state, ghatId, onChange, onUpload, initialVideoSrc }) {
  const [videoSrc, setVideoSrc] = useState(null);
  
  // Sync local IndexedDB or initial props
  useEffect(() => {
    let objectUrl = null;
    getVideoLocally(camId).then(file => {
      if (file) {
        objectUrl = URL.createObjectURL(file);
        setVideoSrc(objectUrl);
      } else if (initialVideoSrc && !videoSrc) {
        setVideoSrc(initialVideoSrc);
      }
    });
    
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [camId, initialVideoSrc]);
  
  const fields = type === "in"
    ? ["inMen", "inWomen", "inOthers"]
    : ["outMen", "outWomen", "outOthers"];

  const labels = ["Men", "Women", "Others"];

  return (
    <div>
      <div className="cctv-screen mb-2 group relative">
        {videoSrc && (
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[6px]">
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-110"
            />
          </div>
        )}
        <div className="cctv-scanline" />
        <div className="cctv-moving-line" />
        <div className="cctv-hud-top">
          <span className="cctv-live-tag">
            <span className="cctv-live-dot" />
            {type === "in" ? "LIVE IN" : "LIVE OUT"}
          </span>
          <span className="cctv-cam-id">{camId}</span>
        </div>
        <div className="flex-1 relative z-10" style={{ minHeight: 40 }} />
        <div className="text-[8px] font-mono text-[#2DD4BF]/50 select-none relative z-10">
          AI DETECT: ON | REC
        </div>
        
        {/* Hover Upload Overlay */}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-sm rounded-[6px]">
          <label className="cursor-pointer bg-[#0D9488] hover:bg-[#0F766E] text-white px-4 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-2 shadow-lg border border-[#0D9488]/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {videoSrc ? "CHANGE FEED" : "UPLOAD FEED"}
            <input type="file" className="hidden" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                // if (videoSrc && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
                setVideoSrc(URL.createObjectURL(file));
                saveVideoLocally(camId, file);
                if (onUpload) {
                  onUpload(file, ghatId, camId, type);
                }
              }
              e.target.value = ''; // Reset input
            }} />
          </label>
          {videoSrc && (
            <button
              type="button"
              onClick={() => {
                if (videoSrc && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc);
                setVideoSrc(null);
                deleteVideoLocally(camId);
              }}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-500 hover:text-red-400 px-3 py-1.5 rounded-md text-[10px] font-bold transition-colors border border-red-500/30"
            >
              REMOVE FEED
            </button>
          )}
        </div>
      </div>
      <div className="cctv-inputs-panel">
        <h4 className="input-panel-title">{title}</h4>
        <div className="input-controls-row">
          {fields.map((field, i) => (
            <div key={field} className="counter-control">
              <label>{labels[i]}</label>
              <div className="counter-input-group">
                <button
                  type="button"
                  className="cnt-btn dec"
                  onClick={() => onChange(ghatId, field, Math.max(0, state[field] - 1))}
                >−</button>
                <input
                  type="number"
                  className="cnt-input"
                  value={state[field]}
                  min={0}
                  onChange={e => onChange(ghatId, field, Math.max(0, parseInt(e.target.value) || 0))}
                />
                <button
                  type="button"
                  className="cnt-btn inc"
                  onClick={() => onChange(ghatId, field, state[field] + 1)}
                >+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Ghat Monitor Card ────────────────────────────────────────
function GhatCard({ ghat, state, onChange, onUpload, dbCameras }) {
  const totalIn = state.inMen + state.inWomen + state.inOthers;
  const totalOut = state.outMen + state.outWomen + state.outOthers;
  const crowd = Math.max(0, totalIn - totalOut);
  const remaining = Math.max(0, state.capacity - crowd);
  const pct = state.capacity > 0 ? (crowd / state.capacity) * 100 : 0;
  const pctStr = pct.toFixed(1);
  const atCapacity = crowd >= state.capacity;
  const zoneLabel = getZoneLabel(pct);
  const riskClass = getRiskLabel(pct);
  const progressClass = pct < 50 ? "bg-safe" : pct <= 80 ? "bg-warn" : "bg-crit";
  const cardBorderClass = pct < 30 ? "zone-open" : pct <= 65 ? "zone-crowded" : "zone-highly-crowded";

  return (
    <div className={`dashboard-card ghat-monitor-card ${cardBorderClass}`} id={`monitor-ghat-${ghat.id}`}>
      {/* Card Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <RadialRing pct={pct} />
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">{ghat.name}</h3>
            <span className="text-[11px] text-slate-400 font-medium">{ghat.districtFull}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <input
            type="number"
            value={state.capacity}
            min={1}
            onChange={e => onChange(ghat.id, "capacity", Math.max(1, parseInt(e.target.value) || 5000))}
            className="w-20 text-right text-xs font-bold font-mono border border-slate-200 rounded px-2 py-1 text-slate-600 bg-slate-50 focus:outline-none focus:border-[#0D9488]"
            title="Edit capacity"
          />
          <span className="text-[9px] text-slate-400 font-medium">CAPACITY</span>
        </div>
      </div>

      {/* Badge row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="zone-badge">{zoneLabel}</span>
        <span className={`risk-level-badge ${riskClass}`}>
          {riskClass === "safe" ? "SAFE ZONE" : riskClass === "warn" ? "MODERATE RISK" : riskClass === "busy" ? "HIGH DENSITY" : "CRITICAL LIMIT"}
        </span>
        <span className="text-[10px] text-[#0D9488] font-semibold bg-[#0D9488]/8 px-2 py-0.5 rounded">
          ✦ AI: {ghat.aiTrend}
        </span>
      </div>

      {/* CCTV Grid */}
      <div className="monitor-cctv-grid">
        <CCTVPanel type="in" camId={ghat.camInId} title="Entry counters" state={state} ghatId={ghat.id} onChange={onChange} onUpload={onUpload} initialVideoSrc={dbCameras[ghat.camInId]?.rtspUrl} />
        <CCTVPanel type="out" camId={ghat.camOutId} title="Exit counters" state={state} ghatId={ghat.id} onChange={onChange} onUpload={onUpload} initialVideoSrc={dbCameras[ghat.camOutId]?.rtspUrl} />
      </div>

      {/* Flow Telemetry */}
      <div className="monitor-stats-panel">
        <div className="monitor-stats-row">
          <div className="stat-box">
            <span className="stat-lbl">Total Entered</span>
            <strong className="stat-val">{totalIn.toLocaleString()}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-lbl">Total Exited</span>
            <strong className="stat-val">{totalOut.toLocaleString()}</strong>
          </div>
          <div className="stat-box main-stat">
            <span className="stat-lbl">Current Crowd</span>
            <strong className="stat-val">{crowd.toLocaleString()}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-lbl">Remaining Cap.</span>
            <strong className="stat-val">{remaining.toLocaleString()}</strong>
          </div>
        </div>

        {/* Occupancy bar */}
        <div className="occupancy-progress-row mt-3">
          <div className="progress-bar-container">
            <div className={`progress-bar-fill ${progressClass}`} style={{ width: `${Math.min(100, pct)}%` }} />
          </div>
          <span className="occupancy-text">{pctStr}% occupied ({crowd.toLocaleString()} / {state.capacity.toLocaleString()})</span>
        </div>

        {/* Warning banner */}
        {atCapacity && (
          <div className="occupancy-warning-banner mt-3">
            <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span>ENTRY BLOCKED — GHAT FULL ({crowd.toLocaleString()} / {state.capacity.toLocaleString()})</span>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="card-timestamp-footer">Telemetry updated: {ghat.lastUpdated}</div>
    </div>
  );
}

// ── District Group ────────────────────────────────────────────
function DistrictGroup({ district, ghats, states, onChange, onUpload, collapsed, onToggle, searchQuery, dbCameras }) {
  const visibleGhats = ghats.filter(g =>
    !searchQuery || g.name.toLowerCase().includes(searchQuery) || g.districtFull.toLowerCase().includes(searchQuery)
  );
  if (visibleGhats.length === 0) return null;

  const totalCrowd = visibleGhats.reduce((s, g) => {
    const st = states[g.id];
    return s + Math.max(0, (st.inMen + st.inWomen + st.inOthers) - (st.outMen + st.outWomen + st.outOthers));
  }, 0);
  const totalCap = visibleGhats.reduce((s, g) => s + states[g.id].capacity, 0);
  const avgOcc = totalCap > 0 ? ((totalCrowd / totalCap) * 100).toFixed(1) : "0.0";

  return (
    <section className={`area-group-section ${collapsed ? "collapsed" : ""}`}>
      <div className="area-section-header" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-slate-900">{district} District</h3>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <div className="area-stat-chip">
              <Layers style={{ width: 13, height: 13 }} />
              Sectors: <strong className="area-meta-value ml-1">{visibleGhats.length}</strong>
            </div>
            <span className="text-slate-300">|</span>
            <div className="area-stat-chip">
              <Users style={{ width: 13, height: 13 }} />
              Crowd: <strong className="area-meta-value ml-1">{totalCrowd.toLocaleString()}</strong>
            </div>
            <span className="text-slate-300">|</span>
            <div className="area-stat-chip">
              <Activity style={{ width: 13, height: 13 }} />
              Occupancy: <strong className="area-meta-value ml-1">{avgOcc}%</strong>
            </div>
          </div>
        </div>
        <button type="button" className="area-collapse-btn">
          <ChevronDown style={{ width: 18, height: 18 }} />
        </button>
      </div>
      <div className="monitoring-grid grid grid-cols-1 xl:grid-cols-2 gap-5">
        {visibleGhats.map(g => (
          <GhatCard key={g.id} ghat={g} state={states[g.id]} onChange={onChange} onUpload={onUpload} dbCameras={dbCameras} />
        ))}
      </div>
    </section>
  );
}

// ── Main Monitoring Page ─────────────────────────────────────
export default function MonitoringPage() {
  const [states, setStates] = useState(initState);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [collapsed, setCollapsed] = useState({});
  const [dbCameras, setDbCameras] = useState({});

  useEffect(() => {
    const fetchCameraData = () => {
      fetch("/api/cameras", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.cameras) {
            const camMap = {};
            // Make mapping case-insensitive to ensure linking works regardless of backend formatting
            data.cameras.forEach(c => {
              if (c.cameraId) camMap[c.cameraId.toLowerCase()] = c;
            });
            setDbCameras(camMap);

            setStates(prev => {
              const nextState = { ...prev };
              let hasChanges = false;
              
              MONITORED_GHATS.forEach(g => {
                const camIn = camMap[g.camInId.toLowerCase()];
                const camOut = camMap[g.camOutId.toLowerCase()];
                const curr = nextState[g.id];
                
                if (!curr) return;
                
                const updates = { ...curr };
                let modified = false;
                
                // Only link/update if the backend provides valid detected counts (>0)
                // This prevents wiping out manual baseline inputs when the AI starts
                if (camIn && camIn.genderBreakdown) {
                  const m = camIn.genderBreakdown.male || 0;
                  const f = camIn.genderBreakdown.female || 0;
                  const u = camIn.genderBreakdown.unknown || 0;
                  
                  if (m > 0 && updates.inMen !== m) { updates.inMen = m; modified = true; }
                  if (f > 0 && updates.inWomen !== f) { updates.inWomen = f; modified = true; }
                  if (u > 0 && updates.inOthers !== u) { updates.inOthers = u; modified = true; }
                }
                
                if (camOut && camOut.genderBreakdown) {
                  const m = camOut.genderBreakdown.male || 0;
                  const f = camOut.genderBreakdown.female || 0;
                  const u = camOut.genderBreakdown.unknown || 0;
                  
                  if (m > 0 && updates.outMen !== m) { updates.outMen = m; modified = true; }
                  if (f > 0 && updates.outWomen !== f) { updates.outWomen = f; modified = true; }
                  if (u > 0 && updates.outOthers !== u) { updates.outOthers = u; modified = true; }
                }
                
                if (modified) {
                  nextState[g.id] = updates;
                  hasChanges = true;
                }
              });
              
              return hasChanges ? nextState : prev;
            });
          }
        })
        .catch(console.error);
    };

    fetchCameraData();
    const interval = setInterval(fetchCameraData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = useCallback((ghatId, field, value) => {
    setStates(prev => ({ ...prev, [ghatId]: { ...prev[ghatId], [field]: value } }));
  }, []);

  const handleUpload = useCallback(async (file, ghatId, camId, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("camera_id", camId);
    formData.append("ghat_id", ghatId);
    formData.append("type", type);
    
    // First save to our Next.js API for persistence
    try {
      const dbResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (dbResponse.ok) {
        console.log("Video saved to Next.js DB successfully");
      }
    } catch (err) {
      console.error("Failed to save to Next.js DB", err);
    }

    // Also send to FastAPI backend running on port 8000 for analytics
    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Upload initiated for", camId);
      } else {
        console.error("Upload failed", response.status);
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  }, []);

  const resetFilters = () => {
    setSearch("");
    setDistrictFilter("all");
    setStatusFilter("all");
    setCapacityFilter("all");
  };

  // Group ghats by district
  const districts = ["East Godavari", "West Godavari", "Khammam"];
  const grouped = {};
  districts.forEach(d => { grouped[d] = []; });
  MONITORED_GHATS.forEach(g => {
    // Apply district filter
    if (districtFilter !== "all" && g.district !== districtFilter) return;
    // Apply capacity filter
    if (capacityFilter === "low" && g.capacity >= 7000) return;
    if (capacityFilter === "mid" && (g.capacity < 7000 || g.capacity > 8500)) return;
    if (capacityFilter === "high" && g.capacity <= 8500) return;
    // Apply density filter
    if (statusFilter !== "all") {
      const st = states[g.id];
      const crowd = Math.max(0, (st.inMen + st.inWomen + st.inOthers) - (st.outMen + st.outWomen + st.outOthers));
      const pct = st.capacity > 0 ? (crowd / st.capacity) * 100 : 0;
      if (statusFilter === "open" && pct >= 30) return;
      if (statusFilter === "crowded" && (pct < 30 || pct > 65)) return;
      if (statusFilter === "highly-crowded" && pct <= 65) return;
    }
    grouped[g.district]?.push(g);
  });

  // Global stats
  const allGhats = MONITORED_GHATS;
  const totalLive = allGhats.reduce((s, g) => {
    const st = states[g.id];
    return s + Math.max(0, (st.inMen + st.inWomen + st.inOthers) - (st.outMen + st.outWomen + st.outOthers));
  }, 0);
  let mostCrowded = "N/A"; let maxPct = -1;
  let safest = "N/A"; let minPct = 999;
  districts.forEach(d => {
    const ghats = MONITORED_GHATS.filter(g => g.district === d);
    const totCap = ghats.reduce((s, g) => s + states[g.id].capacity, 0);
    const totCrowd = ghats.reduce((s, g) => {
      const st = states[g.id];
      return s + Math.max(0, (st.inMen + st.inWomen + st.inOthers) - (st.outMen + st.outWomen + st.outOthers));
    }, 0);
    const pct = totCap > 0 ? (totCrowd / totCap) * 100 : 0;
    if (pct > maxPct) { maxPct = pct; mostCrowded = `${d} (${pct.toFixed(1)}%)`; }
    if (pct < minPct) { minPct = pct; safest = `${d} (${pct.toFixed(1)}%)`; }
  });
  const totalVisible = Object.values(grouped).flat().length;

  return (
    <div className="p-6 space-y-5">
      {/* Command Center Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">✦ AI-ICCC TELEMETRY CORE</span>
          <h1 className="gov-header-title">Pushkara Crowd Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time crowd flow monitors, surveillance grids, sector capacities, and operational metrics.</p>
        </div>
      </div>

      {/* Command Controls Bar */}
      <div className="command-controls-bar">
        <div className="control-group">
          <label><Search style={{ width: 13, height: 13 }} /> Search core</label>
          <div className="command-search-wrapper">
            <Search style={{ width: 13, height: 13, position: "absolute", left: 10, color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search ghats, districts, sectors..."
              value={search}
              onChange={e => setSearch(e.target.value.toLowerCase())}
            />
          </div>
        </div>
        <div className="control-group">
          <label><MapPin style={{ width: 13, height: 13 }} /> District</label>
          <select className="command-select" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
            <option value="all">All Districts</option>
            <option value="East Godavari">East Godavari</option>
            <option value="West Godavari">West Godavari</option>
            <option value="Khammam">Khammam</option>
          </select>
        </div>
        <div className="control-group">
          <label><Activity style={{ width: 13, height: 13 }} /> Density status</label>
          <select className="command-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Densities</option>
            <option value="open">Open Zone (&lt;30%)</option>
            <option value="crowded">Crowded (30%–65%)</option>
            <option value="highly-crowded">Highly Crowded (&gt;65%)</option>
          </select>
        </div>
        <div className="control-group">
          <label><Users style={{ width: 13, height: 13 }} /> Sector limit</label>
          <select className="command-select" value={capacityFilter} onChange={e => setCapacityFilter(e.target.value)}>
            <option value="all">All Capacities</option>
            <option value="low">Small (&lt;7,000)</option>
            <option value="mid">Medium (7,000–8,500)</option>
            <option value="high">Large (&gt;8,500)</option>
          </select>
        </div>
        <div className="control-group">
          <label style={{ visibility: "hidden" }}>Reset</label>
          <button className="btn-reset-filters" onClick={resetFilters}>
            <RotateCcw style={{ width: 13, height: 13 }} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Command Stats Panel */}
      <div className="flex gap-4 flex-wrap">
        {[
          { icon: <Layers style={{ width: 18, height: 18 }} />, label: "TOTAL MONITORED SECTORS", value: String(totalVisible), cls: "safe" },
          { icon: <Users style={{ width: 18, height: 18 }} />, label: "TOTAL LIVE CROWD", value: totalLive.toLocaleString(), cls: "busy" },
          { icon: <AlertTriangle style={{ width: 18, height: 18 }} />, label: "MOST CROWDED DISTRICT", value: mostCrowded, cls: "critical" },
          { icon: <Activity style={{ width: 18, height: 18 }} />, label: "SAFEST DISTRICT", value: safest, cls: "safe" },
        ].map(s => (
          <div key={s.label} className="cyber-stat-card" style={{ flex: "1 1 200px" }}>
            <div className={`cyber-stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <span className="cyber-stat-label">{s.label}</span>
              <strong className="cyber-stat-val block">{s.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {totalVisible === 0 && (
        <div className="command-empty-state" style={{ display: "flex" }}>
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-slate-700">No matching sectors detected</h3>
          <p className="text-sm text-slate-400 max-w-md">Your search or filters do not match any active Godavari ghats. Try refining your parameters.</p>
        </div>
      )}

      {/* District Groups */}
      <div className="space-y-6">
        {districts.map(district => (
          <DistrictGroup
            key={district}
            district={district}
            ghats={grouped[district] || []}
            states={states}
            onChange={handleChange}
            onUpload={handleUpload}
            collapsed={!!collapsed[district]}
            onToggle={() => setCollapsed(prev => ({ ...prev, [district]: !prev[district] }))}
            searchQuery={search}
            dbCameras={dbCameras}
          />
        ))}
      </div>
    </div>
  );
}
