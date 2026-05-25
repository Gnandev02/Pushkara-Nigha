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
        className="w-full max-w-[425px] bg-white/98 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-[0_24px_64px_rgba(15,23,42,0.28)] border border-slate-200/90 relative z-10 flex flex-col gap-6"
      >
        {/* Logo and Headings */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B6B53] shadow-md mx-auto mb-4 border border-white/10 transition-transform duration-300 hover:scale-105">
            <span className="text-white font-extrabold text-xl tracking-tight">PN</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight leading-none mb-1.5">
            Pushkara Nigha
          </h1>
          <p className="text-[10px] text-[#0D9488] font-bold tracking-[0.12em] uppercase mb-1">
            AI Crowd Command Center
          </p>
          <div className="h-[1.5px] w-12 bg-[#0B6B53]/20 mx-auto my-2" />
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
            Government of Andhra Pradesh • ICCC Secure Node
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <p className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider mb-2 text-left">Select Portal Role</p>
          <div className="flex gap-2">
            {(["admin", "supervisor"] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded border transition-all duration-300 flex items-center justify-center gap-2 ${
                  role === r
                    ? "bg-[#0B6B53] text-white border-[#0B6B53] shadow-[0_4px_12px_rgba(11,107,83,0.25)]"
                    : "bg-white text-slate-500 border-slate-200 hover:border-[#0D9488]/40 hover:text-[#0D9488] hover:bg-slate-50"
                }`}
              >
                {r === "admin" ? (
                  <Shield className={`w-3.5 h-3.5 ${role === r ? "text-[#2DD4BF]" : "text-slate-400"}`} />
                ) : (
                  <Eye className={`w-3.5 h-3.5 ${role === r ? "text-[#2DD4BF]" : "text-slate-400"}`} />
                )}
                {r === "admin" ? "Admin" : "Supervisor"}
              </button>
            ))}
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="block text-[10px] font-extrabold text-[#475569] uppercase tracking-wider text-left">
              Email / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@iccc.gov.in"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-all font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-[10px] font-extrabold text-[#475569] uppercase tracking-wider text-left">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-12 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15 transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-[10px] font-bold tracking-wider select-none transition-colors"
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 accent-[#0B6B53] cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-500">Remember me</span>
            </label>
            <button type="button" className="text-[11px] font-bold text-[#0D9488] hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors hover:text-[#0B6B53]">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#0B6B53] to-[#0D9488] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg hover:from-[#0D9488] hover:to-[#0B6B53] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating Node...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white/90" />
                <span>Secure Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center border-t border-slate-100 pt-4 text-[9px] text-slate-400 font-extrabold tracking-wider space-y-0.5 mt-2">
          <div>SHA-256 SECURE ENCRYPTION ACTIVE</div>
          <div>NODE: IP MONITORED & AUDITED</div>
        </div>
      </motion.div>
    </div>
  );
}
