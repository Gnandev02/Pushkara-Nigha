"use client";

import React, { useMemo } from "react";
import { useSocket } from "@/components/SocketProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Fingerprint, 
  Activity, 
  Video, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp,
  MapPin,
  TrendingDown
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function Dashboard() {
  const { analytics, alerts, summary, resolveAlert } = useSocket();

  // Convert analytics map into list for list-based widgets
  const activeFeeds = useMemo(() => {
    return Object.values(analytics);
  }, [analytics]);

  // Compute trend metrics (simulating active flow comparison)
  const isCrowdSurging = summary.averageRisk > 0.4;

  // Real-time chart data from the active feeds
  const chartData = useMemo(() => {
    if (activeFeeds.length === 0) {
      return [
        { name: "Camera 1", Count: 0, Risk: 0 },
        { name: "Camera 2", Count: 0, Risk: 0 },
      ];
    }
    return activeFeeds.map(feed => ({
      name: feed.name || `Camera ${feed.cameraId.replace('ghat_', '')}`,
      Count: feed.totalPeople || 0,
      Risk: Math.round((feed.riskScore || 0) * 100)
    }));
  }, [activeFeeds]);

  // Gender demographics data
  const genderData = useMemo(() => {
    return [
      { name: "Male", count: summary.maleCount, color: "#00b4d8" },
      { name: "Female", count: summary.femaleCount, color: "#ff007f" },
      { name: "Unknown", count: summary.unknownGender, color: "#9d4edd" }
    ];
  }, [summary]);

  return (
    <div className="space-y-8 flex-1">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Pushkara Nigha AI Crowd Command Center
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonPurple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-neonPurple"></span>
            </span>
          </h2>
          <p className="text-gray-400 mt-1">
            GPU-efficient crowd analytics feed & Godavari Pushkaralu monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl glassmorphism border border-glassBorder text-right">
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">System Load</p>
            <p className="text-sm font-bold text-neonBlue font-mono">0.02ms Latency</p>
          </div>
          <div className="px-4 py-2 rounded-xl glassmorphism border border-glassBorder text-right">
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Database Status</p>
            <p className="text-sm font-bold text-green-400 font-mono">NEON CONNECTED</p>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Crowd Counter */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glassmorphism rounded-2xl p-6 relative overflow-hidden group border-l-4 border-l-neonBlue"
        >
          <div className="absolute right-4 top-4 text-neonBlue/15 group-hover:scale-110 transition-transform duration-300">
            <Users className="w-16 h-16" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-gray-400">Total Live Crowd</p>
          <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight font-mono">
            {summary.totalPeople}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-green-400 font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>AI Real-time Frame Count</span>
          </div>
        </motion.div>

        {/* Unique Tracking Counter */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glassmorphism rounded-2xl p-6 relative overflow-hidden group border-l-4 border-l-neonPurple"
        >
          <div className="absolute right-4 top-4 text-neonPurple/15 group-hover:scale-110 transition-transform duration-300">
            <Fingerprint className="w-16 h-16" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-gray-400">Unique Persons (Session)</p>
          <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight font-mono">
            {summary.uniquePeople}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-neonPurple font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>ByteTrack Unique ID Cache</span>
          </div>
        </motion.div>

        {/* Average Risk Index */}
        <motion.div 
          whileHover={{ y: -5 }}
          className={`glassmorphism rounded-2xl p-6 relative overflow-hidden group border-l-4 transition-colors duration-300 ${
            isCrowdSurging ? "border-l-neonPink" : "border-l-neonPurple"
          }`}
        >
          <div className="absolute right-4 top-4 text-neonPink/15 group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-16 h-16" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-gray-400">Stampede Risk Score</p>
          <h3 className={`text-4xl font-extrabold mt-2 tracking-tight font-mono ${
            isCrowdSurging ? "text-neonPink" : "text-white"
          }`}>
            {(summary.averageRisk * 100).toFixed(0)}%
          </h3>
          <div className={`flex items-center gap-1.5 mt-3 text-xs font-medium ${
            isCrowdSurging ? "text-neonPink" : "text-gray-400"
          }`}>
            {isCrowdSurging ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isCrowdSurging ? "Surging Flow Vectors" : "Normal Crowd Flow State"}</span>
          </div>
        </motion.div>

        {/* Active Grid Cameras */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glassmorphism rounded-2xl p-6 relative overflow-hidden group border-l-4 border-l-neonBlue"
        >
          <div className="absolute right-4 top-4 text-neonBlue/15 group-hover:scale-110 transition-transform duration-300">
            <Video className="w-16 h-16" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-gray-400">Connected Cameras</p>
          <h3 className="text-4xl font-extrabold text-white mt-2 tracking-tight font-mono">
            {activeFeeds.length}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-neonBlue font-medium">
            <Video className="w-4 h-4" />
            <span>Active WebSockets</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Main Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend Area Chart (Recharts) */}
        <div className="glassmorphism rounded-2xl p-6 lg:col-span-2 border border-glassBorder flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-extrabold text-white tracking-wide uppercase text-sm">
              Live Camera Crowd Density & Stampede Risk
            </h4>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-neonBlue">
                <span className="w-2.5 h-2.5 bg-neonBlue rounded-full shadow-blueGlow"></span>
                Head Count
              </span>
              <span className="flex items-center gap-1.5 text-neonPurple">
                <span className="w-2.5 h-2.5 bg-neonPurple rounded-full shadow-neonGlow"></span>
                Stampede Risk Index (%)
              </span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#9d4edd" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 78, 221, 0.05)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(18, 10, 36, 0.9)", 
                    border: "1px solid rgba(157, 78, 221, 0.3)",
                    borderRadius: "12px",
                    color: "#f1f1f1",
                    fontSize: "12px"
                  }} 
                />
                <Area type="monotone" dataKey="Count" stroke="#00b4d8" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                <Area type="monotone" dataKey="Risk" stroke="#9d4edd" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender breakdown bar charts */}
        <div className="glassmorphism rounded-2xl p-6 border border-glassBorder flex flex-col h-[400px]">
          <h4 className="font-extrabold text-white tracking-wide uppercase text-sm mb-6">
            Demographic Gender Analytics
          </h4>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 78, 221, 0.05)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(18, 10, 36, 0.9)",
                    border: "1px solid rgba(157, 78, 221, 0.3)",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {genderData.map((item) => (
              <div key={item.name} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="text-[10px] text-gray-400 font-mono tracking-wider block">{item.name}</span>
                <span className="text-base font-extrabold mt-1 block font-mono" style={{ color: item.color }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Live Cameras & Incident Alerts Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Active Feeds Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-white tracking-wide uppercase text-sm">
              Live Camera Feeds Grid ({activeFeeds.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {activeFeeds.map((feed) => {
                const isRisk = feed.riskScore > 0.65;
                const isWarning = feed.riskScore > 0.4 && feed.riskScore <= 0.65;
                
                return (
                  <motion.div
                    layout
                    key={feed.cameraId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className="glassmorphism rounded-2xl border border-glassBorder overflow-hidden group shadow-lg flex flex-col"
                  >
                    {/* Simulated Camera Video Stream placeholder */}
                    <div className="h-44 bg-darkBg relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-darkBg to-transparent z-10" />
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full relative flex ${
                          isRisk ? "bg-neonPink" : isWarning ? "bg-amber-400" : "bg-green-400"
                        }`}>
                          <span className={`radar-pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isRisk ? "bg-neonPink" : isWarning ? "bg-amber-400" : "bg-green-400"
                          }`} />
                        </span>
                        <span className="text-[11px] font-extrabold font-mono tracking-widest text-white drop-shadow bg-darkBg/60 px-2.5 py-0.5 rounded">
                          {feed.name || feed.cameraId.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Live Indicators on Simulated Screen */}
                      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-darkBg/75 backdrop-blur px-3 py-1.5 rounded-lg border border-glassBorder">
                        <Users className="w-3.5 h-3.5 text-neonBlue" />
                        <span className="text-xs font-bold text-neonBlue font-mono">{feed.totalPeople} Inside</span>
                      </div>

                      {/* Cool Cyberpunk AI Box overlay simulation */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-30 group-hover:opacity-75 transition-opacity duration-300 font-mono text-[9px] text-neonPurple">
                        <div className="flex justify-between">
                          <span>[AI DETECT: ON]</span>
                          <span>[YOLOv8 INTENSE]</span>
                        </div>
                        <div className="border border-dashed border-neonPurple/40 h-20 w-36 self-center rounded flex items-center justify-center">
                          <span className="animate-pulse">TRACK ID_{feed.cameraId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RISK: {(feed.riskScore * 100).toFixed(0)}%</span>
                          <span>FPS: 28.4</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Panel */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{feed.location}</span>
                        </div>
                      </div>
                      <div className="pt-4 mt-2 border-t border-glassBorder grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Density Index</span>
                          <p className="text-sm font-extrabold text-white font-mono mt-0.5">{(feed.density * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Unique Tracking</span>
                          <p className="text-sm font-extrabold text-neonPurple font-mono mt-0.5">{feed.uniquePeople}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {activeFeeds.length === 0 && (
                <div className="col-span-2 glassmorphism rounded-2xl p-12 text-center border border-dashed border-glassBorder/40">
                  <Video className="w-12 h-12 text-gray-600 mx-auto animate-pulse" />
                  <p className="text-gray-400 mt-4 font-semibold">No Active Camera Feed Inputs Registered</p>
                  <p className="text-gray-500 text-xs mt-2">Startup python app.py or add camera sources to pipeline.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Alerts Panel column */}
        <div className="space-y-6 flex flex-col">
          <h4 className="font-extrabold text-white tracking-wide uppercase text-sm flex items-center justify-between">
            Active System Incidents
            {alerts.length > 0 && (
              <span className="px-2.5 py-0.5 text-[9px] font-extrabold bg-neonPink/20 text-neonPink border border-neonPink/30 rounded animate-pulse">
                {alerts.length} ALERTS
              </span>
            )}
          </h4>

          <div className="glassmorphism rounded-2xl p-5 border border-glassBorder flex-1 overflow-y-auto max-h-[500px] space-y-4">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert) => (
                <motion.div
                  layout
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    alert.severity === "critical"
                      ? "bg-neonPink/10 border-neonPink/30"
                      : "bg-amber-500/10 border-amber-500/30"
                  }`}
                >
                  <div className="flex gap-3">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                      alert.severity === "critical" ? "text-neonPink" : "text-amber-400"
                    }`} />
                    <div>
                      <p className="text-xs font-semibold text-white tracking-wide leading-relaxed">
                        {alert.message}
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono mt-1.5 block">
                        Source ID: {alert.cameraId} • {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="self-end px-3 py-1.5 text-[10px] font-extrabold tracking-widest font-mono uppercase bg-white/5 hover:bg-white/10 hover:text-white text-gray-400 border border-white/10 rounded-lg transition-colors"
                  >
                    RESOLVE EVENT
                  </button>
                </motion.div>
              ))}
              {alerts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <ShieldCheck className="w-10 h-10 text-green-500/30" />
                  <p className="text-sm font-semibold text-green-400/80 mt-4">All Systems Secured</p>
                  <p className="text-xs text-gray-500 mt-2">Zero critical risk vectors detected at any ghat grid.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
