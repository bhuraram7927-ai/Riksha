import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  MapPin, 
  ArrowUpDown, 
  Clock, 
  Navigation, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Wallet, 
  Tag, 
  ShieldAlert, 
  Phone, 
  MessageSquare, 
  Share2, 
  ChevronRight, 
  X, 
  Check, 
  AlertCircle,
  Play,
  RotateCcw,
  Calendar,
  CalendarClock,
  CalendarCheck,
  Zap,
  Sparkles,
  Info,
  Trash2
} from 'lucide-react';
import { 
  CityLocation, 
  VehicleTypeId, 
  VehicleOption, 
  PaymentMethod, 
  Coupon, 
  DriverInfo, 
  RideStatus, 
  Language, 
  ActiveRide,
  ScheduledRide
} from '../types';
import { VehicleSelector } from './VehicleSelector';
import { AVAILABLE_COUPONS } from '../data/mockData';

interface BookingBottomDrawerProps {
  pickup: CityLocation;
  drop: CityLocation;
  onOpenLocationSearch: (type: 'pickup' | 'drop') => void;
  onSwapLocations: () => void;
  selectedVehicleId: VehicleTypeId;
  onSelectVehicle: (id: VehicleTypeId) => void;
  selectedVehicle: VehicleOption;
  distanceKm: number;
  durationMins: number;
  rideStatus: RideStatus;
  activeRide: ActiveRide | null;
  onStartSearchDriver: () => void;
  onCancelRide: () => void;
  onCallDriver: () => void;
  onChatDriver: () => void;
  onOpenSafety: () => void;
  onShareRide: () => void;
  onSimulatePickupArrival: () => void;
  onSimulateCompleteTrip: () => void;
  language: Language;
  scheduledRides?: ScheduledRide[];
  onScheduleRide?: (ride: ScheduledRide) => void;
  onCancelScheduledRide?: (id: string) => void;
  onStartScheduledRideNow?: (ride: ScheduledRide) => void;
  onStartSelectOnMap?: (target: 'pickup' | 'drop') => void;
  onOpenPlayStore?: () => void;
}

