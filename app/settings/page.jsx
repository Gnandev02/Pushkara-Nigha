"use client";

import React, { useState } from "react";
import { useSocket } from "@/components/SocketProvider";
import { 
  Settings, 
  Database, 
  Sliders, 
  Cpu, 
  HelpCircle, 
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
    <div className="space-y-8 flex-1">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          AI Parameter Settings
          <Settings className="w-8 h-8 text-neonPurple" />
        </h2>
        <p className="text-gray-400 mt-1">
          Adjust YOLO thresholds, active stampede warnings, database parameters, and live telemetry sync.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* left column: settings Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glassmorphism rounded-2xl p-6 border border-glassBorder">
            <h3 className="font-extrabold text-white tracking-wide uppercase text-sm mb-6 flex items-center gap-2">
              Pipeline Parameters
              <Sliders className="w-4 h-4 text-neonBlue" />
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-1.5">
                    Surge Alert Threshold (Pedestrians)
                  </label>
                  <input
                    type="number"
                    value={densityThreshold}
                    onChange={(e) => setDensityThreshold(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-darkBg border border-glassBorder text-white text-sm focus:outline-none focus:border-neonPurple font-mono"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Trigger alarm when camera count exceeds this buffer value.</span>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-1.5">
                    Stampede Risk Index Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={riskMultiplier}
                    onChange={(e) => setRiskMultiplier(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-darkBg border border-glassBorder text-white text-sm focus:outline-none focus:border-neonPurple font-mono"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Weight given to sudden motion flow vector spikes.</span>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-1.5">
                    Telemetry Refresh Frequency (Seconds)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-darkBg border border-glassBorder text-white text-sm focus:outline-none focus:border-neonPurple font-mono"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Telemetry interval posted from local GPU app.py.</span>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block mb-2">
                    Sound Alarms
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={alertSound} 
                      onChange={() => setAlertSound(!alertSound)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neonPurple"></div>
                    <span className="ml-3 text-xs font-semibold text-gray-300">Play tone on critical incident alert triggers</span>
                  </label>
                </div>
              </div>

              {formStatus.message && (
                <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{formStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-extrabold tracking-widest text-xs font-mono uppercase rounded-xl shadow-neonGlow hover:shadow-glow transition-all duration-300"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>

        {/* Right column: DB Credentials details card */}
        <div>
          <div className="glassmorphism rounded-2xl p-6 border border-glassBorder space-y-6">
            <h3 className="font-extrabold text-white tracking-wide uppercase text-sm flex items-center gap-2">
              Database Information
              <Database className="w-4 h-4 text-neonBlue" />
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">Database Provider</span>
                <span className="text-xs font-bold text-white block">Neon Serverless PostgreSQL</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">Deployment Serverless</span>
                <span className="text-xs font-bold text-green-400 block font-mono">active pooler connection</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">ORM Engine</span>
                <span className="text-xs font-bold text-neonPurple block font-mono">Prisma Engine v5.9</span>
              </div>
            </div>

            <div className="pt-4 border-t border-glassBorder">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-neonPurple" />
                Connection Secrets
              </h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                Environment configurations are loaded safely from <span className="text-gray-300">.env</span> to avoid exposing database secrets in production frontend bundles.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
