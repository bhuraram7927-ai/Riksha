import React, { useState } from 'react';
import { 
  X, 
  Search, 
  MapPin, 
  Navigation, 
  Train, 
  Plane, 
  Building2, 
  Home, 
  Briefcase, 
  Bus, 
  HeartPulse, 
  Sparkles,
  Map as MapIcon,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { CityLocation, Language } from '../types';
import { CITY_LOCATIONS } from '../data/mockData';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'pickup' | 'drop';
  currentPickup: CityLocation;
  currentDrop: CityLocation;
  onSelectLocation: (loc: CityLocation, type: 'pickup' | 'drop') => void;
  onStartSelectOnMap: (type: 'pickup' | 'drop') => void;
  language: Language;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  targetType,
  currentPickup,
  currentDrop,
  onSelectLocation,
  onStartSelectOnMap,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'pickup' | 'drop'>(targetType);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Filter locations by search query and category
  const filteredLocations = CITY_LOCATIONS.filter(loc => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.nameHi.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q) ||
      loc.addressHi.toLowerCase().includes(q);

    if (categoryFilter === 'all') return matchesSearch;
    return matchesSearch && loc.category === categoryFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home': return <Home className="w-4 h-4 text-emerald-600" />;
      case 'work': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'station': return <Train className="w-4 h-4 text-amber-600" />;
      case 'airport': return <Plane className="w-4 h-4 text-sky-600" />;
      case 'metro': return <Train className="w-4 h-4 text-purple-600" />;
      case 'mall': return <Building2 className="w-4 h-4 text-pink-600" />;
      case 'hospital': return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'bus': return <Bus className="w-4 h-4 text-amber-700" />;
      default: return <MapPin className="w-4 h-4 text-emerald-600" />;
    }
  };

  // Quick hint suggestions for direct one-tap selection
  const quickHints = [
    { id: 'loc_home', hi: '🏠 घर (Home)', en: '🏠 Home' },
    { id: 'loc_work', hi: '💼 दफ़्तर (Work)', en: '💼 Work' },
    { id: 'loc_station', hi: '🚉 सेंट्रल स्टेशन', en: '🚉 Central Station' },
    { id: 'loc_airport', hi: '✈️ एयरपोर्ट T3', en: '✈️ Airport T3' },
    { id: 'loc_metro', hi: '🚇 राजीव चौक', en: '🚇 Rajiv Chowk' },
    { id: 'loc_market', hi: '🛍️ सिटी मॉल', en: '🛍️ City Mall' },
    { id: 'loc_hospital', hi: '🏥 एम्स AIIMS', en: '🏥 AIIMS' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-emerald-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100/80 flex items-center justify-between bg-linear-to-r from-emerald-50/70 via-white to-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {language === 'hi' 
                  ? (activeTab === 'pickup' ? 'पिकअप स्थान चुनें' : 'मंजिल / ड्रॉप स्थान चुनें') 
                  : (activeTab === 'pickup' ? 'Choose Pickup Point' : 'Choose Drop Destination')}
              </h3>
              <p className="text-[11px] font-bold text-emerald-800">
                {language === 'hi' ? 'सटीक लोकेशन और आसान नेविगेशन' : 'Accurate location & smooth booking'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pickup / Drop Tab Switcher */}
        <div className="px-4 pt-3 flex gap-2">
          <button
            onClick={() => setActiveTab('pickup')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pickup'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
            <span>{language === 'hi' ? '1. पिकअप (Pickup)' : '1. Pickup Point'}</span>
          </button>

          <button
            onClick={() => setActiveTab('drop')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'drop'
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-200" />
            <span>{language === 'hi' ? '2. ड्रॉप (Drop)' : '2. Drop Point'}</span>
          </button>
        </div>

        {/* Search input bar & Action Buttons */}
        <div className="p-4 space-y-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-emerald-600 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'स्थान खोजें (उदा. स्टेशन, AIIMS, साइबर हब, एयरपोर्ट)...' : 'Search location (Station, AIIMS, Metro, Airport)...'}
              className="w-full pl-11 pr-10 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* TWO PRIMARY SHORTCUTS: SELECT ON MAP + LIVE GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* 1. SELECT ON MAP BUTTON (Prominent user request!) */}
            <button
              onClick={() => {
                onStartSelectOnMap(activeTab);
                onClose();
              }}
              className="p-2.5 rounded-xl bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-extrabold text-xs flex items-center justify-between shadow-md shadow-emerald-700/25 transition active:scale-[0.98] cursor-pointer border border-emerald-500"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <MapIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <span>{language === 'hi' ? 'मैप पर पिन रखकर चुनें' : 'Select on Interactive Map'}</span>
              </div>
              <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-md font-black">
                {language === 'hi' ? 'मैप मोड' : 'Map Mode'} →
              </span>
            </button>

            {/* 2. LIVE GPS BUTTON */}
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      const customLoc: CityLocation = {
                        id: `loc_live_gps_${Date.now()}`,
                        name: `My GPS Location (±${Math.round(pos.coords.accuracy)}m)`,
                        nameHi: `मेरा लाइव GPS स्थान (±${Math.round(pos.coords.accuracy)}m)`,
                        address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
                        addressHi: `सटीक लाइव GPS स्थान`,
                        x: 380,
                        y: 420,
                        category: 'popular'
                      };
                      onSelectLocation(customLoc, activeTab);
                      onClose();
                    },
                    () => {
                      onSelectLocation(CITY_LOCATIONS[0], activeTab);
                      onClose();
                    },
                    { timeout: 4000 }
                  );
                } else {
                  onSelectLocation(CITY_LOCATIONS[0], activeTab);
                  onClose();
                }
              }}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 border border-emerald-300 flex items-center justify-between text-xs font-bold transition active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-700 animate-pulse" />
                <span>{language === 'hi' ? 'वर्तमान GPS स्थान' : 'Use Current GPS'}</span>
              </div>
              <span className="text-[10px] text-emerald-900 bg-emerald-200/90 px-1.5 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>GPS</span>
              </span>
            </button>
          </div>

          {/* QUICK LOCATION HINTS (1-TAP CHIPS) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{language === 'hi' ? 'त्वरित स्थान हिंट्स (Quick Hints):' : 'Location Hints (Quick Pick):'}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickHints.map(hint => {
                const targetLoc = CITY_LOCATIONS.find(l => l.id === hint.id);
                return (
                  <button
                    key={hint.id}
                    onClick={() => {
                      if (targetLoc) {
                        onSelectLocation(targetLoc, activeTab);
                        if (activeTab === 'pickup') {
                          setActiveTab('drop');
                        } else {
                          onClose();
                        }
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 whitespace-nowrap transition active:scale-95 cursor-pointer shadow-2xs"
                  >
                    {language === 'hi' ? hint.hi : hint.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-slate-100">
            {[
              { id: 'all', hi: 'सभी स्थान', en: 'All' },
              { id: 'home', hi: '🏠 घर', en: 'Home' },
              { id: 'work', hi: '💼 दफ़्तर', en: 'Work' },
              { id: 'station', hi: '🚉 रेलवे', en: 'Train' },
              { id: 'metro', hi: '🚇 मेट्रो', en: 'Metro' },
              { id: 'airport', hi: '✈️ हवाई अड्डा', en: 'Airport' },
              { id: 'mall', hi: '🛍️ मॉल व बाजार', en: 'Mall' },
              { id: 'hospital', hi: '🏥 अस्पताल', en: 'Hospital' },
              { id: 'bus', hi: '🚌 बस स्टैंड', en: 'Bus' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'hi' ? cat.hi : cat.en}
              </button>
            ))}
          </div>
        </div>

        {/* Location List (Suggestions & Hints) */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 divide-y divide-slate-100">
          {filteredLocations.map(loc => {
            const isSelected = 
              (activeTab === 'pickup' && currentPickup.id === loc.id) ||
              (activeTab === 'drop' && currentDrop.id === loc.id);

            return (
              <div
                key={loc.id}
                onClick={() => {
                  onSelectLocation(loc, activeTab);
                  if (activeTab === 'pickup') {
                    setActiveTab('drop');
                  } else {
                    onClose();
                  }
                }}
                className={`pt-2.5 pb-2 px-3 rounded-2xl flex items-start gap-3 cursor-pointer transition ${
                  isSelected 
                    ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-xs' 
                    : 'hover:bg-emerald-50/50 border border-transparent'
                }`}
              >
                <div className="mt-1 w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  {getCategoryIcon(loc.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">
                      {language === 'hi' ? loc.nameHi : loc.name}
                    </h4>
                    {isSelected ? (
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'hi' ? 'चयनित' : 'Selected'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
                        {activeTab === 'pickup' ? (language === 'hi' ? 'पिकअप चुनें' : 'Pickup') : (language === 'hi' ? 'ड्रॉप चुनें' : 'Drop')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate font-medium">
                    {language === 'hi' ? loc.addressHi : loc.address}
                  </p>
                </div>
              </div>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-sm font-semibold">
                {language === 'hi' ? 'कोई स्थान नहीं मिला' : 'No matching locations found'}
              </p>
              <button
                onClick={() => {
                  onStartSelectOnMap(activeTab);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'मैप पर पिन द्वारा चुनें' : 'Pin on Map Instead'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Done / Close bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={() => {
              onStartSelectOnMap(activeTab);
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <MapIcon className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'मैप पर चुनें' : 'Select on Map'}</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition shadow-md shadow-emerald-700/30 cursor-pointer"
          >
            {language === 'hi' ? 'पुष्टि करें (Done)' : 'Confirm'}
          </button>
        </div>

      </div>
    </div>
  );
};
