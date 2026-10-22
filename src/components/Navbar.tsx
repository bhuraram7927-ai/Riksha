import React from 'react';
import { 
  Shield, 
  History, 
  Wallet, 
  Languages, 
  PhoneCall, 
  Car, 
  UserPlus,
  HelpCircle,
  CalendarClock
} from 'lucide-react';
import { Language } from '../types';
import { LuxuryLogo } from './LuxuryLogo';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  walletBalance: number;
  onOpenHistory: () => void;
  onOpenSafety: () => void;
  onOpenDriverPartner: () => void;
  onOpenPlayStore: () => void;
  scheduledCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  walletBalance,
  onOpenHistory,
  onOpenSafety,
  onOpenDriverPartner,
  onOpenPlayStore,
  scheduledCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Luxury Logo */}
        <LuxuryLogo language={language} size="md" />

        {/* Right Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Scheduled rides badge */}
          {scheduledCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs animate-pulse">
              <CalendarClock className="w-3.5 h-3.5" />
              <span>{scheduledCount} {language === 'hi' ? 'शेड्यूल्ड' : 'Scheduled'}</span>
            </div>
          )}

          {/* Wallet preview in Emerald Theme */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 transition text-emerald-950 text-xs font-bold cursor-pointer border border-emerald-200 shadow-2xs">
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹{walletBalance}</span>
          </div>

          {/* Past Trips History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-900 hover:bg-emerald-50 transition active:scale-95"
            title={language === 'hi' ? 'पिछली यात्राएं' : 'My Trips'}
          >
            <History className="w-4 h-4 text-emerald-700" />
            <span className="hidden md:inline">
              {language === 'hi' ? 'सफ़र इतिहास' : 'Trips'}
            </span>
          </button>

          {/* Safety Shield */}
          <button
            onClick={onOpenSafety}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition active:scale-95"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'सुरक्षा 24x7' : 'Safety'}
            </span>
          </button>

          {/* Driver Partner onboarding link */}
          <button
            onClick={onOpenDriverPartner}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/90 border border-emerald-300 transition active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-emerald-700" />
            <span>
              {language === 'hi' ? 'चालक बनें' : 'Drive with Us'}
            </span>
          </button>

          {/* Google Play Store Download Button */}
          <button
            onClick={onOpenPlayStore}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm hover:shadow transition active:scale-95 cursor-pointer border border-slate-700"
            title={language === 'hi' ? 'प्ले स्टोर से ऐप डाउनलोड करें' : 'Download from Google Play'}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 512 512">
              <path fill="#00E676" d="M380.9 220.4l-75.7-43.7L76.5 40.5c-6.8-3.9-14.8-4.7-22.3-2.1l251 251 75.7-69z"/>
              <path fill="#FFD600" d="M380.9 291.6L305.2 335.3 54.2 473.6c7.5 2.6 15.5 1.8 22.3-2.1l228.7-136.2 75.7-43.7z"/>
              <path fill="#00B0FF" d="M54.2 38.4C44.4 44 38.4 54.7 38.4 67.2v377.6c0 12.5 6 23.2 15.8 28.8L305.2 256 54.2 38.4z"/>
              <path fill="#FF3D00" d="M473.6 238.4l-92.7-53.5-75.7 71.1 75.7 71.1 92.7-53.5c19.2-11.1 19.2-34.1 0-45.2z"/>
            </svg>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-300 font-semibold">GET IT ON</span>
              <span className="text-[10px] sm:text-[11px] font-black text-white">Google Play</span>
            </div>
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition active:scale-95 shadow-2xs"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
