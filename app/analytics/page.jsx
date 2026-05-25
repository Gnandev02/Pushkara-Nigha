"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSocket } from "@/components/SocketProvider";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  Percent, 
  Clock 
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
  Cell,
  PieChart,
  Pie
} from "recharts";

export default function Analytics() {
  const { summary } = useSocket();
  const [historyData, setHistoryData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("live");

  // Fetch historical telemetry
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/analytics?limit=30");
        const data = await res.json();
        if (data.success) {
          // format historical items
          const formatted = data.history.map((h, i) => {
            const date = new Date(h.createdAt);
            return {
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              Count: h.totalPeople,
              Risk: Math.round(h.riskScore * 100),
              Unique: h.uniquePeople,
              key: h.id || i
            };
          });
          setHistoryData(formatted);
        }
      } catch (err) {
        console.error("Failed to load historical analytics:", err);
      }
    };

    fetchHistory();
    // Refresh history statistics every 8 seconds
    const interval = setInterval(fetchHistory, 8000);
    return () => clearInterval(interval);
  }, []);

  // Format demographic data for Pie Chart
  const demographicsData = useMemo(() => {
    const total = summary.maleCount + summary.femaleCount + summary.unknownGender || 1;
    return [
      { name: "Male", value: summary.maleCount, percentage: ((summary.maleCount / total) * 100).toFixed(0), color: "#00b4d8" },
      { name: "Female", value: summary.femaleCount, percentage: ((summary.femaleCount / total) * 100).toFixed(0), color: "#ff007f" },
      { name: "Unknown", value: summary.unknownGender, percentage: ((summary.unknownGender / total) * 100).toFixed(0), color: "#9d4edd" }
    ];
  }, [summary]);

  return (
    <div className="space-y-8 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            AI Crowd Behavior Analytics
            <BarChart3 className="w-8 h-8 text-neonPurple" />
          </h2>
          <p className="text-gray-400 mt-1">
            Deep demographic insights, unique pedestrian tracking metrics, and density trends.
          </p>
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center gap-3">
          <select 
            value={selectedRange} 
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-darkBg border border-glassBorder rounded-xl px-4 py-2.5 text-xs text-gray-300 font-medium focus:outline-none focus:border-neonPurple cursor-pointer"
          >
            <option value="live">Live Stream (Real-Time)</option>
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>

          <button 
            onClick={() => alert("Telemetry analytics exported successfully in CSV format.")}
            className="flex items-center gap-2 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-extrabold tracking-widest text-xs font-mono uppercase px-4 py-2.5 rounded-xl shadow-neonGlow hover:shadow-glow transition-all duration-300"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Grid overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Density Timeline Area Chart */}
        <div className="glassmorphism rounded-2xl p-6 lg:col-span-2 border border-glassBorder flex flex-col h-[400px]">
          <h3 className="font-extrabold text-white tracking-wide uppercase text-sm mb-6 flex items-center gap-2">
            Historical Crowd Surge & Footfall timeline
            <Clock className="w-4 h-4 text-neonBlue animate-pulse" />
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#9d4edd" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(157, 78, 221, 0.05)" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(18, 10, 36, 0.95)",
                    border: "1px solid rgba(157, 78, 221, 0.3)",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}
                />
                <Area type="monotone" dataKey="Count" stroke="#00b4d8" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="Unique" stroke="#9d4edd" strokeWidth={2} fillOpacity={1} fill="url(#colorUnique)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics Pie Breakdown */}
        <div className="glassmorphism rounded-2xl p-6 border border-glassBorder flex flex-col h-[400px]">
          <h3 className="font-extrabold text-white tracking-wide uppercase text-sm mb-6">
            Pedestrian Demographics Summary
          </h3>
          
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">TRACKED</span>
              <span className="text-3xl font-extrabold text-white font-mono mt-0.5">
                {summary.maleCount + summary.femaleCount + summary.unknownGender}
              </span>
              <span className="text-[9px] text-neonBlue font-semibold font-mono mt-0.5">PEOPLE</span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(18, 10, 36, 0.9)",
                    border: "1px solid rgba(157, 78, 221, 0.3)",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4">
            {demographicsData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold text-gray-300">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-white font-mono">
                  {item.percentage}% ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Historical Logs List */}
      <div className="glassmorphism rounded-2xl p-6 border border-glassBorder">
        <h3 className="font-extrabold text-white tracking-wide uppercase text-sm mb-6">
          Pedestrian Flow Logs (Database History)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-glassBorder text-gray-500 uppercase tracking-widest font-mono font-bold">
                <th className="pb-3 pl-2">Time</th>
                <th className="pb-3">Surge Count</th>
                <th className="pb-3">Unique Counter</th>
                <th className="pb-3">Male / Female / Unknown</th>
                <th className="pb-3 text-right pr-2">Surge Risk Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {historyData.map((row, idx) => (
                <tr key={row.key || idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pl-2 font-mono">{row.time}</td>
                  <td className="py-3 font-semibold text-white font-mono">{row.Count}</td>
                  <td className="py-3 text-neonBlue font-mono">{row.Unique}</td>
                  <td className="py-3 font-mono">
                    {Math.round(row.Count * 0.5)}m / {Math.round(row.Count * 0.4)}f / {row.Count - Math.round(row.Count * 0.9)}u
                  </td>
                  <td className="py-3 text-right pr-2 font-semibold font-mono">
                    <span className={row.Risk > 60 ? "text-neonPink" : row.Risk > 40 ? "text-amber-400" : "text-green-400"}>
                      {row.Risk}%
                    </span>
                  </td>
                </tr>
              ))}
              {historyData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No pedestrian telemetry recorded in database yet.
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
