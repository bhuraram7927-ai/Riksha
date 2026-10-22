/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CityLocation, 
  VehicleTypeId, 
  RideStatus, 
  ActiveRide, 
  DriverInfo, 
  Language, 
  PastTrip,
  ScheduledRide 
} from './types';
import { 
  CITY_LOCATIONS, 
  VEHICLE_OPTIONS, 
  MOCK_DRIVERS, 
  INITIAL_PAST_TRIPS 
} from './data/mockData';
import { 
  calculateDistanceKm, 
  calculateDurationMins, 
  generateRouteWaypoints, 
  getPositionAlongPath, 
  getStreetNameForProgress,
  resolveAddressFromCoords,
  Point 
} from './utils/routeUtils';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { BookingBottomDrawer } from './components/BookingBottomDrawer';
import { LocationSearchModal } from './components/LocationSearchModal';
import { CallDriverModal } from './components/CallDriverModal';
import { ChatDriverModal } from './components/ChatDriverModal';
import { TripCompletedModal } from './components/TripCompletedModal';
import { SafetyModal } from './components/SafetyModal';
import { RideHistoryModal } from './components/RideHistoryModal';
import { BecomeDriverModal } from './components/BecomeDriverModal';
import { PlayStoreModal } from './components/PlayStoreModal';

