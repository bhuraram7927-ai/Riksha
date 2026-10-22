import React from 'react';
import { 
  X, 
  History, 
  MapPin, 
  RotateCcw, 
  Star, 
  Receipt, 
  Calendar 
} from 'lucide-react';
import { PastTrip, Language } from '../types';

interface RideHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: PastTrip[];
  language: Language;
  onRebook: (trip: PastTrip) => void;
}

export const RideHistoryModal: React.FC<RideHistoryModalProps> = ({
  isOpen,
  onClose,
  trips,
  language,
  onRebook
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <History className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {language === 'hi' ? 'सफ़र का इतिहास (My Trips)' : 'Ride History'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trips List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {trips.map(trip => (
            <div 
              key={trip.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition shadow-2xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{trip.date}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{trip.fare}
                  </div>
                  {trip.tip && (
                    <div className="text-[10px] text-emerald-700 font-bold">
                      +{trip.tip} {language === 'hi' ? 'टिप' : 'Tip'}
                    </div>
                  )}
                </div>
              </div>

              {/* Route */}
              <div className="py-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">
                    {language === 'hi' ? trip.pickupHi : trip.pickup}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">
                    {language === 'hi' ? trip.dropHi : trip.drop}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">
                    {language === 'hi' ? trip.vehicleNameHi : trip.vehicleName}
                  </span>
                  <div className="flex items-center text-amber-500 font-bold gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{trip.rating}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRebook(trip);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold flex items-center gap-1 text-[11px] transition active:scale-95 border border-emerald-300"
                >
                  <RotateCcw className="w-3 h-3 text-emerald-700" />
                  <span>{language === 'hi' ? 'फिर से बुक करें' : 'Rebook'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
          >
            {language === 'hi' ? 'वापस जाएं' : 'Back to Home'}
          </button>
        </div>

      </div>
    </div>
  );
};
