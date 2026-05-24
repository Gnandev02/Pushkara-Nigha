/**
 * Pushkara Nigha - Professional Role Selector Tab Component
 * Renders a corporate segmented selector for Admin and Command Supervisor profiles.
 */

const RoleSelector = ({ activeRole, onChange }) => {
    return (
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80 mb-6 gap-1 w-full select-none">
            {/* ADMIN ROLE TAB */}
            <button
                type="button"
                onClick={() => onChange('admin')}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-md tracking-wider transition-all duration-200 ${
                    activeRole === 'admin'
                        ? 'bg-blue-600 text-white shadow-sm border border-blue-500/20'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                ADMIN CORE
            </button>
            
            {/* COMMAND SUPERVISOR ROLE TAB */}
            <button
                type="button"
                onClick={() => onChange('command-supervisor')}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-md tracking-wider transition-all duration-200 ${
                    activeRole === 'command-supervisor'
                        ? 'bg-emerald-700 text-white shadow-sm border border-emerald-600/20'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                COMMAND SUPERVISOR
            </button>
        </div>
    );
};

// Export to window in UMD environment
window.RoleSelector = RoleSelector;
