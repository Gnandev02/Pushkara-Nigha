import React from 'react';

const GovernmentHeader = () => {
    return (
        <div className="text-center mb-6 select-none">
            {/* Andhra Pradesh Government emblem */}
            <img 
                src="assets/ap_government_emblem.png" 
                alt="Government of Andhra Pradesh Emblem" 
                className="w-16 h-16 mx-auto mb-3 object-contain"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))" }}
            />
            
            {/* Title & Subtitles */}
            <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase block">
                GOVERNMENT OF ANDHRA PRADESH
            </span>
            
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Pushkara Nigha
            </h1>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                AI Crowd Command & Surveillance Platform
            </p>
        </div>
    );
};

export default GovernmentHeader;
