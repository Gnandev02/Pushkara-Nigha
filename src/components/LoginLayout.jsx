import React from 'react';
import GovernmentHeader from './GovernmentHeader.jsx';
import RoleSelector from './RoleSelector.jsx';

const LoginLayout = ({ children, activeRole, onRoleChange }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 z-10 w-full">
            {/* Center-aligned Elegant White Card with premium border & shadows */}
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/50 shadow-2xl p-8 sm:p-10 flex flex-col justify-between animate-fade-up relative overflow-hidden">
                {/* Subtle government watermark inside the card */}
                <div className="absolute inset-0 gov-seal-watermark z-0 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* AP Government Emblem & Titles */}
                    <GovernmentHeader />

                    {/* Role Tabs Selector & Form Children */}
                    <div className="flex-grow flex flex-col justify-center my-2">
                        <RoleSelector activeRole={activeRole} onChange={onRoleChange} />
                        {children}
                    </div>

                    {/* Government Portal Footer */}
                    <div className="text-center border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-medium select-none space-y-0.5">
                        <div>
                            Government of Andhra Pradesh &bull; ICCC Command Center
                        </div>
                        <div className="text-slate-400/80">
                            Secure Authentication Portal
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginLayout;
