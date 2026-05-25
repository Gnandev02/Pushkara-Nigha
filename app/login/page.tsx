"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "supervisor">("admin");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your credentials to continue.");
      return;
    }
    setLoading(true);
    // Simulate auth check (replace with real API call if needed)
    await new Promise(r => setTimeout(r, 900));
    localStorage.setItem("pushkara_is_auth", "true");
    localStorage.setItem("pushkara_user_role", role);
    localStorage.setItem("pushkara_user_email", email);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.14)] flex flex-col lg:flex-row min-h-[620px] border border-slate-200/60 relative z-10"
      >
        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#071827] flex-col justify-between p-10 overflow-hidden select-none">
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px]" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#071827] via-[#0B2A3E] to-[#071827]/90" />

          {/* Top brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#0B6B53] flex items-center justify-center font-bold text-xs text-white shadow-md border border-white/10">
              PN
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xs font-bold tracking-tight">ICCC Security Network</span>
              <span className="text-[9px] text-[#2DD4BF] font-bold uppercase tracking-wider">Node Godavari-West</span>
            </div>
          </div>

          {/* Center headline */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#0D9488]/10 border border-[#0D9488]/25 text-[#2DD4BF] rounded text-[9px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 bg-[#2DD4BF] rounded-full animate-pulse" />
              Active Command Center
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight mb-2">
              Pushkara Nigha<br />
              <span className="text-[#2DD4BF] font-bold text-lg">— AI Crowd Command</span>
            </h2>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium max-w-xs">
              Real-time intelligent telemetry, devotee capacity threshold vectors, and rapid response routing for Godavari Pushkaralu corridors.
            </p>
          </div>

          {/* Analytics cards */}
          <div className="relative z-10 flex flex-col gap-2.5">
            {[
              { icon: "🏛️", label: "Active Bathing Ghats", value: "12 District Sectors Monitored", color: "text-blue-400" },
              { icon: "👥", label: "Live Devotee Crowd", value: "24,340 Flow Calibrated", color: "text-emerald-400" },
              { icon: "📹", label: "Active AI Video Feeds", value: "112 streaming smart feeds", color: "text-purple-400" },
              { icon: "⚠️", label: "Neural Alerts Cataloged", value: "2 Critical anomalies active", color: "text-amber-400" },
              { icon: "🔒", label: "ICCC Secure Node Status", value: "Secured • 38ms latency", color: "text-emerald-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-lg hover:border-[#0D9488]/25 hover:bg-slate-900/55 transition-all duration-200">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span>
                  <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="relative z-10 text-[9px] text-slate-400 border-t border-white/10 pt-4 flex justify-between font-semibold">
            <span>Integrated Operations Center</span>
            <span>AP-ICCC NODE 04</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">
          {/* AP seal watermark */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.018] select-none">
            <div className="w-72 h-72 rounded-full border-[40px] border-[#0B6B53]" />
          </div>

          <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col h-full justify-between">
            {/* Header */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B6B53] shadow-lg mx-auto mb-4">
                <span className="text-white font-black text-xl tracking-tight">PN</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">PUSHKARA NIGHA</h1>
              <p className="text-xs text-[#64748B] font-semibold tracking-widest uppercase mt-1">AI Crowd Command Center</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Government of Andhra Pradesh • ICCC</p>
            </div>

            {/* Role switcher */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Role</p>
              <div className="flex gap-2">
                {(["admin", "supervisor"] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg border transition-all duration-200 ${
                      role === r
                        ? "bg-[#0B6B53] text-white border-[#0B6B53] shadow-md"
                        : "bg-white text-slate-500 border-slate-200 hover:border-[#0D9488] hover:text-[#0D9488]"
                    }`}
                  >
                    {r === "admin" ? "🛡️ Admin" : "👁️ Supervisor"}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex-1 flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
                  ⚠️ {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email / Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@iccc.gov.in"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/12 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 pr-11 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#0B6B53] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-500">Remember me</span>
                </label>
                <button type="button" className="text-xs font-semibold text-[#0D9488] hover:underline">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#0B6B53] to-[#0D9488] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:from-[#0D9488] hover:to-[#0B6B53] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "🔐 Secure Login"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-medium space-y-0.5 mt-4">
              <div>Government of Andhra Pradesh • ICCC Command Center</div>
              <div>Secure Node Connected • SHA-256 Encrypted</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
