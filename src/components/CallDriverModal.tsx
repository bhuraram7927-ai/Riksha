import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { DriverInfo, Language } from '../types';

interface CallDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverInfo;
  language: Language;
}

export const CallDriverModal: React.FC<CallDriverModalProps> = ({
  isOpen,
  onClose,
  driver,
  language
}) => {
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Driver dialogue simulation
  const [driverDialogue, setDriverDialogue] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setCallStatus('calling');
      setCallDuration(0);
      setDriverDialogue('');
      return;
    }

    // Simulate driver picking up after 2.5 seconds
    const pickupTimer = setTimeout(() => {
      setCallStatus('connected');
      setDriverDialogue(
        language === 'hi' 
          ? '“हाँ जी सर, नमस्ते! मैं बस मुख्य मोड़ पर हूँ, 1 मिनट में आपकी लोकेशन पर पहुंच रहा हूँ।”'
          : '"Hello sir, namaste! I just turned the corner, reaching your pickup point in 1 minute."'
      );
    }, 2400);

    return () => clearTimeout(pickupTimer);
  }, [isOpen, language]);

  // Timer when connected
  useEffect(() => {
    if (callStatus !== 'connected') return;

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-sm rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Background glow in Emerald Theme */}
        <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-emerald-500/20 to-transparent pointer-events-none" />

        {/* Safety Shield indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'सुरक्षित कॉलिंग (नंबर छुपा हुआ)' : 'Masked Secure Call'}</span>
        </div>

        {/* Driver Photo & Ringing animation */}
        <div className="relative mb-4">
          {callStatus === 'calling' && (
            <div className="absolute inset-0 -m-3 rounded-full border-2 border-emerald-400/60 animate-ping" />
          )}
          <img
            src={driver.avatar}
            alt={driver.name}
            className="w-24 h-24 rounded-full object-cover border-3 border-emerald-400 shadow-xl"
          />
        </div>

        {/* Driver Name & Vehicle */}
        <h3 className="font-extrabold text-xl text-white">
          {language === 'hi' ? driver.nameHi : driver.name}
        </h3>
        <p className="text-emerald-400 font-bold text-sm mt-0.5 tracking-wider">
          {driver.vehiclePlate}
        </p>
        <p className="text-slate-400 text-xs mt-0.5">
          {driver.vehicleModel}
        </p>

        {/* Call Status & Timer */}
        <div className="mt-4 mb-4">
          {callStatus === 'calling' && (
            <p className="text-sm font-semibold text-emerald-300 animate-pulse">
              {language === 'hi' ? 'घंटी बज रही है (Calling)...' : 'Ringing...'}
            </p>
          )}
          {callStatus === 'connected' && (
            <div className="flex flex-col items-center gap-1">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {language === 'hi' ? 'कॉल कनेक्ट हो गई' : 'Connected'}
              </span>
              <span className="text-xl font-mono font-bold text-white">
                {formatDuration(callDuration)}
              </span>
            </div>
          )}
        </div>

        {/* Driver dialogue bubble */}
        {driverDialogue && callStatus === 'connected' && (
          <div className="w-full bg-slate-800/90 border border-emerald-800/60 rounded-2xl p-3 mb-6 text-xs text-emerald-100 italic shadow-inner">
            {driverDialogue}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-6 w-full mt-2">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition active:scale-95 ${
              isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition active:scale-90"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition active:scale-95 ${
              isSpeaker ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
