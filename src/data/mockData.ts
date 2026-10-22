import { VehicleOption, CityLocation, Coupon, PastTrip, DriverInfo } from '../types';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'auto',
    name: 'RickshawGo Auto',
    nameHi: 'रिक्शागो ऑटो (Auto)',
    category: 'rickshaw',
    tagline: 'Iconic city ride, fast & economical',
    taglineHi: 'किफायती, तेज और सबसे लोकप्रिय सवारी',
    icon: '🛺',
    capacity: 3,
    baseFare: 30,
    ratePerKm: 12,
    etaMinutes: 2,
    features: ['Up to 3 seats', 'Fast in city traffic', 'CNG Powered'],
    featuresHi: ['3 यात्रियों के लिए', 'ट्रैफिक में सबसे तेज', 'किफायती CNG सवारी'],
    recommended: true,
    savingsText: 'Save ₹25 vs Cab',
    savingsTextHi: 'कैब से ₹25 सस्ती',
    badge: 'Popular',
    badgeHi: 'लोकप्रिय'
  },
  {
    id: 'e_rickshaw',
    name: 'RickshawGo Eco',
    nameHi: 'रिक्शागो इको (E-Rickshaw)',
    category: 'rickshaw',
    tagline: 'Silent electric ride for short neighborhood hops',
    taglineHi: '100% इलेक्ट्रिक, कम दूरी के लिए सबसे सस्ता',
    icon: '⚡',
    capacity: 4,
    baseFare: 15,
    ratePerKm: 8,
    etaMinutes: 3,
    features: ['100% Electric', 'Zero pollution', 'Pocket-sized fare'],
    featuresHi: ['100% इलेक्ट्रिक', 'प्रदूषण मुक्त', 'न्यूनतम किराया'],
    savingsText: 'Best for < 5 km',
    savingsTextHi: '5 किमी से कम के लिए बेस्ट',
    badge: 'Eco Green',
    badgeHi: 'इको ग्रीन'
  },
  {
    id: 'bike',
    name: 'RickshawGo Moto (Bike)',
    nameHi: 'रिक्शागो मोटो (Bike Taxi)',
    category: 'bike',
    tagline: 'Beat city rush hour solo at lightning speed',
    taglineHi: 'ट्रैफिक जाम से बचकर सुपरफास्ट सोलो सफ़र',
    icon: '🛵',
    capacity: 1,
    baseFare: 20,
    ratePerKm: 9,
    etaMinutes: 1,
    features: ['Single passenger', 'Sanitized helmet provided', 'Fastest arrival'],
    featuresHi: ['1 यात्री के लिए', 'साफ हेलमेट उपलब्ध', 'ट्रैफिक जाम को चीरता सफ़र'],
    recommended: false,
    savingsText: 'Save up to 45%',
    savingsTextHi: '45% तक की बचत',
    badge: 'Express',
    badgeHi: 'एक्सप्रेस'
  },
  {
    id: 'taxi_mini',
    name: 'RickshawGo Mini (AC Cab)',
    nameHi: 'रिक्शागो मिनी (AC टैक्सी)',
    category: 'taxi',
    tagline: 'Comfortable air-conditioned hatchback',
    taglineHi: 'आरामदायक एसी कार, बजट हैचबैक',
    icon: '🚗',
    capacity: 4,
    baseFare: 55,
    ratePerKm: 15,
    etaMinutes: 4,
    features: ['Full AC ride', 'Hatchback comfort', 'Compact luggage'],
    featuresHi: ['फुल AC सफ़र', '4 सीटर आराम', 'हल्के सामान के साथ'],
    badge: 'Comfort AC',
    badgeHi: 'ठंडी AC'
  },
  {
    id: 'taxi_prime',
    name: 'RickshawGo Luxe Prime (Sedan)',
    nameHi: 'रिक्शागो लक्ज़री प्राइम (Sedan)',
    category: 'taxi',
    tagline: 'Executive luxury sedan with premier top-rated chauffeurs',
    taglineHi: 'प्रीमियम लक्ज़री सेडान, VIP लेगरूम व टॉप सारथी',
    icon: '🚙',
    capacity: 5,
    baseFare: 85,
    ratePerKm: 20,
    etaMinutes: 5,
    features: ['Premium Sedan', 'Spacious boot space', 'Top rated drivers'],
    featuresHi: ['प्रीमियम सेडान', 'बड़ा बूट स्पेस (सामान)', 'टॉप रेटेड सारथी'],
    badge: 'Luxe VIP',
    badgeHi: 'लक्ज़री VIP'
  },
  {
    id: 'parcel',
    name: 'RickshawGo Parcel Express',
    nameHi: 'रिक्शागो पार्सल एक्सप्रेस',
    category: 'delivery',
    tagline: 'Rapid door-to-door courier & packages up to 50kg',
    taglineHi: 'दुकान का सामान या भारी पार्सल तुरंत भिजवाएं',
    icon: '📦',
    capacity: 1,
    baseFare: 40,
    ratePerKm: 11,
    etaMinutes: 3,
    features: ['Up to 50 kg load', 'Door-to-door courier', 'Live tracking'],
    featuresHi: ['50 किलो तक का सामान', 'डोर-टू-डोर डिलीवरी', 'लाइव ट्रैकिंग सुरक्षा'],
    badge: 'Express Delivery',
    badgeHi: 'सुपर डिलीवरी'
  }
];

