/**
 * Pushkara Nigha - Background Hero Component
 * Renders the full-screen cinematic Godavari Pushkaram ghat surveillance view with parallax shifts.
 */

const BackgroundHero = () => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            {/* Background Image with Parallax Scale Animation */}
            <img 
                src="assets/pushkara_ghat_surveillance.png" 
                alt="AP Godavari River Pushkaram Surveillance" 
                className="absolute inset-0 w-full h-full object-cover select-none animate-parallax"
                style={{ transformOrigin: 'center center' }}
            />
            
            {/* Soft Blur Glass Overlay */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-1"></div>
            
            {/* Gradient Mask for high readability & official contrast */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/75 to-slate-950/40 z-2"></div>
        </div>
    );
};

// Export to window in UMD environment
window.BackgroundHero = BackgroundHero;
