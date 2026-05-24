import React from 'react';
import GovernmentHeader from './GovernmentHeader.jsx';
import RoleSelector from './RoleSelector.jsx';

const LoginLayout = ({ children, activeRole, onRoleChange }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10 w-full max-w-6xl mx-auto">
            {/* Main centered card */}
            <div className="w-full bg-white rounded-2xl overflow-hidden shadow-gov-premium flex flex-col lg:flex-row min-h-[640px] border border-slate-200/50 animate-fade-up">
                
                {/* LEFT BRANDING PANEL: Drone surveillance & glass stats cards */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col justify-between p-10 overflow-hidden select-none">
                    {/* Godavari drone photo */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="assets/pushkara_ghat_surveillance.png" 
                            alt="Godavari Basin Bathing Ghats Drone View" 
                            className="w-full h-full object-cover opacity-55 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/85 to-slate-950/50"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    </div>

                    {/* Branding Seal */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-emerald-600 flex items-center justify-center font-bold text-xs text-white shadow-md border border-white/10">
                            AP
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold tracking-tight">ICCC Security Network</span>
                            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Node Godavari-West</span>
                        </div>
                    </div>

                    {/* Program description */}
                    <div className="relative z-10 my-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold uppercase tracking-wider mb-2.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active Command Center
                        </div>
                        <h2 className="text-xl font-extrabold text-white leading-tight mb-2">
                            Pushkara Nigha <br/>
                            <span className="text-emerald-400 font-bold text-lg">— AI Crowd Command Preview</span>
                        </h2>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium max-w-sm">
                            Real-time intelligent telemetry, devotee capacity threshold vectors, and rapid response routing for official smart city corridors.
                        </p>
                    </div>

                    {/* Subtle glass cards */}
                    <div className="relative z-10 flex flex-col gap-2.5 mb-2 max-w-sm">
                        
                        {/* 1. Active Ghats */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-lg hover:border-emerald-500/20 hover:bg-slate-900/50 transition-all duration-200">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Bathing Ghats</span>
                                <span className="text-xs font-bold text-white">12 Districts Sectors Monitored</span>
                            </div>
                        </div>

                        {/* 2. Live Crowd */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-lg hover:border-emerald-500/20 hover:bg-slate-900/50 transition-all duration-200">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Live Devotee Crowd</span>
                                <span className="text-xs font-bold text-white">24,340 dev Flow Calibrated</span>
                            </div>
                        </div>

                        {/* 3. Active Cameras */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-lg hover:border-emerald-500/20 hover:bg-slate-900/50 transition-all duration-200">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7Z"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active AI Video Feeds</span>
                                <span className="text-xs font-bold text-white">112 streaming smart feeds</span>
                            </div>
                        </div>

                        {/* 4. AI Alerts */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-lg hover:border-emerald-500/20 hover:bg-slate-900/50 transition-all duration-200">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Neural Alerts Cataloged</span>
                                <span className="text-xs font-bold text-white">2 Critical anomalies active</span>
                            </div>
                        </div>

                        {/* 5. Network Latency */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-lg hover:border-emerald-500/20 hover:bg-slate-900/50 transition-all duration-200">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ICCC Secure Node Status</span>
                                <span className="text-xs font-bold text-emerald-400">Secured &bull; 38ms latency</span>
                            </div>
                        </div>

                    </div>

                    <div className="relative z-10 text-[9px] text-slate-400 border-t border-white/10 pt-4 flex justify-between font-semibold">
                        <span>Integrated Operations Center</span>
                        <span>AP-ICCC NODE 04</span>
                    </div>
                </div>

                {/* RIGHT PANEL: Centered white login cards */}
                <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 gov-seal-watermark z-0"></div>

                    <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col h-full justify-between">
                        {/* Render emblem logo & program titles (Globally defined) */}
                        <GovernmentHeader />

                        {/* Switchers & Forms */}
                        <div className="flex-1 flex flex-col justify-center my-2">
                            <RoleSelector activeRole={activeRole} onChange={onRoleChange} />
                            {children}
                        </div>

                        {/* Government Footer */}
                        <div className="text-center border-t border-slate-100 pt-4 text-[10px] text-slate-400/90 font-medium select-none space-y-0.5">
                            <div>
                                Government of Andhra Pradesh &bull; ICCC Command Center
                            </div>
                            <div>
                                Secure Node Connected &bull; Last Handshake Synced
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginLayout;
