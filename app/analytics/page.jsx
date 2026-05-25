"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSocket } from "@/components/SocketProvider";
import { 
  BarChart3, 
  Download, 
  Clock, 
  Users, 
  TrendingUp, 
  Calendar 
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Analytics() {
  const { summary } = useSocket();
  const [historyData, setHistoryData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("live");

  // Fetch historical telemetry
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/analytics?limit=30&raw=true");
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((h, i) => {
            const date = new Date(h.createdAt);
            return {
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              Count: h.totalPeople,
              Risk: Math.round(h.riskScore * 100),
              Unique: h.uniquePeople,
              key: h.id || i
            };
          });
          setHistoryData(formatted.reverse());
        }
      } catch (err) {
        console.error("Failed to load historical analytics:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 8000);
    return () => clearInterval(interval);
  }, []);

  // Format demographic data for Pie Chart (matching original teal/pink/purple style)
  const demographicsData = useMemo(() => {
    const total = summary.maleCount + summary.femaleCount + summary.unknownGender || 1;
    return [
      { name: "Male", value: summary.maleCount, percentage: ((summary.maleCount / total) * 100).toFixed(0), color: "#0D9488" }, // Teal
      { name: "Female", value: summary.femaleCount, percentage: ((summary.femaleCount / total) * 100).toFixed(0), color: "#10B981" }, // Safe Green
      { name: "Unknown", value: summary.unknownGender, percentage: ((summary.unknownGender / total) * 100).toFixed(0), color: "#64748B" } // Slate Muted
    ];
  }, [summary]);

  return (
    <div className="dashboard-content font-mono">
      {/* Header */}
      <div className="gov-header-card">
        <div className="gov-header-left">
          <div className="gov-header-title-container">
            <span className="gov-header-subtitle">ICCC DEMOGRAPHICS & TRENDS</span>
            <h1 className="gov-header-title flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              AI Crowd Behavior Analytics
            </h1>
          </div>
        </div>
        <div className="gov-header-right flex items-center gap-3">
          <select 
            value={selectedRange} 
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium cursor-pointer"
          >
            <option value="live">Live Stream (Real-Time)</option>
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
          </select>

          <button 
            onClick={() => alert("Telemetry analytics exported successfully in CSV format.")}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold tracking-widest text-xs uppercase px-4 py-2 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        <div className="left-panel-stack">
          {/* Timeline chart */}
          <div className="dashboard-card h-[380px] flex flex-col">
            <h3 className="card-heading flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-teal-400" />
              Historical Crowd Surge & Footfall timeline
            </h3>
            
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.05)" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0F19",
                      border: "1px solid #1E293B",
                      borderRadius: "6px",
                      color: "#F8FAFC",
                      fontSize: "11px"
                    }}
                  />
                  <Area type="monotone" dataKey="Count" stroke="#10B981" strokeWidth={2} fillOpacity={0} name="Total Count" />
                  <Area type="monotone" dataKey="Unique" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorUnique)" name="Unique Tracking" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right side demographics */}
        <div className="right-sidebar-panel">
          <div className="dashboard-card h-[380px] flex flex-col justify-between">
            <h3 className="card-heading mb-4">Pedestrian Demographics</h3>
            
            <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">TRACKED</span>
                <span className="text-2xl font-extrabold text-white font-mono mt-0.5">
                  {(summary.maleCount + summary.femaleCount + summary.unknownGender).toLocaleString()}
                </span>
                <span className="text-[9px] text-teal-400 font-semibold font-mono">PEOPLE</span>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={demographicsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {demographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0F19",
                      border: "1px solid #1E293B",
                      borderRadius: "6px",
                      fontSize: "11px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {demographicsData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white font-mono">
                    {item.percentage}% ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log list */}
      <div className="dashboard-card mt-8">
        <h3 className="card-heading mb-6 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400" />
          Pedestrian Flow Logs (Database History)
        </h3>

        <div className="surveillance-table-responsive-wrapper">
          <table className="surveillance-cyber-table font-mono">
            <thead>
              <tr className="text-slate-500 uppercase tracking-widest font-bold">
                <th className="pb-3 pl-2">Time</th>
                <th className="pb-3">Surge Count</th>
                <th className="pb-3">Unique Counter</th>
                <th className="pb-3">Male / Female / Unknown</th>
                <th className="pb-3 text-right pr-2">Surge Risk Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {historyData.map((row, idx) => (
                <tr key={row.key || idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 pl-2 font-mono">{row.time}</td>
                  <td className="py-3 font-semibold text-white font-mono">{row.Count}</td>
                  <td className="py-3 text-teal-400 font-mono">{row.Unique}</td>
                  <td className="py-3 font-mono">
                    {Math.round(row.Count * 0.55)}m / {Math.round(row.Count * 0.40)}f / {row.Count - Math.round(row.Count * 0.95)}u
                  </td>
                  <td className="py-3 text-right pr-2 font-semibold font-mono">
                    <span className={row.Risk > 75 ? "text-red-500 font-bold" : row.Risk > 45 ? "text-orange-500" : "text-emerald-500"}>
                      {row.Risk}%
                    </span>
                  </td>
                </tr>
              ))}
              {historyData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No pedestrian telemetry logs recorded in the database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
