export interface Point {
  x: number;
  y: number;
}

// Calculates Euclidean distance scaled to realistic city km (approx 100 canvas units ~ 1.5 km)
export function calculateDistanceKm(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const pixelDist = Math.sqrt(dx * dx + dy * dy);
  const km = (pixelDist / 65) + 0.8;
  return Math.round(km * 10) / 10;
}

// Calculates estimated duration in minutes based on distance and vehicle type
export function calculateDurationMins(distanceKm: number, vehicleType: string): number {
  let speedKmH = 28; // default auto
  if (vehicleType === 'bike') speedKmH = 34;
  else if (vehicleType === 'taxi_mini' || vehicleType === 'taxi_prime') speedKmH = 30;
  else if (vehicleType === 'e_rickshaw') speedKmH = 20;

  const duration = (distanceKm / speedKmH) * 60 + 2; // +2 mins for traffic lights
  return Math.max(3, Math.round(duration));
}

// Generate realistic road-grid waypoints with city turns rather than straight air line
export function generateRouteWaypoints(start: Point, end: Point, numSegments = 12): Point[] {
  const points: Point[] = [start];
  
  // Create realistic city Manhattan-like or curved arterial grid path
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // Introduce a slight road-network detour (intersections)
  const waypoint1: Point = {
    x: start.x + (end.x - start.x) * 0.35 + (start.y > end.y ? 30 : -30),
    y: start.y + (end.y - start.y) * 0.15
  };

  const waypoint2: Point = {
    x: start.x + (end.x - start.x) * 0.65,
    y: start.y + (end.y - start.y) * 0.75 + (start.x > end.x ? -25 : 25)
  };

  const controlPoints = [start, waypoint1, waypoint2, end];

  // Interpolate along Catmull-Rom or cubic bezier for smooth driving path
  for (let i = 1; i <= numSegments; i++) {
    const t = i / numSegments;
    const pt = getCubicBezierPoint(controlPoints[0], controlPoints[1], controlPoints[2], controlPoints[3], t);
    points.push(pt);
  }

  return points;
}

// Snap or reverse geocode map coordinates to human-readable address
export function resolveAddressFromCoords(
  coords: { x: number; y: number },
  knownLocations: Array<{ id: string; name: string; nameHi: string; address: string; addressHi: string; x: number; y: number; category: any }>
) {
  let closest = knownLocations[0];
  let minDistance = Infinity;

  for (const loc of knownLocations) {
    const dist = Math.hypot(loc.x - coords.x, loc.y - coords.y);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  // If user tapped directly on or near a landmark (< 35px), snap to it
  if (minDistance < 35 && closest) {
    return {
      ...closest,
      id: `map_pin_${Date.now()}`
    };
  }

  const roadNamesHi = ['रिंग रोड', 'एमजी मार्ग', 'स्टेशन लिंक रोड', 'मॉल एवेन्यू', 'मेट्रो कॉरिडोर', 'ग्रीन वे', 'हेरिटेज चौक'];
  const roadNamesEn = ['Ring Road', 'MG Avenue', 'Station Link Road', 'Mall Boulevard', 'Metro Corridor', 'Green Way', 'Heritage Chowk'];
  const idx = Math.abs(Math.floor((coords.x + coords.y) / 140)) % roadNamesHi.length;

  const sector = Math.floor(coords.x / 100) + 1;
  const roadHi = roadNamesHi[idx];
  const roadEn = roadNamesEn[idx];
  const landmarkNameHi = closest ? closest.nameHi : 'शहर केंद्र';
  const landmarkNameEn = closest ? closest.name : 'City Center';

  return {
    id: `map_pin_${Date.now()}`,
    name: `${roadEn}, Sector ${sector}`,
    nameHi: `${roadHi}, सेक्टर ${sector}`,
    address: `Near ${landmarkNameEn} (Map Pin: ${Math.round(coords.x)}, ${Math.round(coords.y)})`,
    addressHi: `${landmarkNameHi} के निकट (मैप पिन: ${Math.round(coords.x)}, ${Math.round(coords.y)})`,
    x: coords.x,
    y: coords.y,
    category: 'popular' as const
  };
}

function getCubicBezierPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const cx = 3 * (p1.x - p0.x);
  const bx = 3 * (p2.x - p1.x) - cx;
  const ax = p3.x - p0.x - cx - bx;

  const cy = 3 * (p1.y - p0.y);
  const by = 3 * (p2.y - p1.y) - cy;
  const ay = p3.y - p0.y - cy - by;

  const xt = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
  const yt = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

  return { x: xt, y: yt };
}

