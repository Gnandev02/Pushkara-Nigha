"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "@/components/SocketProvider";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Search, 
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
    <div className="dashboard-content font-mono">
      {/* Header */}
      <div className="gov-header-card">
        <div className="gov-header-left">
          <div className="gov-header-title-container">
            <span className="gov-header-subtitle">ICCC SECURITY PROTOCOLS</span>
            <h1 className="gov-header-title flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              Critical Incident Logs
            </h1>
          </div>
        </div>
        <div className="gov-header-right flex items-center gap-3">
          {/* Tab triggers in original styling */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setShowResolved(false)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                !showResolved
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Active ({alerts.length})
            </button>
            <button
              onClick={() => setShowResolved(true)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                showResolved
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Resolved Archive
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="overview-stats-grid">
        <div className="overview-stat-card border-l-4 border-l-red-600">
          <span className="stat-title">Unresolved Alerts</span>
          <span className="stat-number mt-1 block font-mono text-red-500 animate-pulse">
            {alerts.length}
          </span>
          <div className="stat-glow-border"></div>
        </div>
        <div className="overview-stat-card border-l-4 border-l-orange-600">
          <span className="stat-title">Critical Events Today</span>
          <span className="stat-number mt-1 block font-mono text-slate-100">
            {historyAlerts.filter(a => a.severity === "critical").length}
          </span>
          <div className="stat-glow-border"></div>
        </div>
        <div className="overview-stat-card border-l-4 border-l-teal-600">
          <span className="stat-title">System Accuracy Rate</span>
          <span className="stat-number mt-1 block font-mono text-teal-400">
            97.4%
          </span>
          <div className="stat-glow-border"></div>
        </div>
      </div>

      {/* Main filter list */}
      <div className="dashboard-card space-y-6">
        {/* Filters control */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-900 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-slate-500 pl-1" />
          <input
            type="text"
            placeholder="Search incidents by camera ID, category, severity, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-slate-600"
          />
        </div>

        {/* List items */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const isCrit = alert.severity === "critical";
            let borderClass = alert.resolved 
              ? "bg-emerald-500/5 border-emerald-500/10 text-slate-400" 
              : isCrit 
              ? "bg-red-500/5 border-red-500/20" 
              : "bg-orange-500/5 border-orange-500/20";

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border flex items-center justify-between gap-6 transition-all ${borderClass}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {alert.resolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 ${isCrit ? "text-red-500 animate-bounce" : "text-orange-500"}`} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold font-mono border uppercase ${
                        alert.resolved 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : isCrit 
                          ? "bg-red-500/20 border-red-500/30 text-red-500" 
                          : "bg-orange-500/20 border-orange-500/30 text-orange-500"
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        NODE: {alert.cameraId}
                      </span>
                    </div>
                    <p className="text-white text-sm font-semibold tracking-wide mt-2 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 mt-2 font-mono">
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
                    className="px-4 py-2 text-xs font-bold uppercase bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all shrink-0"
                  >
                    Resolve Incident
                  </button>
                )}
              </div>
            );
          })}
          {filteredAlerts.length === 0 && (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <FileCheck className="w-12 h-12 text-slate-800 animate-pulse" />
              <p className="text-slate-400 font-bold mt-4">No Incidents Found</p>
              <p className="text-slate-500 text-xs mt-2">All filtered records have been checked and resolved.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
