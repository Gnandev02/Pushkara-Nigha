"use client";

import React, { useState } from "react";
import { useSocket } from "@/components/SocketProvider";
import { 
  Settings, 
  Database, 
  Sliders, 
  Cpu, 
  CheckCircle, 
  AlertCircle,
  Key
} from "lucide-react";

export default function SettingsPage() {
  const [densityThreshold, setDensityThreshold] = useState("75");
  const [riskMultiplier, setRiskMultiplier] = useState("0.85");
  const [refreshInterval, setRefreshInterval] = useState("2.5");
  const [alertSound, setAlertSound] = useState(true);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const handleSave = (e) => {
    e.preventDefault();
    setFormStatus({ type: "success", message: "AI pipeline parameters updated successfully!" });
    setTimeout(() => setFormStatus({ type: "", message: "" }), 3000);
  };

  return (
    <div className="dashboard-content font-mono">
      {/* Header */}
      <div className="gov-header-card">
        <div className="gov-header-left">
          <div className="gov-header-title-container">
            <span className="gov-header-subtitle">ICCC NODE CONFIGURATIONS</span>
            <h1 className="gov-header-title flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-400" />
              System Settings & Calibration
            </h1>
          </div>
        </div>
        <div className="gov-header-right">
          <span className="gov-sync-badge">✦ Parameters Secured</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Form Settings */}
        <div className="left-panel-stack">
          <div className="dashboard-card">
            <div className="card-header-row mb-6">
              <div className="card-title-group flex items-center gap-2">
                <div className="card-icon-container" style={{ color: "var(--primary)" }}>
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="card-heading">Pipeline Parameters</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Calibrate active YOLO and flow evaluation thresholds</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs font-mono text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-slate-500 tracking-wider uppercase block mb-1.5 font-bold">
                    Surge Alert Threshold (Pedestrians)
                  </label>
                  <input
                    type="number"
                    value={densityThreshold}
                    onChange={(e) => setDensityThreshold(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Trigger alarm when camera count exceeds this buffer value.</span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 tracking-wider uppercase block mb-1.5 font-bold">
                    Stampede Risk Index Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={riskMultiplier}
                    onChange={(e) => setRiskMultiplier(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Weight given to sudden motion flow vector spikes.</span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 tracking-wider uppercase block mb-1.5 font-bold">
                    Telemetry Sync Frequency (Seconds)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Telemetry interval posted from local GPU app.py.</span>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 tracking-wider uppercase block mb-2 font-bold">
                    Sound Alarms
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={alertSound} 
                      onChange={() => setAlertSound(!alertSound)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-500 after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    <span className="ml-3 text-xs font-semibold text-slate-400">Play alarm tone on critical alerts</span>
                  </label>
                </div>
              </div>

              {formStatus.message && (
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{formStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold tracking-widest uppercase rounded-lg shadow-md transition-all"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Database Specs */}
        <div className="right-sidebar-panel">
          <div className="dashboard-card space-y-6">
            <h3 className="card-heading flex items-center gap-2">
              Database Specs & Node Info
              <Database className="w-4 h-4 text-teal-400" />
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider block">Database Provider</span>
                <span className="text-xs font-bold text-white block mt-1">Neon Serverless PostgreSQL</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider block">Deployment Pooler</span>
                <span className="text-xs font-bold text-emerald-400 block font-mono mt-1">active pooler connection</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono tracking-wider block">ORM Engine</span>
                <span className="text-xs font-bold text-teal-400 block font-mono mt-1">Prisma Client v5.22</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-teal-400" />
                Connection Secrets
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                Environment configurations are loaded safely from <span className="text-slate-300">.env</span> to avoid exposing database secrets in production frontend bundles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
