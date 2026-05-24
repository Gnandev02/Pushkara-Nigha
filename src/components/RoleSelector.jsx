import React from 'react';

const RoleSelector = ({ activeRole, onChange }) => {
    return (
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80 mb-5 gap-1 w-full select-none">
            {/* ADMIN ROLE TAB */}
            <button
                type="button"
                onClick={() => onChange('admin')}
                className={`flex-1 py-2 px-4 text-xs font-bold rounded-md tracking-wider transition-all duration-200 cursor-pointer ${
                    activeRole === 'admin'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                Admin
            </button>
            
            {/* COMMAND SUPERVISOR ROLE TAB */}
            <button
                type="button"
                onClick={() => onChange('command-supervisor')}
                className={`flex-1 py-2 px-4 text-xs font-bold rounded-md tracking-wider transition-all duration-200 cursor-pointer ${
                    activeRole === 'command-supervisor'
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                Command Supervisor
            </button>
        </div>
    );
};

export default RoleSelector;
