import React, { useState } from 'react';
import { 
  Check, 
  Users, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { VehicleOption, VehicleTypeId, Language } from '../types';
import { VEHICLE_OPTIONS } from '../data/mockData';

interface VehicleSelectorProps {
  selectedVehicleId: VehicleTypeId;
  onSelectVehicle: (id: VehicleTypeId) => void;
  distanceKm: number;
  language: Language;
  discountPercentage?: number;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicleId,
  onSelectVehicle,
  distanceKm,
  language,
  discountPercentage = 0
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'rickshaw' | 'bike' | 'taxi' | 'delivery'>('all');

  const filteredVehicles = VEHICLE_OPTIONS.filter(v => {
    if (filterCategory === 'all') return true;
    return v.category === filterCategory;
  });

  // Calculate fare helper
  const calculateFare = (baseFare: number, ratePerKm: number) => {
    const rawFare = baseFare + (distanceKm * ratePerKm);
    const rounded = Math.round(rawFare);
    if (discountPercentage > 0) {
      const discounted = Math.max(20, Math.round(rounded * (1 - discountPercentage / 100)));
      return { original: rounded, final: discounted };
    }
    return { original: rounded, final: rounded };
  };

  return (
    <div className="w-full">
      {/* Category Filter Tabs with Emerald Green Theme */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', hi: 'सभी राइड', en: 'All Rides', emoji: '✨' },
          { id: 'rickshaw', hi: 'ऑटो रिक्शा', en: 'Rickshaws', emoji: '🛺' },
          { id: 'bike', hi: 'बाइक टैक्सी', en: 'Bikes', emoji: '🛵' },
          { id: 'taxi', hi: 'टैक्सी कैब', en: 'Taxis / Cabs', emoji: '🚗' },
          { id: 'delivery', hi: 'पार्सल', en: 'Parcel', emoji: '📦' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
              filterCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{language === 'hi' ? cat.hi : cat.en}</span>
          </button>
        ))}
      </div>

      {/* Vehicle Options List */}
      <div className="space-y-2.5 mt-2 max-h-[290px] sm:max-h-[340px] overflow-y-auto pr-1">
        {filteredVehicles.map(vehicle => {
          const isSelected = selectedVehicleId === vehicle.id;
          const { original, final } = calculateFare(vehicle.baseFare, vehicle.ratePerKm);

          return (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id)}
              className={`relative p-3 sm:p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50/60'
              }`}
            >
              {/* Badge if available */}
              {vehicle.badge && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-900 text-emerald-300 shadow-xs border border-emerald-700">
                  {language === 'hi' ? vehicle.badgeHi : vehicle.badge}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                
                {/* Left: Vehicle Icon & Details */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 transition ${
                    isSelected ? 'bg-emerald-200/60 text-emerald-950' : 'bg-slate-100'
                  }`}>
                    {vehicle.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {language === 'hi' ? vehicle.nameHi : vehicle.name}
                      </h4>
                      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        <Users className="w-3 h-3" />
                        <span>{vehicle.capacity}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
                      {language === 'hi' ? vehicle.taglineHi : vehicle.tagline}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-700" />
                        <span>{language === 'hi' ? `${vehicle.etaMinutes} मिनट दूर` : `${vehicle.etaMinutes} min away`}</span>
                      </span>

                      {vehicle.savingsText && (
                        <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/80 px-1.5 py-0.5 rounded-md">
                          {language === 'hi' ? vehicle.savingsTextHi : vehicle.savingsText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Price & Radio */}
                <div className="text-right shrink-0">
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg sm:text-xl font-black text-slate-900">
                        ₹{final}
                      </span>
                      {discountPercentage > 0 && original > final && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{original}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                      {language === 'hi' ? 'अनुमानित किराया' : 'Est. Fare'}
                    </span>
                  </div>

                  {/* Radio Indicator */}
                  <div className="mt-1 flex justify-end">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