export const CITY_LOCATIONS: CityLocation[] = [
  {
    id: 'loc_home',
    name: 'Home (My Residence)',
    nameHi: 'घर (मेरा आवास)',
    address: 'Green Park Extension, House 42',
    addressHi: 'ग्रीन पार्क एक्सटेंशन, मकान 42',
    x: 230,
    y: 280,
    category: 'home'
  },
  {
    id: 'loc_work',
    name: 'Work / Office (Cyber Hub)',
    nameHi: 'दफ़्तर / ऑफिस (साइबर हब)',
    address: 'DLF Cyber City, Tower 8B, 5th Floor',
    addressHi: 'साइबर सिटी, टावर 8B, 5वीं मंजिल',
    x: 740,
    y: 630,
    category: 'work'
  },
  {
    id: 'loc_station',
    name: 'Central Railway Station',
    nameHi: 'सेंट्रल रेलवे स्टेशन (मुख्य गेट)',
    address: 'Station Road, Platform 1 Exit',
    addressHi: 'स्टेशन रोड, प्लेटफॉर्म 1 निकास गेट',
    x: 280,
    y: 350,
    category: 'station'
  },
  {
    id: 'loc_nizamuddin',
    name: 'South Railway Junction Terminal',
    nameHi: 'दक्षिण रेलवे जंक्शन टर्मिनल',
    address: 'Mathura Road, Outer Exit 2',
    addressHi: 'मथुरा रोड, गेट 2',
    x: 420,
    y: 680,
    category: 'station'
  },
  {
    id: 'loc_market',
    name: 'City Center Mall & Market',
    nameHi: 'सिटी सेंटर मॉल व मुख्य बाजार',
    address: 'MG Road, Clock Tower Square',
    addressHi: 'एमजी रोड, घंटाघर चौक',
    x: 520,
    y: 450,
    category: 'mall'
  },
  {
    id: 'loc_mall_south',
    name: 'Grand Citywalk Mall',
    nameHi: 'ग्रैंड सिटीवॉक मॉल (गेट 3)',
    address: 'District Center, Avenue Road',
    addressHi: 'डिस्ट्रिक्ट सेंटर, मुख्य मॉल गेट',
    x: 640,
    y: 520,
    category: 'mall'
  },
  {
    id: 'loc_airport',
    name: 'International Airport (T3)',
    nameHi: 'अंतरराष्ट्रीय हवाई अड्डा (टर्मिनल 3)',
    address: 'Airport Expressway, Gate 4 Departure',
    addressHi: 'एयरपोर्ट एक्सप्रेसवे, प्रस्थान गेट 4',
    x: 820,
    y: 220,
    category: 'airport'
  },
  {
    id: 'loc_airport_t1',
    name: 'Domestic Airport Terminal (T1)',
    nameHi: 'घरेलू हवाई अड्डा (टर्मिनल 1)',
    address: 'Palam Terminal Road, Arrival Gate 1',
    addressHi: 'पालम टर्मिनल रोड, आगमन गेट 1',
    x: 720,
    y: 190,
    category: 'airport'
  },
  {
    id: 'loc_metro',
    name: 'Central Metro Hub (Rajiv Chowk)',
    nameHi: 'सेंट्रल मेट्रो स्टेशन (राजीव चौक)',
    address: 'Yellow & Blue Line Interchange, Gate 7',
    addressHi: 'येलो व ब्लू लाइन इंटरचेंज, गेट 7',
    x: 430,
    y: 520,
    category: 'metro'
  },
  {
    id: 'loc_hospital',
    name: 'City Civil & AIIMS Hospital',
    nameHi: 'एम्स व सिविल अस्पताल (इमरजेंसी गेट)',
    address: 'Ring Road Health Complex',
    addressHi: 'रिंग रोड, मुख्य इमरजेंसी विंग',
    x: 320,
    y: 680,
    category: 'hospital'
  },
  {
    id: 'loc_hospital_max',
    name: 'City Super Specialty Hospital',
    nameHi: 'सिटी सुपर स्पेशलिटी अस्पताल',
    address: 'Press Enclave Road, Gate 2',
    addressHi: 'प्रेस एन्क्लेव रोड, ओपीडी गेट',
    x: 480,
    y: 720,
    category: 'hospital'
  },
  {
    id: 'loc_bus_isbt',
    name: 'Inter-State Bus Terminal (ISBT)',
    nameHi: 'इंटर-स्टेट बस टर्मिनल (ISBT कश्मीरी गेट)',
    address: 'Grand Trunk Road, Bus Bay 12',
    addressHi: 'जीटी रोड, मुख्य बस स्टैंड बे 12',
    x: 340,
    y: 180,
    category: 'bus'
  },
  {
    id: 'loc_techpark',
    name: 'Cyber City Tech Park',
    nameHi: 'साइबर सिटी टेक पार्क',
    address: 'Phase 2, Tower B Entrance',
    addressHi: 'फेज 2, मुख्य IT गेट',
    x: 750,
    y: 650,
    category: 'hub'
  },
  {
    id: 'loc_university',
    name: 'National University Campus',
    nameHi: 'यूनिवर्सिटी मुख्य परिसर (नॉर्थ गेट)',
    address: 'University Road, Library circle',
    addressHi: 'यूनिवर्सिटी रोड, लाइब्रेरी गोलचक्कर',
    x: 600,
    y: 280,
    category: 'popular'
  },
  {
    id: 'loc_chandni',
    name: 'Old Town Heritage Market & Red Fort',
    nameHi: 'चांदनी चौक / लाल किला बाजार',
    address: 'Main Bazaar, Gate 1',
    addressHi: 'पुराना बाजार, लाल किला के पास',
    x: 380,
    y: 240,
    category: 'popular'
  },
  {
    id: 'loc_cp',
    name: 'Connaught Place Inner Circle',
    nameHi: 'कनॉट प्लेस (इनर सर्कल ब्लॉक A)',
    address: 'Radial Road 1, Block A',
    addressHi: 'रेडियल रोड, ब्लॉक A मार्केट',
    x: 470,
    y: 380,
    category: 'popular'
  }
];

