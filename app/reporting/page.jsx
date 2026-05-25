"use client";

import { useState, useEffect } from "react";
import { FileText, Download, RefreshCw, BarChart2, Clock, CheckCircle } from "lucide-react";

interface AnalyticsRecord {
  id: string;
  totalPeople: number;
  uniquePeople: number;
  maleCount: number;
  femaleCount: number;
  unknownGender: number;
  riskScore: number;
  density: number;
  createdAt: string;
}

export default function ReportingPage() {
  const [records, setRecords] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(data => { setRecords(data.analytics || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalEntries = records.reduce((s, r) => s + r.totalPeople, 0);
  const avgRisk = records.length ? (records.reduce((s, r) => s + r.riskScore, 0) / records.length * 100).toFixed(1) : "0.0";

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">ICCC REPORTING MODULE</span>
          <h1 className="gov-header-title">Crowd Monitoring Command Reports</h1>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Records", value: records.length, icon: FileText, color: "#0B6B53" },
          { label: "Total People Logged", value: totalEntries.toLocaleString(), icon: BarChart2, color: "#0D9488" },
          { label: "Avg Risk Score", value: `${avgRisk}%`, icon: CheckCircle, color: "#D97706" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="dashboard-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${card.color}14` }}>
                <Icon style={{ width: 22, height: 22, color: card.color }} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{card.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Download section */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-heading">Download Official Reports</h3>
          <button
            onClick={() => { setLoading(true); fetch("/api/analytics").then(r => r.json()).then(d => { setRecords(d.analytics || []); setLoading(false); }).catch(() => setLoading(false)); }}
            className="flex items-center gap-2 text-xs font-semibold text-[#0D9488] hover:underline"
          >
            <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Incident Logs", desc: "AI-detected anomalies and manual incident reports", ext: "CSV" },
            { label: "Devotee Flow Statistics", desc: "Ghat-wise entry/exit flow telemetry data", ext: "XLSX" },
            { label: "ICCC Daily Summary", desc: "End-of-shift compiled monitoring summary", ext: "PDF" },
          ].map(doc => (
            <div key={doc.label} className="rounded-lg border border-slate-200 p-4 hover:border-[#0D9488]/40 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <FileText style={{ width: 20, height: 20, color: "#0B6B53" }} />
                <span className="text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded" style={{ background: "rgba(11,107,83,0.1)", color: "#0B6B53" }}>
                  {doc.ext}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">{doc.label}</p>
              <p className="text-[11px] text-slate-400 mb-3">{doc.desc}</p>
              <button className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488] group-hover:gap-2 transition-all">
                <Download style={{ width: 12, height: 12 }} /> Download
              </button>
            </div>
          ))}
        </div>

        {/* Generate button */}
        <div className="mt-4 flex justify-center">
          <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-md hover:shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #0B6B53, #0D9488)" }}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Generate Pre-Shift Summary
          </button>
        </div>
      </div>

      {/* Analytics Records Table */}
      <div className="dashboard-card p-0 overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <h3 className="card-heading">Live Analytics Records (from YOLO AI)</h3>
        </div>
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
            <Clock style={{ width: 40, height: 40, opacity: 0.3 }} />
            <p className="font-semibold">No reports compiled yet</p>
            <p className="text-xs max-w-sm text-center">Telemetry reports are compiled automatically at the end of each daily smart city monitoring shift.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="surveillance-cyber-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Timestamp</th>
                  <th>Total People</th>
                  <th>Unique ID</th>
                  <th>Men</th>
                  <th>Women</th>
                  <th>Unknown</th>
                  <th>Density</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 50).map((r, i) => (
                  <tr key={r.id}>
                    <td className="text-slate-400 font-mono text-xs">{i + 1}</td>
                    <td className="font-mono text-xs text-slate-500">{new Date(r.createdAt).toLocaleString("en-IN")}</td>
                    <td className="font-bold font-mono">{r.totalPeople}</td>
                    <td className="font-mono">{r.uniquePeople}</td>
                    <td className="text-blue-600 font-semibold">{r.maleCount}</td>
                    <td className="text-pink-600 font-semibold">{r.femaleCount}</td>
                    <td className="text-slate-500">{r.unknownGender}</td>
                    <td className="font-mono">{(r.density * 100).toFixed(1)}%</td>
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
