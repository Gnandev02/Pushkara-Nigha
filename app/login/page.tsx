"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";

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
    // Simulate auth check
    await new Promise(r => setTimeout(r, 900));
    localStorage.setItem("pushkara_is_auth", "true");
    localStorage.setItem("pushkara_user_role", role);
    localStorage.setItem("pushkara_user_email", email);
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Cinematic Fullscreen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out filter blur-[4px] saturate-[0.55] grayscale-[10%]"
        style={{ backgroundImage: "url('/pushkara_ghat_surveillance.png')" }}
      />
      {/* Dark Overlay Grid */}
      <div className="absolute inset-0 bg-slate-950/50 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] z-0" />

      {/* Floating Centered White Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="w-full max-w-[425px] bg-white rounded-xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-slate-200/60 relative z-10 flex flex-col gap-6"
      >
        {/* Logo and Headings */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl shadow-sm mx-auto mb-5 border border-slate-200/50 transition-colors duration-500 ${
            role === "admin" ? "bg-[#172554]" : "bg-[#064E3B]"
          }`}>
            <span className="text-white font-semibold text-lg tracking-tight">PN</span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#0F172A] tracking-tight leading-none mb-1.5">
            Pushkara Nigha
          </h1>
          <p className={`text-[9px] font-bold tracking-[0.15em] uppercase mb-1 transition-colors duration-500 ${
            role === "admin" ? "text-[#1E3A8A]" : "text-[#065F46]"
          }`}>
            AI Crowd Command Center
          </p>
          <div className={`h-[1px] w-8 mx-auto my-3 transition-colors duration-500 ${
            role === "admin" ? "bg-[#1E3A8A]/20" : "bg-[#065F46]/20"
          }`} />
          <p className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
            Govt. of Andhra Pradesh • Secure Node
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 text-left">Select Role</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-md border transition-all duration-300 flex items-center justify-center gap-2 ${
                role === "admin"
                  ? "bg-[#172554] text-white border-[#172554] shadow-sm"
                  : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Shield className={`w-3.5 h-3.5 transition-colors duration-300 ${role === "admin" ? "text-blue-100" : "text-slate-400"}`} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("supervisor")}
              className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-md border transition-all duration-300 flex items-center justify-center gap-2 ${
                role === "supervisor"
                  ? "bg-[#064E3B] text-white border-[#064E3B] shadow-sm"
                  : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Eye className={`w-3.5 h-3.5 transition-colors duration-300 ${role === "supervisor" ? "text-emerald-100" : "text-slate-400"}`} />
              Supervisor
            </button>
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-800 text-[11px] font-medium px-4 py-3 rounded-md flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">
              Email / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@iccc.gov.in"
              className={`w-full border border-l-2 border-slate-200 rounded-md px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none transition-all duration-300 font-medium ${
                role === "admin"
                  ? "focus:border-[#172554] border-l-transparent focus:border-l-[#172554] focus:ring-4 focus:ring-[#172554]/5"
                  : "focus:border-[#064E3B] border-l-transparent focus:border-l-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/5"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full border border-l-2 border-slate-200 rounded-md px-3.5 py-2.5 pr-12 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none transition-all duration-300 font-medium ${
                  role === "admin"
                    ? "focus:border-[#172554] border-l-transparent focus:border-l-[#172554] focus:ring-4 focus:ring-[#172554]/5"
                    : "focus:border-[#064E3B] border-l-transparent focus:border-l-[#064E3B] focus:ring-4 focus:ring-[#064E3B]/5"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[9px] font-bold tracking-widest select-none transition-colors duration-300"
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 mb-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className={`w-3.5 h-3.5 rounded border-slate-300 cursor-pointer transition-colors duration-300 ${
                  role === "admin" ? "accent-[#172554]" : "accent-[#064E3B]"
                }`}
              />
              <span className="text-[11px] font-medium text-slate-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-[11px] font-medium bg-transparent border-none p-0 cursor-pointer text-slate-500 hover:text-slate-800 transition-colors duration-300"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-medium text-[13px] tracking-wide rounded-md transition-all duration-500 disabled:opacity-70 flex items-center justify-center gap-2 mt-1 ${
              role === "admin"
                ? "bg-[#172554] hover:bg-[#1E3A8A] shadow-[0_4px_14px_rgba(23,37,84,0.25)] hover:shadow-[0_6px_20px_rgba(23,37,84,0.35)]"
                : "bg-[#064E3B] hover:bg-[#047857] shadow-[0_4px_14px_rgba(6,78,59,0.25)] hover:shadow-[0_6px_20px_rgba(6,78,59,0.35)]"
            }`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-white/80" />
                <span>Secure Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center border-t border-slate-100 pt-5 mt-2 text-[8px] text-slate-400 font-bold tracking-[0.15em] space-y-1">
          <div>SHA-256 ENCRYPTION ACTIVE</div>
          <div>NODE IP MONITORED</div>
        </div>
      </motion.div>
    </div>
  );
}