// Calculates rotation angle (degrees) from p1 to p2
export function calculateHeading(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const rad = Math.atan2(dy, dx);
  const deg = (rad * 180) / Math.PI;
  return deg;
}

// Interpolate a point on a list of waypoints given progress ratio 0..1
export function getPositionAlongPath(waypoints: Point[], progress: number): { point: Point; heading: number } {
  if (waypoints.length === 0) return { point: { x: 500, y: 500 }, heading: 0 };
  if (waypoints.length === 1) return { point: waypoints[0], heading: 0 };
  if (progress <= 0) {
    const heading = calculateHeading(waypoints[0], waypoints[1]);
    return { point: waypoints[0], heading };
  }
  if (progress >= 1) {
    const last = waypoints[waypoints.length - 1];
    const prev = waypoints[waypoints.length - 2];
    const heading = calculateHeading(prev, last);
    return { point: last, heading };
  }

  const totalSegments = waypoints.length - 1;
  const currentSegmentIndex = Math.floor(progress * totalSegments);
  const segmentT = (progress * totalSegments) - currentSegmentIndex;

  const p1 = waypoints[currentSegmentIndex];
  const p2 = waypoints[Math.min(currentSegmentIndex + 1, totalSegments)];

  const point: Point = {
    x: p1.x + (p2.x - p1.x) * segmentT,
    y: p1.y + (p2.y - p1.y) * segmentT
  };

  const heading = calculateHeading(p1, p2);
  return { point, heading };
}

// Splits waypoints into traveled vs upcoming segments
export function splitWaypointsByProgress(waypoints: Point[], progress: number, currentPos: Point): { completed: Point[]; upcoming: Point[] } {
  if (waypoints.length <= 1) return { completed: waypoints, upcoming: [] };
  const totalSegments = waypoints.length - 1;
  const currentIndex = Math.min(waypoints.length - 1, Math.floor(progress * totalSegments));

  const completed = [...waypoints.slice(0, currentIndex + 1), currentPos];
  const upcoming = [currentPos, ...waypoints.slice(currentIndex + 1)];

  return { completed, upcoming };
}

// Street names along route for navigation feedback
export function getStreetNameForProgress(progress: number, isApproach: boolean): { hi: string; en: string } {
  if (isApproach) {
    if (progress < 0.3) {
      return { hi: 'मुख्य लिंक रोड पर (Starting link road)', en: 'On Main Link Road' };
    } else if (progress < 0.7) {
      return { hi: 'घंटाघर चौक से आगे बढ़ रहे हैं', en: 'Crossing Clock Tower Junction' };
    } else if (progress < 0.95) {
      return { hi: 'पिकअप पॉइंट के निकट (200 मीटर)', en: 'Approaching pickup point (200m)' };
    } else {
      return { hi: 'पिकअप लोकेशन पर पहुंच चुके हैं! 🎉', en: 'Driver arrived at pickup! 🎉' };
    }
  } else {
    if (progress < 0.2) {
      return { hi: 'स्टेशन एवेन्यू से प्रस्थान', en: 'Departing Station Avenue' };
    } else if (progress < 0.45) {
      return { hi: 'रिंग रोड फ्लाईवे पर (60 किमी/घंटा)', en: 'On Ring Road Flyover expressway' };
    } else if (progress < 0.75) {
      return { hi: 'मेट्रो कॉरिडोर व एमजी रोड क्रॉसिंग', en: 'MG Road & Metro corridor crossing' };
    } else if (progress < 0.95) {
      return { hi: 'गंतव्य मोड़ पर (150 मीटर शेष)', en: 'Turning into Destination street' };
    } else {
      return { hi: 'मंजिल पर सुरक्षित पहुंचे! ✨', en: 'Safely arrived at destination! ✨' };
    }
  }
}