export default function App() {
  // 1. Language state: Hindi by default, toggleable to English
  const [language, setLanguage] = useState<Language>('hi');

  // 2. Location States
  const [pickup, setPickup] = useState<CityLocation>(CITY_LOCATIONS[0]); // Railway station
  const [drop, setDrop] = useState<CityLocation>(CITY_LOCATIONS[1]);     // Mall

  // 3. Vehicle selection
  const [selectedVehicleId, setSelectedVehicleId] = useState<VehicleTypeId>('auto');

  // 4. Wallet Balance & Past Trips
  const [walletBalance, setWalletBalance] = useState(450);
  const [pastTrips, setPastTrips] = useState<PastTrip[]>(INITIAL_PAST_TRIPS);

  // 5. Ride Status & Active Ride
  const [rideStatus, setRideStatus] = useState<RideStatus>('IDLE');
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

  // 6. Live Simulation & GPS States
  const [driverPosition, setDriverPosition] = useState<Point>({ x: 350, y: 410 });
  const [driverHeading, setDriverHeading] = useState<number>(0);
  const [simulationProgress, setSimulationProgress] = useState<number>(0); // 0 to 1
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState<number>(1); // 1x, 2x, 4x
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 7. Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchTarget, setLocationSearchTarget] = useState<'pickup' | 'drop'>('drop');
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>([]);

  // 8. Select on Map state
  const [mapSelectionMode, setMapSelectionMode] = useState<{
    active: boolean;
    target: 'pickup' | 'drop';
    currentCoords: { x: number; y: number };
  } | null>(null);

  // Start map selection mode
  const handleStartSelectOnMap = (target: 'pickup' | 'drop') => {
    const coords = target === 'pickup' ? { x: pickup.x, y: pickup.y } : { x: drop.x, y: drop.y };
    setMapSelectionMode({
      active: true,
      target,
      currentCoords: coords
    });
    setIsLocationModalOpen(false);
  };

  // Tap/click on map to move selection pin
  const handleSelectMapLocation = (coords: { x: number; y: number }) => {
    if (mapSelectionMode?.active) {
      setMapSelectionMode(prev => prev ? { ...prev, currentCoords: coords } : null);
    }
  };

  // Confirm map location
  const handleConfirmMapSelection = (coords: { x: number; y: number }) => {
    if (!mapSelectionMode) return;
    const resolved = resolveAddressFromCoords(coords, CITY_LOCATIONS);
    if (mapSelectionMode.target === 'pickup') {
      setPickup(resolved);
    } else {
      setDrop(resolved);
    }
    setMapSelectionMode(null);
  };

  // Cancel map selection
  const handleCancelMapSelection = () => {
    setMapSelectionMode(null);
  };

  // Calculate distance & duration for current pickup and drop
  const distanceKm = useMemo(() => calculateDistanceKm(pickup, drop), [pickup, drop]);
  const durationMins = useMemo(() => calculateDurationMins(distanceKm, selectedVehicleId), [distanceKm, selectedVehicleId]);

  // Selected vehicle object
  const selectedVehicle = useMemo(() => {
    return VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId) || VEHICLE_OPTIONS[0];
  }, [selectedVehicleId]);

  // Generate realistic route waypoints between pickup and drop
  const tripWaypoints = useMemo(() => {
    return generateRouteWaypoints(pickup, drop, 24);
  }, [pickup, drop]);

  // Waypoints for driver approaching pickup
  const [driverApproachWaypoints, setDriverApproachWaypoints] = useState<Point[]>([]);

  // START BOOKING FLOW -> SEARCH DRIVERS
  const handleStartSearchDriver = () => {
    setRideStatus('SEARCHING_DRIVER');

    // Simulate finding a nearby verified driver after 2.4 seconds
    setTimeout(() => {
      const matchedDriver = MOCK_DRIVERS.find(d => d.vehicleTypeId === selectedVehicleId) || MOCK_DRIVERS[0];

      // Assign initial driver coordinates near pickup
      const startPoint: Point = {
        x: pickup.x + (Math.random() > 0.5 ? 95 : -95),
        y: pickup.y + (Math.random() > 0.5 ? 85 : -85)
      };

      const approachPoints = generateRouteWaypoints(startPoint, pickup, 16);
      setDriverApproachWaypoints(approachPoints);
      setDriverPosition(startPoint);

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const initialEtaSecs = 180; // 3 minutes

      const street = getStreetNameForProgress(0.05, true);

      const newRide: ActiveRide = {
        id: `ride_${Date.now()}`,
        pickup,
        drop,
        vehicle: selectedVehicle,
        driver: matchedDriver,
        otp,
        distanceKm,
        durationMins,
        baseFare: selectedVehicle.baseFare,
        distanceFare: Math.round(distanceKm * selectedVehicle.ratePerKm),
        discount: 25,
        tax: 5,
        totalFare: Math.max(20, Math.round(selectedVehicle.baseFare + distanceKm * selectedVehicle.ratePerKm - 25)),
        paymentMethod: 'cash',
        status: 'DRIVER_ASSIGNED',
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        progressPercent: 0,
        driverEtaMins: 3,
        etaSeconds: initialEtaSecs,
        remainingDistanceKm: 1.2,
        currentSpeedKmH: 28,
        currentStreetName: street.en,
        currentStreetNameHi: street.hi
      };

      setActiveRide(newRide);
      setRideStatus('DRIVER_ASSIGNED');
      setSimulationProgress(0);
    }, 2400);
  };

  // REAL-TIME GPS SIMULATION ENGINE
  useEffect(() => {
    if (isPaused) return;

    if (rideStatus === 'DRIVER_ASSIGNED') {
      // Driver moving towards pickup point
      const intervalMs = Math.max(100, Math.round(600 / simulationSpeedMultiplier));

      const interval = setInterval(() => {
        setSimulationProgress(prev => {
          const step = 0.035 * simulationSpeedMultiplier;
          const next = prev + step;

          if (driverApproachWaypoints.length > 0) {
            const { point, heading } = getPositionAlongPath(driverApproachWaypoints, Math.min(1, next));
            setDriverPosition(point);
            setDriverHeading(heading);
          }

          const street = getStreetNameForProgress(next, true);
          const remainingSecs = Math.max(0, Math.round(180 * (1 - next)));
          const remainingKm = Math.max(0.1, Math.round((1.2 * (1 - next)) * 10) / 10);
          const speed = Math.round(28 + Math.sin(next * 12) * 5);

          setActiveRide(r => r ? {
            ...r,
            etaSeconds: remainingSecs,
            driverEtaMins: Math.max(1, Math.ceil(remainingSecs / 60)),
            remainingDistanceKm: remainingKm,
            currentSpeedKmH: speed,
            currentStreetName: street.en,
            currentStreetNameHi: street.hi
          } : null);

          if (next >= 1) {
            // Reached pickup point!
            return 1;
          }

          return next;
        });
      }, intervalMs);

      return () => clearInterval(interval);
    } 
    else if (rideStatus === 'RIDE_IN_PROGRESS') {
      // Driver with passenger moving along route to destination
      const intervalMs = Math.max(100, Math.round(550 / simulationSpeedMultiplier));

      const interval = setInterval(() => {
        setSimulationProgress(prev => {
          const step = 0.02 * simulationSpeedMultiplier;
          const next = prev + step;
          const progressPercent = Math.min(100, Math.round(next * 100));

          if (tripWaypoints.length > 0) {
            const { point, heading } = getPositionAlongPath(tripWaypoints, Math.min(1, next));
            setDriverPosition(point);
            setDriverHeading(heading);
          }

          const street = getStreetNameForProgress(next, false);
          const totalSecs = durationMins * 60;
          const remainingSecs = Math.max(0, Math.round(totalSecs * (1 - next)));
          const remainingKm = Math.max(0.1, Math.round((distanceKm * (1 - next)) * 10) / 10);

          let baseSpeed = 30;
          if (selectedVehicleId === 'bike') baseSpeed = 38;
          else if (selectedVehicleId === 'e_rickshaw') baseSpeed = 22;
          else if (selectedVehicleId === 'taxi_prime') baseSpeed = 36;
          const speed = Math.round(baseSpeed + Math.sin(next * 16) * 6);

          setActiveRide(r => r ? {
            ...r,
            progressPercent,
            durationMins: Math.max(1, Math.ceil(remainingSecs / 60)),
            etaSeconds: remainingSecs,
            remainingDistanceKm: remainingKm,
            currentSpeedKmH: speed,
            currentStreetName: street.en,
            currentStreetNameHi: street.hi
          } : null);

          if (next >= 1) {
            // Arrived at destination!
            clearInterval(interval);
            handleCompleteRide();
            return 1;
          }

          return next;
        });
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [rideStatus, driverApproachWaypoints, tripWaypoints, durationMins, distanceKm, simulationSpeedMultiplier, isPaused, selectedVehicleId]);

  // START RIDE (BOARDED & VERIFIED OTP)
  const handleStartRide = () => {
    setRideStatus('RIDE_IN_PROGRESS');
    setSimulationProgress(0);
    setDriverPosition(pickup);
    const street = getStreetNameForProgress(0, false);
    if (activeRide) {
      setActiveRide({
        ...activeRide,
        status: 'RIDE_IN_PROGRESS',
        progressPercent: 0,
        etaSeconds: durationMins * 60,
        remainingDistanceKm: distanceKm,
        currentStreetName: street.en,
        currentStreetNameHi: street.hi
      });
    }
  };

  // COMPLETE RIDE
  const handleCompleteRide = () => {
    setRideStatus('RIDE_COMPLETED');
    if (activeRide) {
      const completedTrip: PastTrip = {
        id: activeRide.id,
        date: language === 'hi' ? 'आज, अभी' : 'Today, Just now',
        pickup: activeRide.pickup.name,
        pickupHi: activeRide.pickup.nameHi,
        drop: activeRide.drop.name,
        dropHi: activeRide.drop.nameHi,
        vehicleName: activeRide.vehicle.name,
        vehicleNameHi: activeRide.vehicle.nameHi,
        fare: activeRide.totalFare,
        paymentMethod: activeRide.paymentMethod,
        rating: 5,
        driverName: activeRide.driver.name,
        status: 'completed'
      };
      setPastTrips(prev => [completedTrip, ...prev]);
    }
  };

  // CANCEL RIDE
  const handleCancelRide = () => {
    setRideStatus('IDLE');
    setActiveRide(null);
    setSimulationProgress(0);
  };

  // RESET AFTER TRIP COMPLETION
  const handleCloseAndReset = (tip: number = 0, rating: number = 5) => {
    if (activeRide) {
      setPastTrips(prev => 
        prev.map(t => {
          if (t.id === activeRide.id) {
            return {
              ...t,
              fare: activeRide.totalFare + tip,
              tip: tip > 0 ? tip : undefined,
              rating: rating
            };
          }
          return t;
        })
      );
    }
    setRideStatus('IDLE');
    setActiveRide(null);
    setSimulationProgress(0);
  };

  // SWAP PICKUP AND DROP
  const handleSwapLocations = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  // REBOOK PAST TRIP
  const handleRebookPastTrip = (trip: PastTrip) => {
    const p = CITY_LOCATIONS.find(l => l.name === trip.pickup || l.nameHi === trip.pickupHi) || CITY_LOCATIONS[0];
    const d = CITY_LOCATIONS.find(l => l.name === trip.drop || l.nameHi === trip.dropHi) || CITY_LOCATIONS[1];
    setPickup(p);
    setDrop(d);
    setRideStatus('IDLE');
  };

  // SCHEDULE RIDE HANDLERS
  const handleScheduleRide = (ride: ScheduledRide) => {
    setScheduledRides(prev => [ride, ...prev]);
  };

  const handleCancelScheduledRide = (id: string) => {
    setScheduledRides(prev => prev.filter(r => r.id !== id));
  };

  const handleStartScheduledRideNow = (ride: ScheduledRide) => {
    setPickup(ride.pickup);
    setDrop(ride.drop);
    setSelectedVehicleId(ride.vehicle.id);
    handleCancelScheduledRide(ride.id);
    handleStartSearchDriver();
  };

  // Active waypoints on map
  const activeWaypointsOnMap = rideStatus === 'DRIVER_ASSIGNED' 
    ? driverApproachWaypoints 
    : tripWaypoints;

  const isTracking = rideStatus === 'DRIVER_ASSIGNED' || rideStatus === 'RIDE_IN_PROGRESS';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f0fdf4] font-sans text-slate-900">
      
      {/* 1. NAVBAR */}
      <Navbar
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'hi' ? 'en' : 'hi')}
        walletBalance={walletBalance}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onOpenDriverPartner={() => setIsDriverModalOpen(true)}
        onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
        scheduledCount={scheduledRides.length}
      />

      {/* 2. MAIN LAYOUT: Interactive Map + Booking/Tracking Panel */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* INTERACTIVE FULL-VIEW MAP WITH REAL-TIME GPS TRACKING */}
        <div className="relative flex-1 h-[52vh] md:h-full w-full overflow-hidden">
          <InteractiveMap
            pickup={pickup}
            drop={drop}
            driverPosition={isTracking ? driverPosition : undefined}
            driverHeading={driverHeading}
            driverEtaMins={activeRide?.driverEtaMins || 2}
            etaSeconds={activeRide?.etaSeconds || 0}
            remainingDistanceKm={activeRide?.remainingDistanceKm || distanceKm}
            currentSpeedKmH={activeRide?.currentSpeedKmH || 30}
            currentStreetName={activeRide?.currentStreetName || 'City Road'}
            currentStreetNameHi={activeRide?.currentStreetNameHi || 'शहर मुख्य मार्ग'}
            driverVehicleType={activeRide?.vehicle.id || selectedVehicleId}
            driverInfo={activeRide?.driver}
            waypoints={activeWaypointsOnMap}
            simulationProgress={simulationProgress}
            isTracking={isTracking}
            rideStatus={rideStatus}
            language={language}
            simulationSpeedMultiplier={simulationSpeedMultiplier}
            onSetSimulationSpeed={setSimulationSpeedMultiplier}
            isPaused={isPaused}
            onTogglePauseSimulation={() => setIsPaused(!isPaused)}
            mapSelectionMode={mapSelectionMode}
            onSelectMapLocation={handleSelectMapLocation}
            onConfirmMapSelection={handleConfirmMapSelection}
            onCancelMapSelection={handleCancelMapSelection}
            onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
          />
        </div>

        {/* BOTTOM / SIDE DRAWER (Responsive: pinned right on desktop, bottom sheet on mobile) */}
        <div className="w-full md:w-[440px] md:h-full md:border-l border-emerald-200/90 bg-white shadow-2xl flex flex-col shrink-0 z-20">
          <BookingBottomDrawer
            pickup={pickup}
            drop={drop}
            onOpenLocationSearch={type => {
              setLocationSearchTarget(type);
              setIsLocationModalOpen(true);
            }}
            onSwapLocations={handleSwapLocations}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            selectedVehicle={selectedVehicle}
            distanceKm={distanceKm}
            durationMins={durationMins}
            rideStatus={rideStatus}
            activeRide={activeRide}
            onStartSearchDriver={handleStartSearchDriver}
            onCancelRide={handleCancelRide}
            onCallDriver={() => setIsCallModalOpen(true)}
            onChatDriver={() => setIsChatModalOpen(true)}
            onOpenSafety={() => setIsSafetyModalOpen(true)}
            onShareRide={() => setIsSafetyModalOpen(true)}
            onSimulatePickupArrival={handleStartRide}
            onSimulateCompleteTrip={handleCompleteRide}
            language={language}
            scheduledRides={scheduledRides}
            onScheduleRide={handleScheduleRide}
            onCancelScheduledRide={handleCancelScheduledRide}
            onStartScheduledRideNow={handleStartScheduledRideNow}
            onStartSelectOnMap={handleStartSelectOnMap}
            onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
          />
        </div>

      </div>

      {/* 3. MODALS */}
      {/* Location Search Modal */}
      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        targetType={locationSearchTarget}
        currentPickup={pickup}
        currentDrop={drop}
        onSelectLocation={(loc, type) => {
          if (type === 'pickup') setPickup(loc);
          else setDrop(loc);
        }}
        onStartSelectOnMap={handleStartSelectOnMap}
        language={language}
      />

      {/* Phone Call to Driver Modal */}
      {activeRide && (
        <CallDriverModal
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
          driver={activeRide.driver}
          language={language}
        />
      )}

      {/* Chat with Driver Modal */}
      {activeRide && (
        <ChatDriverModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          driver={activeRide.driver}
          language={language}
        />
      )}

      {/* Trip Completed & Receipt Modal */}
      {rideStatus === 'RIDE_COMPLETED' && activeRide && (
        <TripCompletedModal
          ride={activeRide}
          language={language}
          onCloseAndReset={handleCloseAndReset}
        />
      )}

      {/* 24x7 Safety & SOS Modal */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        language={language}
      />

      {/* Past Trips History Modal */}
      <RideHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        trips={pastTrips}
        language={language}
        onRebook={handleRebookPastTrip}
      />

      {/* Become Driver Partner Modal */}
      <BecomeDriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        language={language}
      />

      {/* Google Play Store Download & Install Modal */}
      <PlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
        language={language}
      />

    </div>
  );
}
