"use client";

import { useEffect, useState } from "react";
import { BarChart2, TrendingUp, Users, RefreshCw } from "lucide-react";
import { useSocket } from "@/components/SocketProvider";

export default function AnalyticsPage() {
  const { analytics: socketAnalytics } = useSocket();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(data => { setHistory(data.analytics || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const analyticsValues = Object.values(socketAnalytics || {});
  const latest = analyticsValues[0];
  const totalMale = history.reduce((s, r) => s + r.maleCount, 0);
  const totalFemale = history.reduce((s, r) => s + r.femaleCount, 0);
  const totalPeople = history.reduce((s, r) => s + r.totalPeople, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">AI ANALYTICS ENGINE</span>
          <h1 className="gov-header-title">Crowd Analytics & Demographics</h1>
        </div>
        <button
          onClick={() => { setLoading(true); fetch("/api/analytics").then(r => r.json()).then(d => { setHistory(d.analytics || []); setLoading(false); }).catch(() => setLoading(false)); }}
          className="flex items-center gap-2 text-xs font-semibold text-[#0D9488] hover:underline"
        >
          <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
        </button>
      </div>

      {/* Live telemetry cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Live People", value: latest?.totalPeople ?? 0, icon: Users, color: "#0B6B53" },
          { label: "Unique Persons", value: latest?.uniquePeople ?? 0, icon: BarChart2, color: "#0D9488" },
          { label: "Risk Score", value: `${((latest?.riskScore ?? 0) * 100).toFixed(0)}%`, icon: TrendingUp, color: "#D97706" },
          { label: "Total Sessions", value: history.length, icon: BarChart2, color: "#475569" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="dashboard-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${card.color}14` }}>
                <Icon style={{ width: 18, height: 18, color: card.color }} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-xl font-extrabold text-slate-900 font-mono">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demographics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-card text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Users style={{ width: 24, height: 24, color: "#3B82F6" }} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Male Entries</p>
          <p className="text-3xl font-black text-blue-600 font-mono">{totalMale.toLocaleString()}</p>
        </div>
        <div className="dashboard-card text-center">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mx-auto mb-3">
            <Users style={{ width: 24, height: 24, color: "#EC4899" }} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Female Entries</p>
          <p className="text-3xl font-black text-pink-500 font-mono">{totalFemale.toLocaleString()}</p>
        </div>
        <div className="dashboard-card text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Users style={{ width: 24, height: 24, color: "#64748B" }} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Logged</p>
          <p className="text-3xl font-black text-slate-700 font-mono">{totalPeople.toLocaleString()}</p>
        </div>
      </div>

      {/* History table */}
      <div className="dashboard-card p-0 overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <h3 className="card-heading">Analytics History (from YOLO AI)</h3>
        </div>
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading analytics...</div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No analytics data yet</p>
            <p className="text-xs mt-1">Start app.py to begin streaming AI telemetry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="surveillance-cyber-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Timestamp</th>
                  <th>Total</th>
                  <th>Unique</th>
                  <th>Male</th>
                  <th>Female</th>
                  <th>Unknown</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 40).map((r, i) => (
                  <tr key={r.id}>
                    <td className="font-mono text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-mono text-xs text-slate-500">{new Date(r.createdAt).toLocaleString("en-IN")}</td>
                    <td className="font-bold font-mono">{r.totalPeople}</td>
                    <td className="font-mono">{r.uniquePeople}</td>
                    <td className="text-blue-600 font-semibold">{r.maleCount}</td>
                    <td className="text-pink-600 font-semibold">{r.femaleCount}</td>
                    <td className="text-slate-400">{r.unknownGender}</td>
                    <td>
                      <span className={`table-risk-badge ${r.riskScore > 0.7 ? "critical" : r.riskScore > 0.4 ? "busy" : "safe"}`}>
                        {(r.riskScore * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
