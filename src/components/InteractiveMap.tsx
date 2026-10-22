import React, { useRef, useState, useEffect } from 'react';
import { 
  Navigation, 
  Plus, 
  Minus, 
  Layers, 
  Compass, 
  MapPin, 
  ShieldCheck, 
  Gauge, 
  RotateCcw,
  Radio,
  Lock,
  Unlock,
  FastForward,
  Play,
  Pause,
  Check,
  Sparkles
} from 'lucide-react';
import { CityLocation, DriverInfo, VehicleTypeId, Language } from '../types';
import { Point, splitWaypointsByProgress, resolveAddressFromCoords } from '../utils/routeUtils';
import { CITY_LOCATIONS } from '../data/mockData';

interface InteractiveMapProps {
  pickup: CityLocation;
  drop: CityLocation;
  driverPosition?: Point;
  driverHeading?: number;
  driverEtaMins?: number;
  etaSeconds?: number;
  remainingDistanceKm?: number;
  currentSpeedKmH?: number;
  currentStreetName?: string;
  currentStreetNameHi?: string;
  driverVehicleType?: VehicleTypeId;
  driverInfo?: DriverInfo;
  waypoints: Point[];
  simulationProgress?: number;
  isTracking: boolean;
  rideStatus: string;
  language: Language;
  simulationSpeedMultiplier?: number;
  onSetSimulationSpeed?: (speed: number) => void;
  isPaused?: boolean;
  onTogglePauseSimulation?: () => void;
  onSelectMapLocation?: (coords: { x: number; y: number }) => void;
  mapSelectionMode?: { active: boolean; target: 'pickup' | 'drop'; currentCoords: { x: number; y: number } } | null;
  onConfirmMapSelection?: (coords: { x: number; y: number }) => void;
  onCancelMapSelection?: () => void;
  onOpenPlayStore?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickup,
  drop,
  driverPosition,
  driverHeading = 0,
  driverEtaMins = 0,
  etaSeconds = 0,
  remainingDistanceKm = 0,
  currentSpeedKmH = 32,
  currentStreetName = 'City Road',
  currentStreetNameHi = 'शहर मुख्य मार्ग',
  driverVehicleType = 'auto',
  driverInfo,
  waypoints,
  simulationProgress = 0,
  isTracking,
  rideStatus,
  language,
  simulationSpeedMultiplier = 1,
  onSetSimulationSpeed,
  isPaused = false,
  onTogglePauseSimulation,
  onSelectMapLocation,
  mapSelectionMode = null,
  onConfirmMapSelection,
  onCancelMapSelection,
  onOpenPlayStore
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1.05);
  const [pan, setPan] = useState({ x: -120, y: -90 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number } | null>(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [cameraLock, setCameraLock] = useState(true); // Auto-lock camera to moving vehicle
  const [breadcrumbs, setBreadcrumbs] = useState<Point[]>([]);

  // Update breadcrumb trail when driver position moves
  useEffect(() => {
    if (isTracking && driverPosition) {
      setBreadcrumbs(prev => {
        const last = prev[prev.length - 1];
        if (!last || Math.hypot(last.x - driverPosition.x, last.y - driverPosition.y) > 8) {
          const updated = [...prev, { x: driverPosition.x, y: driverPosition.y }];
          return updated.slice(-24); // Keep last 24 GPS points
        }
        return prev;
      });
    } else {
      setBreadcrumbs([]);
    }
  }, [driverPosition, isTracking]);

  // Auto-fit or center camera on vehicle or route
  const handleRecenter = () => {
    if (isTracking && driverPosition) {
      setPan({
        x: -driverPosition.x * zoom + 350,
        y: -driverPosition.y * zoom + 260
      });
      setCameraLock(true);
    } else {
      // Center between pickup and drop
      const midX = (pickup.x + drop.x) / 2;
      const midY = (pickup.y + drop.y) / 2;
      setPan({
        x: -midX * zoom + 350,
        y: -midY * zoom + 260
      });
    }
  };

  // Follow driver smoothly during active tracking if cameraLock is enabled
  useEffect(() => {
    if (isTracking && driverPosition && cameraLock && !isDragging) {
      const targetX = -driverPosition.x * zoom + 350;
      const targetY = -driverPosition.y * zoom + 260;
      setPan({ x: targetX, y: targetY });
    }
  }, [driverPosition, isTracking, zoom, cameraLock, isDragging]);

  // Convert screen pixels to map SVG viewBox coordinates (0..1000)
  const getSvgCoordinates = (clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clientX - rect.left - pan.x;
    const relY = clientY - rect.top - pan.y;
    const svgX = Math.round(Math.max(40, Math.min(960, relX / zoom)));
    const svgY = Math.round(Math.max(40, Math.min(960, relY / zoom)));
    return { x: svgX, y: svgY };
  };

  // Dynamically resolve location details for current map selection pin
  const resolvedAddress = mapSelectionMode?.active
    ? resolveAddressFromCoords(mapSelectionMode.currentCoords, CITY_LOCATIONS)
    : null;

  // Mouse pan & tap handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setClickOrigin({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCameraLock(false); // User manually panned, unlock camera
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    if (clickOrigin) {
      const moved = Math.hypot(e.clientX - clickOrigin.x, e.clientY - clickOrigin.y);
      if (moved < 8) {
        const coords = getSvgCoordinates(e.clientX, e.clientY);
        if (coords && onSelectMapLocation) {
          onSelectMapLocation(coords);
        }
      }
    }
    setClickOrigin(null);
  };

  // Touch pan & tap handlers for mobile/responsive
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
      setClickOrigin({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setCameraLock(false);
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    if (clickOrigin && e.changedTouches.length === 1) {
      const moved = Math.hypot(e.changedTouches[0].clientX - clickOrigin.x, e.changedTouches[0].clientY - clickOrigin.y);
      if (moved < 12) {
        const coords = getSvgCoordinates(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        if (coords && onSelectMapLocation) {
          onSelectMapLocation(coords);
        }
      }
    }
    setClickOrigin(null);
  };

  // Split waypoints into completed and upcoming paths
  const { completed: completedWaypoints, upcoming: upcomingWaypoints } = 
    isTracking && driverPosition
      ? splitWaypointsByProgress(waypoints, simulationProgress, driverPosition)
      : { completed: [], upcoming: waypoints };

  const completedPathD = completedWaypoints.length > 1
    ? `M ${completedWaypoints[0].x} ${completedWaypoints[0].y} ` +
      completedWaypoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const upcomingPathD = upcomingWaypoints.length > 1
    ? `M ${upcomingWaypoints[0].x} ${upcomingWaypoints[0].y} ` +
      upcomingWaypoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // Format seconds to mm:ss
  const formattedSeconds = () => {
    const totalSec = etaSeconds > 0 ? etaSeconds : driverEtaMins * 60;
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Render vehicle icon based on type
  const renderVehicleSvg = (type: VehicleTypeId) => {
    switch (type) {
      case 'bike':
        return (
          <g transform="translate(-16, -16)">
            {/* Dynamic Headlight beam */}
            <polygon points="16,3 6,-35 26,-35" fill="rgba(254, 240, 138, 0.45)" />
            {/* Bike Shadow */}
            <ellipse cx="16" cy="18" rx="14" ry="7" fill="rgba(0,0,0,0.4)" filter="blur(2px)" />
            {/* Motorcycle Body */}
            <rect x="13" y="4" width="6" height="24" rx="3" fill="#0f172a" />
            {/* Handlebars */}
            <rect x="7" y="10" width="18" height="3" rx="1.5" fill="#f97316" />
            {/* Mirrors */}
            <circle cx="7" cy="11" r="1.5" fill="#e2e8f0" />
            <circle cx="25" cy="11" r="1.5" fill="#e2e8f0" />
            {/* Rider Helmet */}
            <circle cx="16" cy="15" r="5.5" fill="#f97316" stroke="#fff" strokeWidth="1" />
            {/* Rider Visor */}
            <path d="M 14 12 Q 16 10 18 12" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            {/* Tail Light */}
            <rect x="14" y="27" width="4" height="2" fill="#ef4444" rx="1" />
          </g>
        );

      case 'auto':
      case 'e_rickshaw':
        return (
          <g transform="translate(-20, -20)">
            {/* Dynamic Headlight Beam */}
            <polygon points="20,1 6,-45 34,-45" fill="rgba(254, 240, 138, 0.55)" />
            {/* Rickshaw Shadow */}
            <ellipse cx="20" cy="22" rx="17" ry="13" fill="rgba(0,0,0,0.4)" filter="blur(2.5px)" />
            {/* Iconic Green Lower Body (CNG Auto) */}
            <rect x="7" y="10" width="26" height="25" rx="5" fill={type === 'e_rickshaw' ? '#059669' : '#047857'} />
            {/* Yellow Canopy Roof */}
            <rect x="9" y="12" width="22" height="18" rx="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2" />
            {/* Front Mudguard & Single Front Wheel */}
            <rect x="17" y="2" width="6" height="9" rx="2" fill="#334155" />
            <circle cx="20" cy="4" r="2.5" fill="#0f172a" />
            {/* Front Windshield */}
            <rect x="11" y="9" width="18" height="4" rx="1" fill="#bae6fd" opacity="0.9" />
            {/* Back Tail Lights */}
            <rect x="8" y="34" width="4" height="2" fill="#ef4444" rx="0.5" />
            <rect x="28" y="34" width="4" height="2" fill="#ef4444" rx="0.5" />
            {/* Driver Seating */}
            <circle cx="20" cy="17" r="3.5" fill="#1e293b" />
          </g>
        );

      case 'taxi_mini':
      case 'taxi_prime':
      default:
        return (
          <g transform="translate(-18, -24)">
            {/* Dynamic Headlight Beams */}
            <polygon points="18,5 4,-45 32,-45" fill="rgba(254, 240, 138, 0.5)" />
            {/* Car Shadow */}
            <ellipse cx="18" cy="26" rx="17" ry="15" fill="rgba(0,0,0,0.4)" filter="blur(3px)" />
            {/* Car Body */}
            <rect x="6" y="8" width="24" height="34" rx="7" fill={type === 'taxi_prime' ? '#0f172a' : '#f8fafc'} stroke="#64748b" strokeWidth="1" />
            {/* Front & Rear Windshields */}
            <rect x="9" y="12" width="18" height="7" rx="2" fill="#0284c7" opacity="0.85" />
            <rect x="9" y="31" width="18" height="6" rx="2" fill="#0284c7" opacity="0.85" />
            {/* Roof */}
            <rect x="9" y="18" width="18" height="14" rx="2" fill={type === 'taxi_prime' ? '#1e293b' : '#e2e8f0'} />
            {/* TAXI Roof Top Sign */}
            <rect x="13" y="21" width="10" height="4" rx="1.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <text x="18" y="24" fontSize="3" fontWeight="bold" textAnchor="middle" fill="#0f172a">TAXI</text>
            {/* Tail Lights */}
            <rect x="8" y="41" width="4" height="2" fill="#ef4444" rx="1" />
            <rect x="24" y="41" width="4" height="2" fill="#ef4444" rx="1" />
          </g>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#e6edf2] select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* MAP SVG CANVAS */}
      <svg
        className="w-full h-full absolute inset-0 pointer-events-none"
        viewBox="0 0 1000 1000"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.25s ease-out'
        }}
      >
        <defs>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          {/* Route glow filter */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="markerShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. MAP BACKGROUND & GEOGRAPHY */}
        <rect width="1000" height="1000" fill="#e9eef2" />

        {/* City Blocks */}
        <g fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1">
          <rect x="60" y="60" width="140" height="180" rx="8" />
          <rect x="230" y="60" width="190" height="130" rx="8" />
          <rect x="450" y="50" width="180" height="150" rx="8" />
          <rect x="660" y="40" width="130" height="140" rx="8" />

          <rect x="70" y="270" width="160" height="190" rx="8" />
          <rect x="260" y="220" width="170" height="160" rx="8" />
          <rect x="460" y="230" width="180" height="170" rx="8" />
          <rect x="670" y="210" width="160" height="180" rx="8" />

          <rect x="70" y="490" width="170" height="180" rx="8" />
          <rect x="270" y="410" width="150" height="180" rx="8" />
          <rect x="450" y="430" width="180" height="160" rx="8" />
          <rect x="660" y="420" width="170" height="170" rx="8" />

          <rect x="60" y="700" width="180" height="220" rx="8" />
          <rect x="270" y="620" width="150" height="180" rx="8" />
          <rect x="450" y="620" width="180" height="180" rx="8" />
          <rect x="660" y="620" width="170" height="180" rx="8" />
        </g>

        {/* Green Parks */}
        <g>
          <path d="M 470 240 Q 560 220 590 290 Q 610 370 540 370 Q 460 370 470 240 Z" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
          <text x="530" y="300" fontSize="12" fontWeight="600" fill="#065f46" textAnchor="middle">
            {language === 'hi' ? '🌿 सेंट्रल पार्क' : '🌿 Central Park'}
          </text>

          <rect x="80" y="520" width="140" height="120" rx="16" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
          <text x="150" y="580" fontSize="11" fontWeight="600" fill="#047857" textAnchor="middle">
            {language === 'hi' ? '🌸 बॉटनिकल गार्डन' : '🌸 Botanical Garden'}
          </text>
        </g>

        {/* River */}
        <path
          d="M 880 0 Q 860 250 820 450 T 890 750 Q 940 900 960 1000"
          fill="none"
          stroke="url(#riverGrad)"
          strokeWidth="38"
          strokeLinecap="round"
        />
        <text x="860" y="420" fontSize="11" fontWeight="600" fill="#1e40af" transform="rotate(75, 860, 420)">
          {language === 'hi' ? '🌊 नगर नदी' : '🌊 City River'}
        </text>

        {/* 2. SECONDARY CITY STREETS */}
        <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 0 150 L 1000 150" />
          <path d="M 0 350 L 1000 350" />
          <path d="M 0 550 L 1000 550" />
          <path d="M 0 750 L 1000 750" />

          <path d="M 180 0 L 180 1000" />
          <path d="M 380 0 L 380 1000" />
          <path d="M 580 0 L 580 1000" />
          <path d="M 780 0 L 780 1000" />
        </g>

        {/* 3. MAJOR HIGHWAYS & RING ROADS */}
        <path
          d="M 100 200 Q 250 100 500 100 T 900 200 Q 950 500 900 800 T 500 900 Q 200 950 100 800 T 100 200"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="20"
        />
        <path
          d="M 100 200 Q 250 100 500 100 T 900 200 Q 950 500 900 800 T 500 900 Q 200 950 100 800 T 100 200"
          fill="none"
          stroke="#ffffff"
          strokeWidth="14"
        />

        {/* Boulevard */}
        <path d="M 0 450 L 1000 450" stroke="#cbd5e1" strokeWidth="22" />
        <path d="M 0 450 L 1000 450" stroke="#ffffff" strokeWidth="16" />
        <path d="M 0 450 L 1000 450" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="10 10" />

        {/* Metro Viaduct */}
        <path d="M 350 0 L 350 450 Q 360 600 700 700 L 1000 800" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="12 4" opacity="0.6" />
        <circle cx="350" cy="450" r="5" fill="#4f46e5" />

        {/* TRAFFIC LAYER */}
        {showTraffic && (
          <g opacity="0.85">
            <path d="M 20 450 L 250 450" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
            <path d="M 250 450 L 420 450" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
            <path d="M 420 450 L 580 450" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <path d="M 580 450 L 800 450" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
            <path d="M 380 150 L 380 450" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
            <path d="M 380 450 L 380 750" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {/* 4. LANDMARKS & BUILDINGS */}
        <g transform="translate(260, 330)">
          <rect width="40" height="35" rx="6" fill="#1e293b" />
          <text x="20" y="22" fontSize="18" textAnchor="middle">🚉</text>
        </g>
        <g transform="translate(800, 200)">
          <rect width="40" height="35" rx="6" fill="#0369a1" />
          <text x="20" y="22" fontSize="18" textAnchor="middle">✈️</text>
        </g>
        <g transform="translate(500, 430)">
          <rect width="40" height="35" rx="6" fill="#be185d" />
          <text x="20" y="22" fontSize="18" textAnchor="middle">🛍️</text>
        </g>
        <g transform="translate(300, 660)">
          <rect width="40" height="35" rx="6" fill="#dc2626" />
          <text x="20" y="22" fontSize="18" textAnchor="middle">🏥</text>
        </g>

        {/* 5. ROUTE POLYLINE (TRAVELED VS UPCOMING SPLIT) */}
        {/* Traveled Route Segment (Completed portion) */}
        {completedPathD && (
          <g>
            <path
              d={completedPathD}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            <path
              d={completedPathD}
              fill="none"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 4"
            />
          </g>
        )}

        {/* Upcoming Route Segment (Glowing Emerald GPS direction) */}
        {upcomingPathD && (
          <g filter="url(#routeGlow)">
            <path
              d={upcomingPathD}
              fill="none"
              stroke="#064e3b"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />
            <path
              d={upcomingPathD}
              fill="none"
              stroke="#059669"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={upcomingPathD}
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          </g>
        )}

        {/* 6. GPS BREADCRUMB TRAIL (Illuminated historical GPS points) */}
        {breadcrumbs.map((pt, index) => {
          const ratio = (index + 1) / breadcrumbs.length; // 0..1
          return (
            <circle
              key={`crumb_${index}`}
              cx={pt.x}
              cy={pt.y}
              r={2 + ratio * 3}
              fill="#10b981"
              opacity={0.15 + ratio * 0.65}
            />
          );
        })}

        {/* 7. PICKUP LOCATION MARKER */}
        <g transform={`translate(${pickup.x}, ${pickup.y})`}>
          <circle r="22" fill="#10b981" opacity="0.2" className="animate-ping" />
          <circle r="14" fill="#10b981" opacity="0.4" />
          <circle r="7" fill="#047857" stroke="#ffffff" strokeWidth="2.5" />
          <g transform="translate(0, -32)" filter="url(#markerShadow)">
            <rect x="-65" y="-14" width="130" height="24" rx="12" fill="#047857" />
            <polygon points="-5,10 5,10 0,16" fill="#047857" />
            <text x="0" y="2" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">
              {language === 'hi' ? '🟢 पिकअप: ' + pickup.nameHi.slice(0, 10) + '...' : '🟢 ' + pickup.name.slice(0, 14)}
            </text>
          </g>
        </g>

        {/* 8. DESTINATION DROP MARKER */}
        <g transform={`translate(${drop.x}, ${drop.y})`}>
          <circle r="18" fill="#ef4444" opacity="0.2" className="animate-ping" />
          <circle r="12" fill="#ef4444" opacity="0.3" />
          <circle r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />
          <g transform="translate(0, -32)" filter="url(#markerShadow)">
            <rect x="-65" y="-14" width="130" height="24" rx="12" fill="#dc2626" />
            <polygon points="-5,10 5,10 0,16" fill="#dc2626" />
            <text x="0" y="2" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">
              {language === 'hi' ? '🏁 गंतव्य: ' + drop.nameHi.slice(0, 10) + '...' : '🏁 ' + drop.name.slice(0, 14)}
            </text>
          </g>
        </g>

        {/* 8.5 ACTIVE MAP SELECTION PIN (WHEN SELECTING ON MAP) */}
        {mapSelectionMode?.active && (
          <g 
            transform={`translate(${mapSelectionMode.currentCoords.x}, ${mapSelectionMode.currentCoords.y})`}
            style={{ transition: 'transform 0.12s ease-out' }}
          >
            {/* Pulsing Sonar Rings */}
            <circle 
              r="46" 
              fill="none" 
              stroke={mapSelectionMode.target === 'pickup' ? '#10b981' : '#f43f5e'} 
              strokeWidth="3.5" 
              opacity="0.5" 
              className="animate-ping" 
            />
            <circle 
              r="24" 
              fill={mapSelectionMode.target === 'pickup' ? '#a7f3d0' : '#fecdd3'} 
              opacity="0.65" 
            />
            
            {/* Floating Needle Pin Icon */}
            <g transform="translate(0, -38)" filter="url(#markerShadow)">
              <path
                d="M 0 -22 C -18 -22 -22 -6 -22 6 C -22 18 0 38 0 38 C 0 38 22 18 22 6 C 22 -6 18 -22 0 -22 Z"
                fill={mapSelectionMode.target === 'pickup' ? '#059669' : '#e11d48'}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <circle cx="0" cy="5" r="7" fill="#ffffff" />

              {/* Floating Indicator Plate */}
              <g transform="translate(0, -32)">
                <rect 
                  x="-85" 
                  y="-14" 
                  width="170" 
                  height="26" 
                  rx="13" 
                  fill="#0f172a" 
                  stroke={mapSelectionMode.target === 'pickup' ? '#34d399' : '#fb7185'} 
                  strokeWidth="2" 
                />
                <polygon points="-5,12 5,12 0,17" fill="#0f172a" />
                <text x="0" y="3" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
                  {mapSelectionMode.target === 'pickup' 
                    ? (language === 'hi' ? '📍 यहाँ पिकअप रखें' : '📍 Pick up here') 
                    : (language === 'hi' ? '📍 यहाँ ड्रॉप रखें' : '📍 Drop off here')}
                </text>
              </g>
            </g>
          </g>
        )}

        {/* 9. REAL-TIME VEHICLE GPS MARKER WITH HEADING & SONAR */}
        {isTracking && driverPosition && (
          <g 
            transform={`translate(${driverPosition.x}, ${driverPosition.y})`}
            style={{ transition: 'transform 0.4s ease-out' }}
          >
            {/* Live GPS Sonar Pulse Rings with Emerald Theme */}
            <circle r="36" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.4" className="animate-ping" />
            <circle r="22" fill="#d1fae5" opacity="0.7" />

            {/* Rotated Vehicle SVG based on heading */}
            <g transform={`rotate(${driverHeading + 90})`}>
              {renderVehicleSvg(driverVehicleType)}
            </g>

            {/* Floating Live GPS Plate & ETA Badge */}
            <g transform="translate(0, -44)" filter="url(#markerShadow)">
              <rect x="-60" y="-14" width="120" height="26" rx="13" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <polygon points="-4,12 4,12 0,17" fill="#064e3b" />
              <text x="0" y="2" fill="#ffffff" fontSize="10.5" fontWeight="800" textAnchor="middle">
                {rideStatus === 'DRIVER_ASSIGNED'
                  ? (language === 'hi' ? `⚡ ${driverEtaMins}m (${formattedSeconds()})` : `⚡ ${driverEtaMins}m (${formattedSeconds()})`)
                  : (language === 'hi' ? `🚀 ${formattedSeconds()} शेष` : `🚀 ${formattedSeconds()} left`)}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* FLOATING REAL-TIME GPS HUD DASHBOARD (TOP LEFT) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-[280px] sm:max-w-xs pointer-events-auto">
        {/* 1. Real-time GPS Satellite Lock Badge */}
        <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{language === 'hi' ? 'लाइव GPS सिग्नल' : 'Live GPS Signal'}</span>
              </div>
              <div className="text-xs font-bold text-slate-200">
                {language === 'hi' ? 'सटीकता: ±3 मीटर (सक्रिय)' : 'Accuracy: ±3m (High)'}
              </div>
            </div>
          </div>

          {/* Camera Lock/Unlock Toggle */}
          {isTracking && (
            <button
              onClick={() => {
                setCameraLock(!cameraLock);
                if (!cameraLock && driverPosition) {
                  setPan({
                    x: -driverPosition.x * zoom + 350,
                    y: -driverPosition.y * zoom + 260
                  });
                }
              }}
              className={`p-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition ${
                cameraLock 
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={cameraLock ? 'कैमरा गाड़ी पर लॉक है' : 'कैमरा अनलॉक है'}
            >
              {cameraLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{cameraLock ? 'Lock' : 'Free'}</span>
            </button>
          )}
        </div>

        {/* 2. Turn-by-Turn Current Street Navigation banner (During tracking) */}
        {isTracking && (
          <div className="bg-white/95 text-slate-900 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-emerald-200/80 flex items-center gap-2.5 animate-in fade-in duration-300">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] uppercase font-extrabold text-emerald-700 tracking-wider">
                {rideStatus === 'DRIVER_ASSIGNED' 
                  ? (language === 'hi' ? 'ड्राइवर का वर्तमान मार्ग' : 'Driver Heading') 
                  : (language === 'hi' ? 'नेविगेशन अपडेट' : 'Navigation')}
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                {language === 'hi' ? currentStreetNameHi : currentStreetName}
              </p>
            </div>
          </div>
        )}

        {/* 3. Live Speedometer HUD (During tracking) */}
        {isTracking && (
          <div className="bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                  {language === 'hi' ? 'गति (Speed)' : 'Speed'}
                </div>
                <div className="text-sm font-black text-white flex items-baseline gap-1">
                  <span>{currentSpeedKmH}</span>
                  <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                </div>
              </div>
            </div>

            {/* Remaining Distance */}
            <div className="text-right pl-3 border-l border-slate-700">
              <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                {language === 'hi' ? 'दूरी शेष' : 'Remaining'}
              </div>
              <div className="text-sm font-black text-emerald-400">
                {remainingDistanceKm} km
              </div>
            </div>
          </div>
        )}

        {/* 4. GPS SIMULATION SPEED CONTROLS (1x, 2x, 4x Turbo) */}
        {isTracking && onSetSimulationSpeed && (
          <div className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <FastForward className="w-3 h-3 text-emerald-400" />
              <span>{language === 'hi' ? 'GPS गति:' : 'GPS Speed:'}</span>
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 4].map(spd => (
                <button
                  key={spd}
                  onClick={() => onSetSimulationSpeed(spd)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition ${
                    simulationSpeedMultiplier === spd
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}

              {onTogglePauseSimulation && (
                <button
                  onClick={onTogglePauseSimulation}
                  className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition ml-1"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING MAP CONTROLS (TOP RIGHT) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition active:scale-95"
          title={language === 'hi' ? 'केंद्रित करें' : 'Recenter'}
        >
          <Navigation className="w-5 h-5 text-emerald-600" />
        </button>

        {/* Traffic Toggle */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`w-10 h-10 rounded-xl shadow-lg border flex items-center justify-center transition active:scale-95 ${
            showTraffic 
              ? 'bg-emerald-600 text-white border-emerald-700' 
              : 'bg-white/95 text-slate-600 border-slate-200/80 hover:bg-slate-50'
          }`}
          title={language === 'hi' ? 'ट्रैफिक स्तर' : 'Traffic Layer'}
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => setZoom(z => Math.min(2.4, z + 0.25))}
          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => setZoom(z => Math.max(0.65, z - 0.25))}
          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* FLOATING TOP BANNER IN MAP SELECTION MODE */}
      {mapSelectionMode?.active && (
        <div className="absolute top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-md w-full z-40 bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border-2 border-emerald-500/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
              mapSelectionMode.target === 'pickup' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              <MapPin className="w-4 h-4 animate-bounce" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black leading-tight text-white truncate">
                {language === 'hi'
                  ? (mapSelectionMode.target === 'pickup' ? '📍 पिकअप स्थान मैप पर चुनें' : '🏁 ड्रॉप स्थान मैप पर चुनें')
                  : (mapSelectionMode.target === 'pickup' ? '📍 Set Pickup Location on Map' : '🏁 Set Drop Destination on Map')}
              </h4>
              <p className="text-[10.5px] font-semibold text-emerald-300 truncate">
                {language === 'hi' ? 'मैप पर किसी भी जगह क्लिक करें या ड्रैग करें' : 'Click anywhere on map or drag to position'}
              </p>
            </div>
          </div>
          {onCancelMapSelection && (
            <button
              onClick={onCancelMapSelection}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer border border-slate-700 shrink-0"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          )}
        </div>
      )}

      {/* FLOATING BOTTOM CONFIRMATION CARD IN MAP SELECTION MODE */}
      {mapSelectionMode?.active && resolvedAddress && (
        <div className="absolute bottom-5 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-md w-auto z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border-2 border-emerald-500 animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-3">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md ${
              mapSelectionMode.target === 'pickup' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                {mapSelectionMode.target === 'pickup' 
                  ? (language === 'hi' ? 'चयनित पिकअप स्थान (पिन)' : 'Selected Pickup Location (Pin)')
                  : (language === 'hi' ? 'चयनित ड्रॉप स्थान (पिन)' : 'Selected Drop Destination (Pin)')}
              </span>
              <h4 className="text-sm font-black text-slate-900 truncate">
                {language === 'hi' ? resolvedAddress.nameHi : resolvedAddress.name}
              </h4>
              <p className="text-xs text-slate-500 truncate font-medium">
                {language === 'hi' ? resolvedAddress.addressHi : resolvedAddress.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            {onCancelMapSelection && (
              <button
                onClick={onCancelMapSelection}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition cursor-pointer text-center"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
            )}
            {onConfirmMapSelection && (
              <button
                onClick={() => onConfirmMapSelection(mapSelectionMode.currentCoords)}
                className="flex-2 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition shadow-md shadow-emerald-700/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'hi' ? 'स्थान की पुष्टि करें' : 'Confirm Location'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* FLOATING GOOGLE PLAY BADGE (When idle/not in selection mode) */}
      {onOpenPlayStore && !isTracking && !mapSelectionMode?.active && (
        <button
          onClick={onOpenPlayStore}
          className="hidden sm:flex absolute bottom-4 left-4 z-20 bg-slate-900/90 hover:bg-slate-950 text-white backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-emerald-500/40 items-center gap-2.5 transition active:scale-95 cursor-pointer pointer-events-auto group"
          title={language === 'hi' ? 'प्ले स्टोर से ऐप डाउनलोड करें' : 'Download from Google Play'}
        >
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center p-1 border border-slate-700 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 512 512">
              <path fill="#00E676" d="M380.9 220.4l-75.7-43.7L76.5 40.5c-6.8-3.9-14.8-4.7-22.3-2.1l251 251 75.7-69z"/>
              <path fill="#FFD600" d="M380.9 291.6L305.2 335.3 54.2 473.6c7.5 2.6 15.5 1.8 22.3-2.1l228.7-136.2 75.7-43.7z"/>
              <path fill="#00B0FF" d="M54.2 38.4C44.4 44 38.4 54.7 38.4 67.2v377.6c0 12.5 6 23.2 15.8 28.8L305.2 256 54.2 38.4z"/>
              <path fill="#FF3D00" d="M473.6 238.4l-92.7-53.5-75.7 71.1 75.7 71.1 92.7-53.5c19.2-11.1 19.2-34.1 0-45.2z"/>
            </svg>
          </div>
          <div className="text-left leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-white">
                {language === 'hi' ? 'प्ले स्टोर ऐप' : 'Play Store App'}
              </span>
              <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-extrabold px-1 rounded">4.8★</span>
            </div>
            <span className="text-[10px] text-slate-300">
              {language === 'hi' ? 'मुफ्त डाउनलोड • 1M+' : 'Free Install • 1M+'}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
