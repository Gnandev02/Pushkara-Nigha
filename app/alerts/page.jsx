"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "@/components/SocketProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Search, 
  SlidersHorizontal,
  BellRing,
  CheckCircle,
  FileCheck
} from "lucide-react";

export default function AlertsPage() {
  const { alerts, resolveAlert } = useSocket();
  const [historyAlerts, setHistoryAlerts] = useState([]);
  const [showResolved, setShowResolved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load resolved alerts from database for archive view
  const fetchAlertHistory = async () => {
    try {
      const res = await fetch(`/api/alerts?resolved=${showResolved}`);
      const data = await res.json();
      if (data.success) {
        setHistoryAlerts(data.alerts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlertHistory();
  }, [showResolved, alerts]); // reload when state tab toggles or new socket alerts trigger

  // Filter alerts by search queries
  const filteredAlerts = historyAlerts.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      a.message.toLowerCase().includes(term) ||
      a.cameraId.toLowerCase().includes(term) ||
      a.severity.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Critical Incident Logs
            <AlertTriangle className="w-8 h-8 text-neonPink animate-pulse" />
          </h2>
          <p className="text-gray-400 mt-1">
            Review active AI-triggered threshold violations, crowd surges, and hardware warnings.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-1.5 rounded-xl">
          <button
            onClick={() => setShowResolved(false)}
            className={`px-4 py-2 text-xs font-extrabold tracking-widest font-mono uppercase rounded-lg transition-all duration-300 ${
              !showResolved
                ? "bg-neonPink/25 text-neonPink border border-neonPink/40 shadow-neonGlow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active ({alerts.length})
          </button>
          <button
            onClick={() => setShowResolved(true)}
            className={`px-4 py-2 text-xs font-extrabold tracking-widest font-mono uppercase rounded-lg transition-all duration-300 ${
              showResolved
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Resolved Archive
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphism p-5 rounded-2xl border border-glassBorder">
          <span className="text-[10px] text-gray-500 font-mono tracking-wider block">UNRESOLVED ALERTS</span>
          <span className="text-3xl font-extrabold mt-1 block font-mono text-neonPink animate-pulse">
            {alerts.length}
          </span>
        </div>
        <div className="glassmorphism p-5 rounded-2xl border border-glassBorder">
          <span className="text-[10px] text-gray-500 font-mono tracking-wider block">CRITICAL EVENTS TODAY</span>
          <span className="text-3xl font-extrabold mt-1 block font-mono text-white">
            {historyAlerts.filter(a => a.severity === "critical").length}
          </span>
        </div>
        <div className="glassmorphism p-5 rounded-2xl border border-glassBorder">
          <span className="text-[10px] text-gray-500 font-mono tracking-wider block">SYSTEM ACCURACY RATE</span>
          <span className="text-3xl font-extrabold mt-1 block font-mono text-neonBlue">
            99.2%
          </span>
        </div>
      </div>

      {/* Main filter list */}
      <div className="glassmorphism rounded-2xl p-6 border border-glassBorder space-y-6">
        {/* Filters control */}
        <div className="flex items-center gap-4 bg-darkBg/50 border border-glassBorder p-3 rounded-xl">
          <Search className="w-4 h-4 text-gray-500 pl-1" />
          <input
            type="text"
            placeholder="Search incidents by camera, category, severity, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-gray-500"
          />
        </div>

        {/* List items */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => {
              const isCrit = alert.severity === "critical";
              
              return (
                <motion.div
                  layout
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-5 rounded-xl border flex items-center justify-between gap-6 transition-all duration-300 ${
                    alert.resolved
                      ? "bg-green-500/5 border-green-500/10 text-gray-400"
                      : isCrit
                      ? "bg-neonPink/10 border-neonPink/25 shadow-neonGlow/10"
                      : "bg-amber-500/10 border-amber-500/25"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {alert.resolved ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className={`w-5 h-5 ${isCrit ? "text-neonPink animate-bounce" : "text-amber-400"}`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-[6px] text-[9px] font-extrabold font-mono border uppercase ${
                          alert.resolved 
                            ? "bg-green-500/10 border-green-500/20 text-green-400" 
                            : isCrit 
                            ? "bg-neonPink/20 border-neonPink/30 text-neonPink" 
                            : "bg-amber-500/20 border-amber-500/30 text-amber-400"
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          NODE: {alert.cameraId}
                        </span>
                      </div>
                      <p className="text-white text-sm font-semibold tracking-wide mt-2 leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-2 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-4 py-2 text-xs font-extrabold tracking-widest font-mono uppercase bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl transition-colors shrink-0"
                    >
                      Resolve Incident
                    </button>
                  )}
                </motion.div>
              );
            })}
            {filteredAlerts.length === 0 && (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <FileCheck className="w-12 h-12 text-gray-700 animate-pulse" />
                <p className="text-gray-400 font-bold mt-4">No Incidents Found</p>
                <p className="text-gray-500 text-xs mt-2">All filtered records have been checked and resolved.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
