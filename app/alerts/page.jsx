"use client";

import { useEffect, useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useSocket } from "@/components/SocketProvider";

export default function AlertsPage() {
  const { alerts: socketAlerts } = useSocket();
  const [dbAlerts, setDbAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alerts")
      .then(r => r.json())
      .then(data => { setDbAlerts(data.alerts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allAlerts = [...(socketAlerts || []), ...(dbAlerts || [])];
  const activeCount = allAlerts.filter(a => !a.resolved).length;
  const resolvedCount = allAlerts.filter(a => a.resolved).length;

  const handleResolve = (id) => {
    setDbAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">NEURAL PREDICTION CONSOLE</span>
          <h1 className="gov-header-title">Active AI Incident Vectoring & Recommendations</h1>
        </div>
        <button
          onClick={() => { setLoading(true); fetch("/api/alerts").then(r => r.json()).then(d => { setDbAlerts(d.alerts || []); setLoading(false); }).catch(() => setLoading(false)); }}
          className="flex items-center gap-2 text-xs font-semibold text-[#0D9488] hover:underline"
        >
          <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Alerts", value: allAlerts.length, icon: Bell, color: "#0B6B53" },
          { label: "Active Incidents", value: activeCount, icon: AlertTriangle, color: "#DC2626" },
          { label: "Resolved Today", value: resolvedCount, icon: CheckCircle, color: "#059669" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="dashboard-card flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${card.color}14` }}>
                <Icon style={{ width: 20, height: 20, color: card.color }} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts list */}
      <div className="dashboard-card">
        <h3 className="card-heading mb-4">Incident Log</h3>
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading alerts...</div>
        ) : allAlerts.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
            <CheckCircle style={{ width: 40, height: 40, opacity: 0.3 }} />
            <p className="font-semibold">No active alerts</p>
            <p className="text-xs">All ghat sectors are operating within normal parameters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allAlerts.map((alert) => {
              const isHigh = alert.type === "CRITICAL" || alert.type === "stampede_risk";
              const cls = alert.resolved ? "safe" : isHigh ? "critical" : "busy";
              return (
                <div key={alert.id} className={`alert-queue-item ${cls}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!alert.resolved && <AlertTriangle style={{ width: 14, height: 14, color: isHigh ? "#DC2626" : "#EA580C" }} />}
                        {alert.resolved && <CheckCircle style={{ width: 14, height: 14, color: "#059669" }} />}
                        <span className="text-sm font-bold text-slate-800">{alert.location || "Unknown Location"}</span>
                        <span className={`table-risk-badge ${cls}`}>{alert.type}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{alert.message}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-mono">
                        <Clock style={{ width: 10, height: 10 }} />
                        {new Date(alert.timestamp).toLocaleString("en-IN")}
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all hover:shadow-md"
                        style={{ background: "#0B6B53" }}
                      >
                        Resolve
                      </button>
                    )}
                    {alert.resolved && (
                      <span className="flex-shrink-0 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">RESOLVED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