export const MOCK_DRIVERS: DriverInfo[] = [
  {
    id: 'drv_1',
    name: 'Ramesh Sharma',
    nameHi: 'रमेश कुमार शर्मा',
    phone: '+91 98765 43210',
    rating: 4.9,
    totalTrips: 3420,
    vehicleModel: 'Bajaj RE Compact CNG Auto',
    vehiclePlate: 'DL 1RT 7842',
    vehicleColor: 'Yellow-Green',
    vehicleTypeId: 'auto',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    x: 350,
    y: 410,
    heading: 45
  },
  {
    id: 'drv_2',
    name: 'Mohammad Imran',
    nameHi: 'मोहम्मद इमरान',
    phone: '+91 98112 55678',
    rating: 4.85,
    totalTrips: 2150,
    vehicleModel: 'Hero Splendor Plus (Moto)',
    vehiclePlate: 'DL 4S BR 9912',
    vehicleColor: 'Black-Silver',
    vehicleTypeId: 'bike',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    x: 480,
    y: 480,
    heading: 120
  },
  {
    id: 'drv_3',
    name: 'Gurpreet Singh',
    nameHi: 'गुरप्रीत सिंह',
    phone: '+91 98990 12345',
    rating: 4.95,
    totalTrips: 4890,
    vehicleModel: 'Maruti Suzuki Dzire (AC Cab)',
    vehiclePlate: 'DL 1ZB 3218',
    vehicleColor: 'White',
    vehicleTypeId: 'taxi_prime',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    x: 540,
    y: 410,
    heading: 210
  },
  {
    id: 'drv_4',
    name: 'Suresh Yadav',
    nameHi: 'सुरेश यादव',
    phone: '+91 97123 66421',
    rating: 4.8,
    totalTrips: 1840,
    vehicleModel: 'Mayuri E-Rickshaw Pro',
    vehiclePlate: 'DL 1ER 5012',
    vehicleColor: 'Green-White',
    vehicleTypeId: 'e_rickshaw',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    x: 410,
    y: 500,
    heading: 90
  },
  {
    id: 'drv_5',
    name: 'Vikas Meena',
    nameHi: 'विकास मीणा',
    phone: '+91 96540 88219',
    rating: 4.78,
    totalTrips: 1290,
    vehicleModel: 'WagonR CNG Mini',
    vehiclePlate: 'DL 2C AK 4109',
    vehicleColor: 'Silver',
    vehicleTypeId: 'taxi_mini',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    x: 390,
    y: 380,
    heading: 15
  }
];

