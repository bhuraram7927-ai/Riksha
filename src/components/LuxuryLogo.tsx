import React, { useState } from 'react';

interface LuxuryLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  language?: 'hi' | 'en';
}

export const LuxuryLogo: React.FC<LuxuryLogoProps> = ({
  size = 'md',
  showText = true,
  language = 'hi'
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 32, text: 'text-base', badge: 'text-[9px] px-1 py-0.2' },
    md: { box: 'w-10 h-10', svg: 40, text: 'text-xl', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { box: 'w-13 h-13', svg: 52, text: 'text-2xl', badge: 'text-xs px-2 py-0.5' },
    xl: { box: 'w-16 h-16', svg: 64, text: 'text-3xl', badge: 'text-xs px-2.5 py-1' }
  };

  const current = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none">
      {/* SIMPLE CLEAN GREEN AUTO-RICKSHAW APP ICON */}
      <div 
        className={`relative ${current.box} rounded-2xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden border border-emerald-400/60 bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-800`}
        style={{
          boxShadow: '0 6px 18px -2px rgba(5, 150, 105, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4)'
        }}
      >
        {/* Subtle rim highlight */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none z-20" />

        {/* If image exists, render it; otherwise render pristine simple Rickshaw SVG icon */}
        {!imgFailed ? (
          <img 
            src="/favicon.svg" 
            alt="Rickshaw" 
            className="w-full h-full object-contain relative z-10 p-0.5"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <svg 
            width={current.svg - 6} 
            height={current.svg - 6} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Auto Yellow Canopy Roof */}
            <path
              d="M 22 42 C 28 32 42 28 62 28 C 74 28 80 32 84 40 L 80 44 C 70 36 55 34 46 34 C 34 34 26 38 22 42 Z"
              fill="#FBBF24"
            />
            {/* White Body Cabin */}
            <path
              d="M 23 43 C 27 36 38 32 58 32 C 72 32 80 38 82 46 L 80 62 C 80 65 77 67 73 67 L 26 67 C 22 67 20 64 20 60 L 21 49 C 21 45 22 44 23 43 Z"
              fill="#FFFFFF"
            />
            {/* Front Windshield */}
            <path d="M 60 38 L 76 43 L 74 55 L 60 55 Z" fill="#7DD3FC" opacity="0.85" />
            {/* Passenger Window Cutout */}
            <rect x="27" y="40" width="16" height="15" rx="2" fill="#047857" opacity="0.8" />
            <rect x="46" y="39" width="11" height="16" rx="2" fill="#047857" opacity="0.8" />
            {/* Lower Body Gold Panel */}
            <path d="M 20 60 L 81 60 L 80 70 C 78 73 75 74 71 74 L 26 74 C 22 74 20 71 20 67 Z" fill="#F59E0B" />
            {/* Rear Wheel */}
            <circle cx="36" cy="74" r="9" fill="#1E293B" />
            <circle cx="36" cy="74" r="5" fill="#E2E8F0" />
            <circle cx="36" cy="74" r="2.5" fill="#059669" />
            {/* Front Wheel */}
            <circle cx="72" cy="74" r="8" fill="#1E293B" />
            <circle cx="72" cy="74" r="4.5" fill="#E2E8F0" />
            <circle cx="72" cy="74" r="2" fill="#059669" />
            {/* Wi-Fi Waves */}
            <path d="M 46 22 A 10 10 0 0 1 58 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 49 25 A 5 5 0 0 1 55 25" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* BRAND TYPOGRAPHY */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {/* Rickshaw App Brand Name */}
            <span className={`${current.text} font-black tracking-tight leading-none bg-linear-to-r from-emerald-700 via-emerald-800 to-teal-950 bg-clip-text text-transparent flex items-center gap-1`}>
              <span>{language === 'hi' ? 'रिक्शा' : 'Rickshaw'}</span>
            </span>

            {/* Emerald Luxury 'APP' Badge */}
            <span 
              className={`${current.badge} rounded-md font-black tracking-widest uppercase text-white bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-600 shadow-xs border border-emerald-400 flex items-center gap-0.5`}
            >
              <span>★</span>
              <span>{language === 'hi' ? 'ऐप' : 'APP'}</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-[10.5px] font-bold text-emerald-800 tracking-wide mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
            <span>
              {language === 'hi' 
                ? 'टैक्सी, बाइक और ऑटो बुकिंग' 
                : 'Cab, Bike & Auto Booking'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