export const BookingBottomDrawer: React.FC<BookingBottomDrawerProps> = ({
  pickup,
  drop,
  onOpenLocationSearch,
  onSwapLocations,
  selectedVehicleId,
  onSelectVehicle,
  selectedVehicle,
  distanceKm,
  durationMins,
  rideStatus,
  activeRide,
  onStartSearchDriver,
  onCancelRide,
  onCallDriver,
  onChatDriver,
  onOpenSafety,
  onShareRide,
  onSimulatePickupArrival,
  onSimulateCompleteTrip,
  language,
  scheduledRides = [],
  onScheduleRide,
  onCancelScheduledRide,
  onStartScheduledRideNow,
  onStartSelectOnMap,
  onOpenPlayStore
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(AVAILABLE_COUPONS[0]); // Default first ride coupon!
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // SCHEDULING STATE
  const [isScheduleMode, setIsScheduleMode] = useState(false);
  
  // Helpers for default date and time
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const dayAfterStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  // Default time 30 mins from now
  const defaultTimeStr = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 30);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>(defaultTimeStr);
  const [confirmedScheduledModal, setConfirmedScheduledModal] = useState<ScheduledRide | null>(null);

  // Quick time add helper
  const addMinutesToTime = (mins: number) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + mins);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    setSelectedTime(`${hh}:${mm}`);
    setSelectedDate(todayStr);
  };

  // Human readable date/time label
  const formattedScheduleLabel = useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    
    const d = new Date(year, (month || 1) - 1, day, hours, minutes);
    const isToday = selectedDate === todayStr;
    const isTomorrow = selectedDate === tomorrowStr;

    const timeString = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    let dateTextHi = `${day} ${['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'][(month || 1) - 1]}`;
    let dateTextEn = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    if (isToday) {
      dateTextHi = 'आज';
      dateTextEn = 'Today';
    } else if (isTomorrow) {
      dateTextHi = 'कल';
      dateTextEn = 'Tomorrow';
    }

    return {
      hi: `${dateTextHi}, ${timeString}`,
      en: `${dateTextEn}, ${timeString}`
    };
  }, [selectedDate, selectedTime, todayStr, tomorrowStr]);

  // Calculate final fare
  const rawFare = selectedVehicle.baseFare + (distanceKm * selectedVehicle.ratePerKm);
  const baseRounded = Math.round(rawFare);
  let discountAmt = 0;
  if (appliedCoupon) {
    discountAmt = Math.min(appliedCoupon.maxDiscount, Math.round(baseRounded * (appliedCoupon.discountPercentage / 100)));
  }
  const finalFare = Math.max(20, baseRounded - discountAmt);

  // Handle schedule confirmation
  const handleConfirmSchedule = () => {
    const newScheduled: ScheduledRide = {
      id: `sched_${Date.now()}`,
      pickup,
      drop,
      vehicle: selectedVehicle,
      fare: finalFare,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      displayDateTimeHi: formattedScheduleLabel.hi,
      displayDateTimeEn: formattedScheduleLabel.en,
      paymentMethod,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (onScheduleRide) {
      onScheduleRide(newScheduled);
    }
    setConfirmedScheduledModal(newScheduled);
    setIsScheduleMode(false);

    // Confetti celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Render Based on Ride Status
  return (
    <div className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-emerald-100 transition-all max-h-[85vh] overflow-y-auto z-30">
      
      {/* 1. SEARCHING DRIVER RADAR STATE */}
      {rideStatus === 'SEARCHING_DRIVER' && (
        <div className="p-6 text-center space-y-4">
          {/* Radar Animation with Emerald Theme */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-emerald-500/40 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/60 radar-spinner" />
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700 text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/40 z-10 text-white">
              {selectedVehicle.icon}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              {language === 'hi' 
                ? `${selectedVehicle.nameHi} की तलाश जारी है...` 
                : `Searching for nearby ${selectedVehicle.name}...`}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {language === 'hi' 
                ? 'आपके निकटतम चालकों को बुकिंग अनुरोध भेजा जा रहा है...' 
                : 'Pinging closest verified drivers within 2 km radius...'}
            </p>
          </div>

          {/* Quick Route Recap */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3 max-w-sm mx-auto text-left text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">
                {language === 'hi' ? pickup.nameHi : pickup.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">
                {language === 'hi' ? drop.nameHi : drop.name}
              </span>
            </div>
          </div>

          <button
            onClick={onCancelRide}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition active:scale-95"
          >
            {language === 'hi' ? 'खोज रद्द करें' : 'Cancel Search'}
          </button>
        </div>
      )}

      {/* 2. DRIVER ASSIGNED & COMING TO PICKUP */}
      {rideStatus === 'DRIVER_ASSIGNED' && activeRide && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Driver Card Header */}
          <div className="flex items-start justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeRide.driver.avatar}
                  alt={activeRide.driver.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                  ★ {activeRide.driver.rating}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-base text-slate-900">
                    {language === 'hi' ? activeRide.driver.nameHi : activeRide.driver.name}
                  </h4>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-sm">
                    {language === 'hi' ? 'सत्यापित सारथी' : 'Verified'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeRide.vehicle.name} • <span className="font-bold text-slate-900 font-mono">{activeRide.driver.vehiclePlate}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  {activeRide.driver.vehicleModel} ({activeRide.driver.vehicleColor})
                </p>
              </div>
            </div>

            {/* OTP Badge in Emerald Theme */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {language === 'hi' ? 'सुरक्षा OTP' : 'Start OTP'}
              </span>
              <span className="text-lg font-black text-emerald-800 tracking-wider bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl inline-block mt-0.5 shadow-xs">
                {activeRide.otp}
              </span>
            </div>
          </div>

          {/* Real-time Status Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center animate-pulse">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  {language === 'hi' ? 'ड्राइवर आपकी ओर आ रहा है' : 'Driver is on the way'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate block max-w-[200px]">
                  {language === 'hi' ? activeRide.currentStreetNameHi : activeRide.currentStreetName}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-emerald-900 block">
                {activeRide.driverEtaMins} {language === 'hi' ? 'मिनट' : 'mins'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                {activeRide.remainingDistanceKm} km दूर
              </span>
            </div>
          </div>

          {/* Action Buttons: Call, Chat, Safety */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onCallDriver}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'कॉल' : 'Call'}</span>
            </button>

            <button
              onClick={onChatDriver}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-200 relative"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'मैसेज' : 'Chat'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-2 right-2 animate-ping" />
            </button>

            <button
              onClick={onOpenSafety}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition active:scale-95 border border-emerald-200"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'सुरक्षा' : 'Safety'}</span>
            </button>
          </div>

          {/* Simulation Helper (For Preview / Testing) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {language === 'hi' ? 'ड्राइवर पहुँच गया?' : 'Driver arrived at pickup?'}
            </span>
            <button
              onClick={onSimulatePickupArrival}
              className="py-1 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>{language === 'hi' ? 'सफ़र शुरू करें (Start Ride)' : 'Board & Start Ride'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. RIDE IN PROGRESS (ON THE ROAD) */}
      {rideStatus === 'RIDE_IN_PROGRESS' && activeRide && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Progress Header in Emerald Luxury Theme */}
          <div className="bg-linear-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/60 text-white p-4 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {language === 'hi' ? 'सफ़र जारी है...' : 'Trip in Progress...'}
              </span>
              <span className="text-xs font-black text-emerald-300 bg-emerald-900/60 border border-emerald-700 px-2 py-0.5 rounded-full">
                {activeRide.currentSpeedKmH} km/h
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-white">
                  {activeRide.durationMins} <span className="text-sm font-semibold text-emerald-200">{language === 'hi' ? 'मिनट शेष' : 'mins remaining'}</span>
                </span>
                <p className="text-xs text-emerald-300/90 truncate max-w-[220px] mt-0.5">
                  {language === 'hi' ? activeRide.currentStreetNameHi : activeRide.currentStreetName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-300 font-bold block">
                  {activeRide.remainingDistanceKm} km
                </span>
                <span className="text-[10px] text-slate-400">
                  {language === 'hi' ? 'मंज़िल की दूरी' : 'to Destination'}
                </span>
              </div>
            </div>

            {/* Live Progress Bar with Emerald Glow */}
            <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden border border-emerald-900/40">
              <div 
                className="bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-300 shadow-xs shadow-emerald-400"
                style={{ width: `${Math.max(5, activeRide.progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Driver mini bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={activeRide.driver.avatar}
                alt={activeRide.driver.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500 shadow-2xs"
              />
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">
                  {language === 'hi' ? activeRide.driver.nameHi : activeRide.driver.name}
                </h5>
                <span className="text-[11px] text-slate-500 font-mono font-bold">
                  {activeRide.driver.vehiclePlate}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onCallDriver}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                title="कॉल करें"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                onClick={onOpenSafety}
                className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
                title="सुरक्षा कवच"
              >
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>

          {/* Simulate Arrival button */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {language === 'hi' ? 'डेस्टिनेशन पर पहुँच गए?' : 'Reached destination?'}
            </span>
            <button
              onClick={onSimulateCompleteTrip}
              className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold transition flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सफ़र समाप्त करें' : 'Arrived / Finish'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. IDLE / SELECTION STATE (BEFORE BOOKING OR SCHEDULING) */}
      {(rideStatus === 'IDLE' || rideStatus === 'SELECTING_VEHICLE' || rideStatus === 'CONFIRMING') && (
        <div className="p-4 sm:p-5 space-y-3.5">

          {/* ACTIVE SCHEDULED RIDE BANNER IF EXISTS */}
          {scheduledRides.length > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      {language === 'hi' ? 'आगामी शेड्यूल्ड राइड' : 'Upcoming Scheduled Ride'}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900">
                      {language === 'hi' ? scheduledRides[0].displayDateTimeHi : scheduledRides[0].displayDateTimeEn}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-emerald-800">
                    ₹{scheduledRides[0].fare}
                  </span>
                  {onCancelScheduledRide && (
                    <button
                      onClick={() => onCancelScheduledRide(scheduledRides[0].id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title={language === 'hi' ? 'शेड्यूल रद्द करें' : 'Cancel Schedule'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span className="truncate max-w-[200px]">
                  {scheduledRides[0].vehicle.name} • {language === 'hi' ? scheduledRides[0].drop.nameHi : scheduledRides[0].drop.name}
                </span>
                {onStartScheduledRideNow && (
                  <button
                    onClick={() => onStartScheduledRideNow(scheduledRides[0])}
                    className="font-extrabold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {language === 'hi' ? 'अभी बुक करें →' : 'Ride Now →'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RIDE MODE TOGGLE: RIDE NOW vs SCHEDULE FOR LATER */}
          <div className="flex items-center p-1 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 shadow-2xs">
            <button
              onClick={() => setIsScheduleMode(false)}
              className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !isScheduleMode
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'तुरंत चलें (Ride Now)' : 'Ride Now'}</span>
            </button>

            <button
              onClick={() => setIsScheduleMode(true)}
              className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isScheduleMode
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/50'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? 'शेड्यूल करें (Schedule)' : 'Schedule Ride'}</span>
            </button>
          </div>
          
          {/* Pickup & Drop Location Selectors */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-2.5 space-y-2">
            
            {/* Pickup row */}
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onOpenLocationSearch('pickup')}
                className="flex-1 flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition min-w-0"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {language === 'hi' ? 'पिकअप स्थान (Pickup)' : 'Pickup Location'}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                    {language === 'hi' ? pickup.nameHi : pickup.name}
                  </div>
                </div>
              </div>

              {onStartSelectOnMap && (
                <button
                  type="button"
                  onClick={() => onStartSelectOnMap('pickup')}
                  className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black flex items-center gap-1 transition active:scale-95 cursor-pointer shrink-0 mr-8"
                  title={language === 'hi' ? 'मैप पर चुनें' : 'Select on map'}
                >
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'hi' ? 'मैप' : 'Map'}</span>
                </button>
              )}
            </div>

            {/* Divider line */}
            <div className="h-px bg-slate-200 ml-7" />

            {/* Drop row */}
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onOpenLocationSearch('drop')}
                className="flex-1 flex items-center gap-3 p-2 rounded-xl hover:bg-white cursor-pointer transition min-w-0"
              >
                <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {language === 'hi' ? 'गंतव्य / कहाँ जाना है? (Drop)' : 'Destination (Where to?)'}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                    {language === 'hi' ? drop.nameHi : drop.name}
                  </div>
                </div>
              </div>

              {onStartSelectOnMap && (
                <button
                  type="button"
                  onClick={() => onStartSelectOnMap('drop')}
                  className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black flex items-center gap-1 transition active:scale-95 cursor-pointer shrink-0 mr-8"
                  title={language === 'hi' ? 'मैप पर चुनें' : 'Select on map'}
                >
                  <MapPin className="w-3 h-3 text-rose-600" />
                  <span>{language === 'hi' ? 'मैप' : 'Map'}</span>
                </button>
              )}
            </div>

            {/* Swap Button */}
            <button
              onClick={onSwapLocations}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 flex items-center justify-center transition active:scale-90"
              title="स्थान बदलें"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Route Distance & Travel Info Pill in Emerald Theme */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-xs font-semibold text-emerald-950">
            <div className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>{distanceKm} km</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>~{durationMins} {language === 'hi' ? 'मिनट' : 'mins'}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/70 px-2 py-0.5 rounded-md">
              {language === 'hi' ? 'सटीक GPS रूट' : 'Optimized Route'}
            </span>
          </div>

          {/* DEDICATED DATE & TIME PICKER SECTION (WHEN SCHEDULE MODE IS ACTIVE) */}
          {isScheduleMode && (
            <div className="p-3.5 rounded-2xl bg-linear-to-br from-emerald-50 via-teal-50/40 to-white border-2 border-emerald-400 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'सवारी का दिनांक और समय तय करें' : 'Pick Date & Time for Ride'}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {language === 'hi' ? 'शेड्यूलिंग गारंटी' : 'Guaranteed Pickup'}
                </span>
              </div>

              {/* Date Presets + HTML5 Date Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {language === 'hi' ? 'तारीख (Date):' : 'Date:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(todayStr)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedDate === todayStr
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    {language === 'hi' ? 'आज (Today)' : 'Today'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(tomorrowStr)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedDate === tomorrowStr
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    {language === 'hi' ? 'कल (Tomorrow)' : 'Tomorrow'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(dayAfterStr)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedDate === dayAfterStr
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    {language === 'hi' ? 'परसों (Day 3)' : 'Day After'}
                  </button>
                </div>

                {/* Specific Date input */}
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Time Presets + HTML5 Time Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {language === 'hi' ? 'पिकअप समय (Pickup Time):' : 'Pickup Time:'}
                </label>
                
                {/* Quick time additions */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {[
                    { label: '+15 min', mins: 15 },
                    { label: '+30 min', mins: 30 },
                    { label: '+1 hr', mins: 60 },
                    { label: '+2 hrs', mins: 120 }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.label}
                      onClick={() => addMinutesToTime(t.mins)}
                      className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Specific Time input */}
                <div className="relative">
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Selected Schedule Callout */}
              <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-extrabold block">
                    {language === 'hi' ? `शेड्यूल: ${formattedScheduleLabel.hi}` : `Scheduled: ${formattedScheduleLabel.en}`}
                  </span>
                  <span className="text-[10.5px] text-emerald-800 block mt-0.5">
                    {language === 'hi' 
                      ? '✓ पिकअप से 10 मिनट पहले ड्राइवर की जानकारी व लाइव ट्रैकिंग चालू हो जाएगी।' 
                      : '✓ Driver details & live GPS tracking will be assigned 10 mins prior.'}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* Vehicle Selector (Auto Rickshaw, E-Rickshaw, Bike Taxi, Cab) */}
          <VehicleSelector
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={onSelectVehicle}
            distanceKm={distanceKm}
            language={language}
            discountPercentage={appliedCoupon?.discountPercentage || 0}
          />

          {/* Payment Method & Coupon Row */}
          <div className="pt-1 flex items-center justify-between gap-2 text-xs">
            {/* Payment Selector Pill */}
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50/80 border border-slate-200 text-slate-800 font-bold transition active:scale-95 shrink-0"
            >
              {paymentMethod === 'cash' && <Banknote className="w-4 h-4 text-emerald-600" />}
              {paymentMethod === 'upi' && <QrCode className="w-4 h-4 text-emerald-600" />}
              {paymentMethod === 'wallet' && <Wallet className="w-4 h-4 text-emerald-700" />}
              {paymentMethod === 'card' && <CreditCard className="w-4 h-4 text-emerald-600" />}
              <span className="uppercase text-[11px]">{paymentMethod}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            {/* Coupon Code Pill */}
            <button
              onClick={() => setShowCouponModal(true)}
              className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition active:scale-95 truncate ${
                appliedCoupon
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {appliedCoupon 
                    ? `${appliedCoupon.code} (-₹${discountAmt})` 
                    : (language === 'hi' ? 'कूपन कोड लगाएं' : 'Apply Coupon')}
                </span>
              </div>
              {appliedCoupon && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
            </button>
          </div>

          {/* Primary Action Button (Dynamic for Ride Now vs Schedule) */}
          {!isScheduleMode ? (
            <button
              onClick={onStartSearchDriver}
              className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedVehicle.icon}</span>
                <span>
                  {language === 'hi' 
                    ? `${selectedVehicle.nameHi} तुरंत बुक करें` 
                    : `Book ${selectedVehicle.name} Now`}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-lg">₹{finalFare}</span>
                {discountAmt > 0 && (
                  <span className="text-xs text-emerald-200 line-through">₹{baseRounded}</span>
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={handleConfirmSchedule}
              className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-700/30 transition-all active:scale-[0.98] flex items-center justify-between cursor-pointer border border-emerald-400"
            >
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="truncate">
                  {language === 'hi' 
                    ? `📅 ${formattedScheduleLabel.hi} के लिए शेड्यूल करें` 
                    : `📅 Schedule for ${formattedScheduleLabel.en}`}
                </span>
              </div>

              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-base sm:text-lg">₹{finalFare}</span>
              </div>
            </button>
          )}

          {/* Google Play Store Banner */}
          {onOpenPlayStore && (
            <div 
              onClick={onOpenPlayStore}
              className="p-3 bg-linear-to-r from-slate-900 to-emerald-950 rounded-2xl border border-emerald-500/30 text-white flex items-center justify-between cursor-pointer hover:border-emerald-400 transition shadow-sm active:scale-[0.99] group mt-1"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center p-1.5 border border-slate-700 shadow-xs shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 512 512">
                    <path fill="#00E676" d="M380.9 220.4l-75.7-43.7L76.5 40.5c-6.8-3.9-14.8-4.7-22.3-2.1l251 251 75.7-69z"/>
                    <path fill="#FFD600" d="M380.9 291.6L305.2 335.3 54.2 473.6c7.5 2.6 15.5 1.8 22.3-2.1l228.7-136.2 75.7-43.7z"/>
                    <path fill="#00B0FF" d="M54.2 38.4C44.4 44 38.4 54.7 38.4 67.2v377.6c0 12.5 6 23.2 15.8 28.8L305.2 256 54.2 38.4z"/>
                    <path fill="#FF3D00" d="M473.6 238.4l-92.7-53.5-75.7 71.1 75.7 71.1 92.7-53.5c19.2-11.1 19.2-34.1 0-45.2z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-xs text-white truncate">
                      {language === 'hi' ? 'प्ले स्टोर ऐप (Play Store)' : 'Google Play Store App'}
                    </span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded">
                      4.8 ★
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">
                    {language === 'hi' ? 'फोन में डाउनलोड करें • 1M+ डाउनलोड्स' : 'Download for Phone • 1M+ Downloads'}
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-[#01875f] group-hover:bg-[#02976b] text-white text-xs font-black transition shrink-0 ml-2">
                {language === 'hi' ? 'इंस्टॉल' : 'Install'}
              </div>
            </div>
          )}

        </div>
      )}

      {/* SCHEDULED RIDE CONFIRMED SUCCESS MODAL */}
      {confirmedScheduledModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border border-emerald-200 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CalendarCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {language === 'hi' ? 'सवारी शेड्यूल्ड' : 'Ride Scheduled'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1.5">
                {language === 'hi' ? 'सवारी सफलतापूर्वक शेड्यूल हुई!' : 'Ride Scheduled Successfully!'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {language === 'hi' 
                  ? `आपकी ${confirmedScheduledModal.vehicle.nameHi} को ${confirmedScheduledModal.displayDateTimeHi} के लिए आरक्षित कर दिया गया है।` 
                  : `Your ${confirmedScheduledModal.vehicle.name} has been booked for ${confirmedScheduledModal.displayDateTimeEn}.`}
              </p>
            </div>

            {/* Trip Recap Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-800">
                <span>{language === 'hi' ? 'तारीख व समय:' : 'Scheduled For:'}</span>
                <span className="text-emerald-800 font-extrabold">{confirmedScheduledModal.displayDateTimeEn}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800">
                <span>{language === 'hi' ? 'वाहन व अनुमानित किराया:' : 'Vehicle & Fare:'}</span>
                <span className="text-emerald-700 font-black">{confirmedScheduledModal.vehicle.name} • ₹{confirmedScheduledModal.fare}</span>
              </div>
              <div className="h-px bg-emerald-200/60 my-1" />
              <div className="space-y-1 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate">{language === 'hi' ? pickup.nameHi : pickup.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="truncate">{language === 'hi' ? drop.nameHi : drop.name}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl">
              {language === 'hi' 
                ? '🔔 पिकअप से 10 मिनट पहले आपको ड्राइवर का नाम, मोबाइल नंबर और गाड़ी नंबर का SMS व नोटिफिकेशन प्राप्त होगा।' 
                : '🔔 You will receive driver contact, plate number, and live tracking 10 mins before pickup.'}
            </div>

            <button
              onClick={() => setConfirmedScheduledModal(null)}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              {language === 'hi' ? 'समझ गया, धन्यवाद (Done)' : 'Got it, Done'}
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT METHOD SELECTION MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-3 shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <h4 className="font-extrabold text-sm text-slate-900">
                {language === 'hi' ? 'भुगतान का तरीका चुनें' : 'Select Payment Method'}
              </h4>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {[
              { id: 'cash', titleHi: 'नकद (Cash to Driver)', titleEn: 'Cash to Driver', icon: <Banknote className="w-5 h-5 text-emerald-600" /> },
              { id: 'upi', titleHi: 'UPI (GPay, PhonePe, Paytm, QR)', titleEn: 'UPI (GPay, PhonePe, QR)', icon: <QrCode className="w-5 h-5 text-emerald-600" /> },
              { id: 'wallet', titleHi: 'रिक्शा वॉलेट (Rickshaw Wallet)', titleEn: 'Rickshaw Wallet (₹250)', icon: <Wallet className="w-5 h-5 text-emerald-700" /> },
              { id: 'card', titleHi: 'क्रेडिट / डेबिट कार्ड', titleEn: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5 text-emerald-600" /> },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => {
                  setPaymentMethod(method.id as PaymentMethod);
                  setShowPaymentModal(false);
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                  paymentMethod === method.id
                    ? 'border-emerald-500 bg-emerald-50/90 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center border border-slate-100">
                    {method.icon}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      {language === 'hi' ? method.titleHi : method.titleEn}
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {method.id === 'cash' ? 'सफर के अंत में भुगतान करें' : 'त्वरित और सुरक्षित डिजिटल भुगतान'}
                    </span>
                  </div>
                </div>

                {paymentMethod === method.id && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COUPONS SELECTION MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-3 shadow-2xl max-h-[80vh] flex flex-col border border-emerald-100">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <h4 className="font-extrabold text-sm text-slate-900">
                {language === 'hi' ? 'कूपन और छूट ऑफर' : 'Available Promo Codes'}
              </h4>
              <button 
                onClick={() => setShowCouponModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 py-1">
              {AVAILABLE_COUPONS.map(coupon => (
                <div
                  key={coupon.code}
                  className="p-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs font-mono px-2 py-0.5 rounded-lg bg-emerald-700 text-white tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => {
                        setAppliedCoupon(coupon);
                        setShowCouponModal(false);
                      }}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition cursor-pointer"
                    >
                      {appliedCoupon?.code === coupon.code 
                        ? (language === 'hi' ? 'लागू है' : 'Applied') 
                        : (language === 'hi' ? 'लागू करें' : 'Apply')}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    {language === 'hi' ? coupon.descriptionHi : coupon.description}
                  </p>
                </div>
              ))}
            </div>

            {appliedCoupon && (
              <button
                onClick={() => {
                  setAppliedCoupon(null);
                  setShowCouponModal(false);
                }}
                className="w-full py-2 text-center text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                {language === 'hi' ? 'कूपन हटाएं' : 'Remove Coupon'}
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