export const NEARBY_PULSE_VEHICLES = [
  { id: 'v1', type: 'auto', x: 420, y: 440, angle: 30, speed: 0.4 },
  { id: 'v2', type: 'auto', x: 310, y: 390, angle: 110, speed: 0.3 },
  { id: 'v3', type: 'bike', x: 490, y: 470, angle: 220, speed: 0.6 },
  { id: 'v4', type: 'taxi_mini', x: 550, y: 430, angle: 90, speed: 0.45 },
  { id: 'v5', type: 'e_rickshaw', x: 400, y: 530, angle: 180, speed: 0.25 },
  { id: 'v6', type: 'bike', x: 330, y: 470, angle: 45, speed: 0.55 },
  { id: 'v7', type: 'taxi_prime', x: 500, y: 360, angle: 310, speed: 0.4 },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'RIKSHAW50',
    discountPercentage: 25,
    maxDiscount: 50,
    minFare: 50,
    description: 'Get 25% off up to ₹50 on any Rickshaw or Bike ride',
    descriptionHi: 'किसी भी रिक्शा या बाइक पर 25% (₹50 तक) की छूट'
  },
  {
    code: 'DESHIRIDE',
    discountPercentage: 15,
    maxDiscount: 40,
    minFare: 40,
    description: 'Flat 15% discount for daily commuters',
    descriptionHi: 'रोज़ाना सफर करने वालों के लिए 15% की तुरंत छूट'
  },
  {
    code: 'PEHLASAFAR',
    discountPercentage: 35,
    maxDiscount: 70,
    minFare: 60,
    description: 'Welcome offer: 35% discount on your ride',
    descriptionHi: 'पहली सवारी का खास ऑफर: 35% (₹70 तक) डिस्काउंट'
  }
];

export const INITIAL_PAST_TRIPS: PastTrip[] = [
  {
    id: 'trip_101',
    date: 'आज, दोपहर 12:40 PM',
    pickup: 'Central Metro Hub',
    pickupHi: 'सेंट्रल मेट्रो स्टेशन',
    drop: 'City Center Mall',
    dropHi: 'सिटी सेंटर मॉल',
    vehicleName: 'Auto Rickshaw',
    vehicleNameHi: 'ऑटो रिक्शा',
    fare: 68,
    paymentMethod: 'upi',
    rating: 5,
    driverName: 'Ramesh Sharma',
    status: 'completed'
  },
  {
    id: 'trip_102',
    date: 'कल, सुबह 09:15 AM',
    pickup: 'Central Railway Station',
    pickupHi: 'सेंट्रल रेलवे स्टेशन',
    drop: 'Cyber City Tech Park',
    dropHi: 'साइबर सिटी टेक पार्क',
    vehicleName: 'Taxi Mini (AC)',
    vehicleNameHi: 'टैक्सी मिनी (AC)',
    fare: 184,
    paymentMethod: 'cash',
    rating: 5,
    driverName: 'Vikas Meena',
    status: 'completed'
  },
  {
    id: 'trip_103',
    date: '18 अक्टूबर, शाम 07:10 PM',
    pickup: 'City Center Mall',
    pickupHi: 'सिटी सेंटर मॉल',
    drop: 'Old Town Market',
    dropHi: 'चांदनी चौक बाजार',
    vehicleName: 'Bike Taxi',
    vehicleNameHi: 'बाइक टैक्सी',
    fare: 45,
    paymentMethod: 'wallet',
    rating: 4,
    driverName: 'Mohammad Imran',
    status: 'completed'
  }
];

export const QUICK_CHAT_MESSAGES = [
  { hi: 'भैया, मैं लोकेशन के मुख्य गेट पर हूँ।', en: 'Brother, I am at the main gate.' },
  { hi: 'आप किस रंग की गाड़ी में हैं?', en: 'What color is your vehicle?' },
  { hi: 'कृपया थोड़ा जल्दी आएं, जरूरी है।', en: 'Please come soon, it is urgent.' },
  { hi: 'मैं नीली शर्ट पहने खड़ा हूँ।', en: 'I am wearing a blue shirt.' },
  { hi: 'OTP तैयार है, मैं आ रहा हूँ।', en: 'Ready with the OTP, coming.' }
];

export const DRIVER_CHAT_RESPONSES = [
  { hi: 'हाँ जी भाईसाहब, बस 1 मिनट में पहुंच रहा हूँ।', en: 'Yes sir, reaching in just 1 minute.' },
  { hi: 'ट्रैफिक जाम था थोड़ा, अब खाली हो गया।', en: 'There was some traffic, clear now.' },
  { hi: 'मैं इंडिकेटर ऑन करके साइड में रुका हूँ।', en: 'I have pulled over with indicators on.' },
  { hi: 'नमस्ते जी, बैठिए आराम से।', en: 'Namaste! Please have a seat.' }
];
