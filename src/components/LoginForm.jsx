import React, { useState } from 'react';

const LoginForm = ({ 
    username, 
    password, 
    rememberMe, 
    error, 
    isLoading, 
    onUsernameChange, 
    onPasswordChange, 
    onRememberChange, 
    onSubmit 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputErrors, setInputErrors] = useState({ username: false, password: false });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        // Form validations
        const errors = {
            username: !username.trim(),
            password: !password.trim()
        };

        setInputErrors(errors);

        if (!errors.username && !errors.password) {
            onSubmit();
        }
    };

    const handleForgotClick = (e) => {
        e.preventDefault();
        if (window.showSystemBanner) {
            window.showSystemBanner("ICCC Directive: Present your physical RFID Command Key to sector admin to reset credentials.");
        } else {
            alert("ICCC Security Protocols: Please contact your local District Command Admin to request account passcode overrides.");
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-5 animate-fade-up">
            {/* Direct Validation Banner */}
            {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs leading-relaxed font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Username / Email */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider" htmlFor="react-username">
                    Username / Email
                </label>
                <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input 
                        type="text" 
                        id="react-username"
                        value={username}
                        onChange={(e) => {
                            onUsernameChange(e.target.value);
                            if (inputErrors.username) setInputErrors(prev => ({ ...prev, username: false }));
                        }}
                        placeholder="Enter your username or email"
                        disabled={isLoading}
                        className={`w-full h-11 pl-10 pr-4 bg-slate-50/70 border ${
                            inputErrors.username ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        } rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider" htmlFor="react-password">
                    Password
                </label>
                <div className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        id="react-password"
                        value={password}
                        onChange={(e) => {
                            onPasswordChange(e.target.value);
                            if (inputErrors.password) setInputErrors(prev => ({ ...prev, password: false }));
                        }}
                        placeholder="Enter password"
                        disabled={isLoading}
                        className={`w-full h-11 pl-10 pr-10 bg-slate-50/70 border ${
                            inputErrors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        } rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    {/* Toggle password eye */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                        className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-xs select-none">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => onRememberChange(e.target.checked)}
                        disabled={isLoading}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Remember Me</span>
                </label>
                
                <a 
                    href="#" 
                    onClick={handleForgotClick}
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                >
                    Forgot Password?
                </a>
            </div>

            {/* Secure Login Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Logging in securely...</span>
                    </>
                ) : (
                    <span>Secure Login</span>
                )}
            </button>
        </form>
    );
};

export default LoginForm;
