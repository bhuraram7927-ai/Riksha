import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Share2, 
  Check, 
  AlertTriangle, 
  Users, 
  Lock 
} from 'lucide-react';
import { Language } from '../types';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [shared, setShared] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    setSosTriggered(true);
  };

  const handleShareLiveTrip = () => {
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {language === 'hi' ? 'रिक्शा ऐप सुरक्षा कवच (24x7)' : 'Rickshaw App Safety Shield'}
              </h3>
              <p className="text-[11px] text-emerald-100">
                {language === 'hi' ? 'हर सफ़र में आपकी सुरक्षा हमारी पहली प्राथमिकता' : 'Your safety is our top priority'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">

          {/* EMERGENCY SOS BUTTON */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
            <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-600/30 mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-black text-rose-900 text-base">
              {language === 'hi' ? 'आपातकालीन सहायता (Emergency SOS)' : 'Emergency SOS Alert'}
            </h4>
            <p className="text-xs text-rose-700 mt-1">
              {language === 'hi' 
                ? 'मुसीबत के समय पुलिस (112) और रिक्शा सुरक्षा टीम को तुरंत लाइव लोकेशन भेजी जाएगी' 
                : 'Instantly alerts Police (112) and Rickshaw Safety response team with GPS coordinates.'}
            </p>

            {sosTriggered ? (
              <div className="mt-3 p-3 bg-rose-600 text-white rounded-xl text-xs font-bold animate-pulse">
                {language === 'hi' 
                  ? '🚨 SOS अलर्ट जारी! आपातकालीन टीम को आपकी लोकेशन भेज दी गई है।' 
                  : '🚨 SOS Alert Active! Location broadcasted to Emergency control room.'}
              </div>
            ) : (
              <button
                onClick={handleTriggerSOS}
                className="mt-3 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition active:scale-95 shadow-md shadow-rose-600/20"
              >
                {language === 'hi' ? 'SOS दबाएं (Emergency 112)' : 'Press SOS (Dial 112)'}
              </button>
            )}
          </div>

          {/* SHARE LIVE LOCATION */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">
                  {language === 'hi' ? 'लाइव ट्रैकिंग लिंक शेयर करें' : 'Share Live Tracking Link'}
                </h5>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi' ? 'परिवार या दोस्तों को WhatsApp पर भेजें' : 'Send real-time map link via WhatsApp'}
                </p>
              </div>
            </div>

            <button
              onClick={handleShareLiveTrip}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                shared
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              {shared ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{shared ? (language === 'hi' ? 'लिंक कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'शेयर करें' : 'Share')}</span>
            </button>
          </div>

          {/* SAFETY FEATURES CHECKLIST */}
          <div className="space-y-2 pt-1">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'रिक्शा ऐप सुरक्षा मानक' : 'Rickshaw Safety Guarantee'}
            </h5>

            {[
              {
                hi: '100% पुलिस व आधार सत्यापित चालक (Verified Drivers)',
                en: '100% police and Aadhaar verified drivers'
              },
              {
                hi: 'सुरक्षित 4-अंकीय OTP सत्यापन के बिना सफ़र शुरू नहीं होता',
                en: 'Trip starts only after 4-digit OTP verification'
              },
              {
                hi: 'कॉल के दौरान आपका फोन नंबर सुरक्षित व छिपा रहता है',
                en: 'Phone number masking for rider privacy'
              },
              {
                hi: 'रात के समय विशेष स्पीड ट्रैकिंग व सुरक्षा निगरानी',
                en: '24x7 Night GPS tracking and geofence monitoring'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </span>
                <span>{language === 'hi' ? item.hi : item.en}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
