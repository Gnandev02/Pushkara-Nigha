import React from 'react';

const BackgroundHero = () => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            {/* Background Image */}
            <img 
                src="assets/pushkara_ghat_surveillance.png" 
                alt="AP Godavari River Pushkaram Surveillance" 
                className="absolute inset-0 w-full h-full object-cover select-none"
            />
            
            {/* Soft dark wash + cinematic backdrop blur overlay for high contrast and readability */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px] z-1"></div>
        </div>
    );
};

export default BackgroundHero;
