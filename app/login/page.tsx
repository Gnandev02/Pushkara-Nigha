"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("pushkara_user_name", data.user.name);
        localStorage.setItem("pushkara_user_role", data.user.role);
        router.push("/");
      } else {
        setError(data.error || "Authentication failed. Unauthorized access.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl shadow-sm mx-auto mb-5 border border-slate-200/50 bg-[#172554] transition-colors duration-500">
            <span className="text-white font-semibold text-lg tracking-tight">PN</span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#0F172A] tracking-tight leading-none mb-1.5">
            Pushkara Nigha
          </h1>
          <p className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1 text-[#1E3A8A] transition-colors duration-500">
            AI Crowd Command Center
          </p>
          <div className="h-[1px] w-8 mx-auto my-3 bg-[#1E3A8A]/20 transition-colors duration-500" />
          <p className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
            Govt. of Andhra Pradesh
          </p>
          <p className="text-[10px] text-amber-600 font-bold tracking-widest uppercase mt-2 bg-amber-50 py-1 px-2 rounded inline-block border border-amber-200/60">
            Restricted Operational Portal
          </p>
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
              Official Email (@gov.in / @ap.gov.in)
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="officer@ap.gov.in"
              className="w-full border border-l-2 border-slate-200 border-l-transparent focus:border-l-[#172554] rounded-md px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none transition-all duration-300 font-medium focus:border-[#172554] focus:ring-4 focus:ring-[#172554]/5"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-l-2 border-slate-200 border-l-transparent focus:border-l-[#172554] rounded-md px-3.5 py-2.5 pr-12 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none transition-all duration-300 font-medium focus:border-[#172554] focus:ring-4 focus:ring-[#172554]/5"
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
                className="w-3.5 h-3.5 rounded border-slate-300 cursor-pointer accent-[#172554] transition-colors duration-300"
              />
              <span className="text-[11px] font-medium text-slate-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-medium text-[13px] tracking-wide rounded-md transition-all duration-500 disabled:opacity-70 flex items-center justify-center gap-2 mt-1 bg-[#172554] hover:bg-[#1E3A8A] shadow-[0_4px_14px_rgba(23,37,84,0.25)] hover:shadow-[0_6px_20px_rgba(23,37,84,0.35)]"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-white/80" />
                <span>Secure Authorized Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center border-t border-slate-100 pt-5 mt-2 text-[8px] text-slate-400 font-bold tracking-[0.15em] space-y-1 flex flex-col items-center">
          <div className="flex items-center gap-1"><Shield size={10} className="text-slate-400" /> AUTHORIZED PERSONNEL ONLY</div>
          <div>AES-256 ENCRYPTION ACTIVE • NODE IP MONITORED</div>
        </div>
      </motion.div>
    </div>
  );
}

