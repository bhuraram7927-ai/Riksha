import React, { useState } from 'react';
import { 
  X, 
  Car, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  IndianRupee, 
  Phone 
} from 'lucide-react';
import { Language } from '../types';

interface BecomeDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const BecomeDriverModal: React.FC<BecomeDriverModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [vehicleType, setVehicleType] = useState('auto');
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [registered, setRegistered] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Banner with Emerald Green Theme */}
        <div className="bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-800 p-5 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-800">
              {language === 'hi' ? 'ड्राइवर पार्टनर प्रोग्राम' : 'Driver Partner Program'}
            </span>
            <h3 className="text-lg font-black mt-1 text-white">
              {language === 'hi' ? 'रिक्शा या टैक्सी चलाएं, रोज़ ₹2000+ कमाएं' : 'Drive with Us & Earn ₹2000+/day'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {registered ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">
                {language === 'hi' ? 'आवेदन सफलतापूर्वक स्वीकार हुआ!' : 'Application Submitted!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {language === 'hi' 
                  ? 'रिक्शा ऐप टीम 24 घंटे के भीतर आपसे संपर्क करेगी और आपके वाहन का निःशुल्क VIP सत्यापन करेगी।' 
                  : 'Rickshaw App onboarding team will reach out within 24 hours for free VIP vehicle KYC.'}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
              >
                {language === 'hi' ? 'ठीक है (Done)' : 'Done'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Vehicle Type Choice */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {language === 'hi' ? 'आप क्या चलाते हैं?' : 'What do you drive?'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', hi: '🛺 ऑटो रिक्शा', en: 'Auto' },
                    { id: 'bike', hi: '🛵 बाइक', en: 'Bike' },
                    { id: 'taxi', hi: '🚗 कैब/टैक्सी', en: 'Taxi' },
                  ].map(item => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setVehicleType(item.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                        vehicleType === item.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/20'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {language === 'hi' ? item.hi : item.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'पूरा नाम (आधार कार्ड के अनुसार)' : 'Full Name (as per Aadhaar)'}
                </label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  placeholder="उदा. रमेश कुमार"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              {/* Vehicle Registration Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'गाड़ी नंबर (RC Plate)' : 'Vehicle Plate Number'}
                </label>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value)}
                  placeholder="उदा. DL 1RT 5590"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900 uppercase"
                />
              </div>

              {/* Perks list */}
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3 space-y-1.5 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'hi' ? 'रोज़ाना तुरंत बैंक खाते में कमाई (Daily Payout)' : 'Daily Bank Payouts'}</span>
                </div>
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? '₹5 लाख का मुफ़्त दुर्घटना बीमा' : '₹5 Lakhs Free Accidental Insurance'}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition active:scale-95 shadow-lg shadow-emerald-600/30"
              >
                {language === 'hi' ? 'सारथी के रूप में जुड़ें' : 'Register as Driver Partner'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
