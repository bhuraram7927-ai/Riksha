import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Star, 
  Receipt, 
  Heart, 
  ArrowRight, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Wallet,
  Sparkles,
  Smile,
  X,
  IndianRupee,
  Check
} from 'lucide-react';
import { ActiveRide, Language } from '../types';

interface TripCompletedModalProps {
  ride: ActiveRide;
  language: Language;
  onCloseAndReset: (tip?: number, rating?: number) => void;
}

export const TripCompletedModal: React.FC<TripCompletedModalProps> = ({
  ride,
  language,
  onCloseAndReset
}) => {
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState<number | null>(null);
  const [isCustomTipOpen, setIsCustomTipOpen] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [showTipAppreciation, setShowTipAppreciation] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti burst on modal open
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const badges = [
    { id: 'clean', hi: '✨ साफ-सुथरी गाड़ी', en: '✨ Clean Vehicle' },
    { id: 'polite', hi: '🙏 विनम्र व्यवहार', en: '🙏 Polite Driver' },
    { id: 'punctual', hi: '⏱️ समय के पाबंद', en: '⏱️ On-Time' },
    { id: 'safe', hi: '🛡️ सुरक्षित ड्राइविंग', en: '🛡️ Safe Driving' }
  ];

  const presetTipAmounts = [20, 50, 100];

  const handleSelectPresetTip = (amt: number) => {
    if (tip === amt) {
      setTip(null);
      setShowTipAppreciation(false);
    } else {
      setTip(amt);
      setIsCustomTipOpen(false);
      setCustomTipValue('');
      setShowTipAppreciation(true);
      // Trigger subtle mini confetti for driver appreciation
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.75 }
      });
    }
  };

  const handleApplyCustomTip = () => {
    const parsed = parseInt(customTipValue, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 5000) {
      setTip(parsed);
      setShowTipAppreciation(true);
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.75 }
      });
    } else if (customTipValue === '' || parsed === 0) {
      setTip(null);
      setShowTipAppreciation(false);
    }
  };

  const toggleBadge = (id: string) => {
    setSelectedBadges(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const currentTipAmount = tip || 0;
  const totalPaid = ride.totalFare + currentTipAmount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-emerald-100">
        
        {/* Header Ribbon - Premium Emerald Theme */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 text-center relative shrink-0 shadow-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-inner">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            {language === 'hi' ? 'सफ़र सफलतापूर्वक पूरा हुआ!' : 'Ride Completed Successfully!'}
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            {language === 'hi' ? 'रिक्शा ऐप के साथ सफ़र करने के लिए धन्यवाद' : 'Thank you for riding with Rickshaw App'}
          </p>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

          {/* Amount Paid & Final Bill Summary */}
          <div className="bg-linear-to-br from-emerald-50/70 via-slate-50 to-teal-50/40 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'hi' ? 'कुल अंतिम बिल (Final Bill)' : 'Final Bill Summary'}
                </span>
                
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    ₹{totalPaid}
                  </span>
                  {currentTipAmount > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full">
                      +{currentTipAmount} {language === 'hi' ? 'टिप शामिल' : 'Tip Included'}
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-600 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>
                    {ride.paymentMethod === 'cash' 
                      ? (language === 'hi' ? 'नकद भुगतान (Cash to Driver)' : 'Paid via Cash')
                      : (language === 'hi' ? 'UPI / डिजिटल भुगतान (Paid Online)' : 'Paid Online (UPI)')}
                  </span>
                </div>
              </div>

              {/* Trip stats */}
              <div className="text-right bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs font-semibold text-slate-600 flex items-center justify-end gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{ride.distanceKm} km</span>
                </div>
                <div className="text-xs font-semibold text-slate-600 flex items-center justify-end gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{ride.durationMins} mins</span>
                </div>
              </div>
            </div>

            {/* Itemized breakdown if tip is added */}
            {currentTipAmount > 0 && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'hi' ? 'सवारी का मूल किराया (Ride Fare):' : 'Ride Fare:'}</span>
                  <span className="font-semibold text-slate-800">₹{ride.totalFare}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                    <span>
                      {language === 'hi' 
                        ? `सारथी बख्शीश (${ride.driver.nameHi}):` 
                        : `Driver Tip (${ride.driver.name}):`}
                    </span>
                  </span>
                  <span className="font-bold text-emerald-800">+₹{currentTipAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200/70 text-xs">
                  <span>{language === 'hi' ? 'कुल देय राशि (Total Paid):' : 'Total Paid:'}</span>
                  <span className="text-emerald-700 font-extrabold">₹{totalPaid}</span>
                </div>
              </div>
            )}
          </div>

          {/* Driver Mini Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-100 bg-emerald-50/50">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-900 truncate">
                  {language === 'hi' ? ride.driver.nameHi : ride.driver.name}
                </h4>
                <div className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{ride.driver.rating}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {ride.vehicle.name} • <span className="font-bold text-emerald-800 font-mono">{ride.driver.vehiclePlate}</span>
              </p>
            </div>
          </div>

          {/* Rate Driver Section */}
          <div className="text-center pt-1">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'सवारी का अनुभव कैसा रहा?' : 'How was your ride experience?'}
            </h4>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-emerald-500 hover:scale-125 transition active:scale-95 cursor-pointer"
                  title={`${star} star`}
                >
                  <Star 
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition ${
                      star <= rating ? 'fill-emerald-500 text-emerald-600 drop-shadow-xs' : 'text-slate-200 hover:text-emerald-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Compliment Badges */}
          <div className="flex flex-wrap gap-1.5 justify-center pt-0.5">
            {badges.map(b => (
              <button
                key={b.id}
                onClick={() => toggleBadge(b.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                  selectedBadges.includes(b.id)
                    ? 'bg-emerald-600 text-white font-bold shadow-xs scale-102'
                    : 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/90'
                }`}
              >
                {language === 'hi' ? b.hi : b.en}
              </button>
            ))}
          </div>

          {/* TIPPING FEATURE SECTION */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-pulse" />
                <span>
                  {language === 'hi' ? 'सारथी को बख्शीश (Tip) दें' : 'Tip your driver'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {language === 'hi' ? '100% ड्राइवर को जाती है' : '100% goes to driver'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-2.5">
              {language === 'hi' 
                ? 'बेहतरीन सेवा और सुरक्षित सफर के लिए अपने सारथी का उत्साहवर्धन करें।' 
                : 'Show appreciation for great service and a safe ride.'}
            </p>

            {/* Pre-set Tip Buttons (20, 50, 100 INR) & Custom Option */}
            <div className="grid grid-cols-4 gap-2">
              {presetTipAmounts.map(amt => {
                const isSelected = tip === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => handleSelectPresetTip(amt)}
                    className={`relative py-2.5 px-1 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center border shadow-2xs ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-1 shadow-md scale-102'
                        : 'border-emerald-200 bg-white text-slate-800 hover:bg-emerald-50 hover:border-emerald-400'
                    }`}
                  >
                    <span className="text-sm font-black flex items-center">
                      ₹{amt}
                    </span>
                    <span className={`text-[9px] font-medium mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {amt === 20 && (language === 'hi' ? 'चाय-नाश्ता' : 'Chai')}
                      {amt === 50 && (language === 'hi' ? 'लोकप्रिय' : 'Popular')}
                      {amt === 100 && (language === 'hi' ? 'उत्कृष्ट' : 'Superb')}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Custom Tip Amount Button */}
              <button
                onClick={() => {
                  setIsCustomTipOpen(!isCustomTipOpen);
                  if (!isCustomTipOpen && tip !== null && !presetTipAmounts.includes(tip)) {
                    setCustomTipValue(tip.toString());
                  }
                }}
                className={`py-2.5 px-1 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center border shadow-2xs ${
                  isCustomTipOpen || (tip !== null && !presetTipAmounts.includes(tip))
                    ? 'bg-emerald-700 border-emerald-800 text-white ring-2 ring-emerald-400 ring-offset-1 shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                <span className="text-xs font-extrabold">
                  {tip !== null && !presetTipAmounts.includes(tip) ? `₹${tip}` : (language === 'hi' ? 'अन्य' : 'Custom')}
                </span>
                <span className={`text-[9px] font-medium mt-0.5 ${(isCustomTipOpen || (tip !== null && !presetTipAmounts.includes(tip))) ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {language === 'hi' ? 'राशि डालें' : 'Enter ₹'}
                </span>
              </button>
            </div>

            {/* Custom Tip Input Drawer */}
            {isCustomTipOpen && (
              <div className="mt-2.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-300 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    placeholder={language === 'hi' ? 'राशि दर्ज करें (उदा. 30, 150)' : 'Enter amount (e.g. 30, 150)'}
                    value={customTipValue}
                    onChange={e => setCustomTipValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleApplyCustomTip();
                      }
                    }}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleApplyCustomTip}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-xs cursor-pointer active:scale-95"
                >
                  {language === 'hi' ? 'जोड़ें' : 'Apply'}
                </button>
                {tip !== null && !presetTipAmounts.includes(tip) && (
                  <button
                    onClick={() => {
                      setTip(null);
                      setCustomTipValue('');
                      setIsCustomTipOpen(false);
                      setShowTipAppreciation(false);
                    }}
                    className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                    title={language === 'hi' ? 'टिप हटाएं' : 'Remove tip'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Driver Appreciation Banner when tip is selected */}
            {tip !== null && tip > 0 && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center justify-between text-xs text-emerald-950 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">❤️</span>
                  <span className="font-semibold">
                    {language === 'hi' 
                      ? `${ride.driver.nameHi} को ₹${tip} बख्शीश जोड़ी गई! धन्यवाद!` 
                      : `₹${tip} tip added for ${ride.driver.name}! Thank you!`}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setTip(null);
                    setShowTipAppreciation(false);
                    setCustomTipValue('');
                  }}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer ml-2"
                >
                  {language === 'hi' ? 'हटाएं' : 'Remove'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={() => onCloseAndReset(tip || 0, rating)}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 cursor-pointer active:scale-98"
          >
            <span>
              {language === 'hi' 
                ? (tip ? `₹${totalPaid} भुगतान के साथ संपन्न करें` : 'अगली राइड बुक करें') 
                : (tip ? `Confirm & Done (₹${totalPaid})` : 'Book Another Ride')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
