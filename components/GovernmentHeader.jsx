/**
 * Pushkara Nigha - Government Header Component
 * Displays the Andhra Pradesh State Government emblem seal and official program titles.
 */

const GovernmentHeader = () => {
    return (
        <div className="text-center mb-6 select-none">
            {/* Andhra Pradesh Government emblem */}
            <img 
                src="assets/ap_government_emblem.png" 
                alt="Government of Andhra Pradesh Emblem" 
                className="w-16 h-16 mx-auto mb-3.5 object-contain"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))" }}
            />
            
            {/* Title & Subtitles */}
            <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase block">
                GOVERNMENT OF ANDHRA PRADESH
            </span>
            
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Pushkara Nigha
            </h1>
            
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                AI Crowd Command & Surveillance Platform
            </p>
            
            {/* Secure connection indicator bar */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Secure Node Connection Synced</span>
            </div>
        </div>
    );
};

// Export to window in UMD environment
window.GovernmentHeader = GovernmentHeader;
