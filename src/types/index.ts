export type VehicleCategory = 'all' | 'rickshaw' | 'bike' | 'taxi' | 'delivery';

export type VehicleTypeId = 
  | 'auto' 
  | 'e_rickshaw' 
  | 'bike' 
  | 'taxi_mini' 
  | 'taxi_prime' 
  | 'parcel';

export interface VehicleOption {
  id: VehicleTypeId;
  name: string;
  nameHi: string;
  category: 'rickshaw' | 'bike' | 'taxi' | 'delivery';
  tagline: string;
  taglineHi: string;
  icon: string; // emoji or visual indicator
  capacity: number;
  baseFare: number;
  ratePerKm: number;
  etaMinutes: number;
  features: string[];
  featuresHi: string[];
  recommended?: boolean;
  savingsText?: string;
  savingsTextHi?: string;
  badge?: string;
  badgeHi?: string;
}

export interface CityLocation {
  id: string;
  name: string;
  nameHi: string;
  address: string;
  addressHi: string;
  x: number; // 0 - 1000 coordinate on simulated map
  y: number; // 0 - 1000 coordinate on simulated map
  category: 'popular' | 'station' | 'airport' | 'metro' | 'hospital' | 'mall' | 'hub' | 'home' | 'work' | 'bus';
}

export interface DriverInfo {
  id: string;
  name: string;
  nameHi: string;
  phone: string;
  rating: number;
  totalTrips: number;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  vehicleTypeId: VehicleTypeId;
  avatar: string;
  x: number;
  y: number;
  heading: number; // angle in degrees
}

export type PaymentMethod = 'cash' | 'upi' | 'wallet' | 'card';

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minFare: number;
  description: string;
  descriptionHi: string;
}

export type RideStatus = 
  | 'IDLE'               // Selecting pickup & drop
  | 'SELECTING_VEHICLE'  // Viewing vehicle list & fares
  | 'CONFIRMING'         // Fare review & payment choice
  | 'SEARCHING_DRIVER'   // Radar pinging nearby drivers
  | 'DRIVER_ASSIGNED'    // Driver found, coming to pickup
  | 'RIDE_IN_PROGRESS'   // Driver picked user, heading to drop
  | 'RIDE_COMPLETED';    // Arrived at destination

export interface ActiveRide {
  id: string;
  pickup: CityLocation;
  drop: CityLocation;
  vehicle: VehicleOption;
  driver: DriverInfo;
  otp: string;
  distanceKm: number;
  durationMins: number;
  baseFare: number;
  distanceFare: number;
  discount: number;
  tax: number;
  totalFare: number;
  paymentMethod: PaymentMethod;
  appliedCoupon?: Coupon;
  status: RideStatus;
  startTime: string;
  progressPercent: number; // 0 to 100
  driverEtaMins: number;
  etaSeconds: number;
  remainingDistanceKm: number;
  currentSpeedKmH: number;
  currentStreetName: string;
  currentStreetNameHi: string;
}

export interface PastTrip {
  id: string;
  date: string;
  pickup: string;
  pickupHi: string;
  drop: string;
  dropHi: string;
  vehicleName: string;
  vehicleNameHi: string;
  fare: number;
  tip?: number;
  paymentMethod: PaymentMethod;
  rating: number;
  driverName: string;
  status: 'completed' | 'cancelled';
}

export interface ScheduledRide {
  id: string;
  pickup: CityLocation;
  drop: CityLocation;
  vehicle: VehicleOption;
  fare: number;
  scheduledDate: string;
  scheduledTime: string;
  displayDateTimeHi: string;
  displayDateTimeEn: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export type Language = 'hi' | 'en';
