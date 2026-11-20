export type CategoryName =
  | 'Audio & Headphones'
  | 'Wearables & Mobile'
  | 'Laptops & Peripherals'
  | 'Smart Home & Tech'
  | 'Gaming & Cameras';

export interface CategoryItem {
  id: CategoryName;
  label: string;
  tagline: string;
  subcategories: string[];
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  subcopy: string;
  ctaLabel: string;
  targetCategory: CategoryName | 'All';
  bgClass: string;
  accentColor: string;
  artworkKey: 'hero-audio' | 'hero-desk' | 'hero-smart';
}

export type ProductArtworkKey =
  | 'headphones'
  | 'smartwatch'
  | 'keyboard'
  | 'earbuds'
  | 'gan-charger'
  | 'speaker'
  | 'mouse'
  | 'webcam'
  | 'powerbank'
  | 'camera'
  | 'purifier'
  | 'desk-lamp'
  | 'ssd'
  | 'router'
  | 'controller'
  | 'usb-hub'
  | 'mic'
  | 'stand';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  variant: string;
  comment: string;
  helpfulCount: number;
  hasPhoto?: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: CategoryName;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  artworkKey: ProductArtworkKey;
  customImageUrls?: string[];
  status?: 'published' | 'draft';
  isFlashSale?: boolean;
  stockLeft?: number;
  soldCount?: number;
  variants: string[];
  variantLabel?: string;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  shippingNote: string;
  warrantyNote: string;
  sellerName: string;
  sellerRating: number;
  ratingBreakdown: [number, number, number, number, number];
  reviews: ProductReview[];
}

export function formatPKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'Audio & Headphones',
    label: 'Audio & Headphones',
    tagline: 'ANC headphones, earbuds & mics',
    subcategories: ['Over-Ear ANC', 'True Wireless Earbuds', 'Bluetooth Speakers', 'Studio Mics'],
  },
  {
    id: 'Wearables & Mobile',
    label: 'Wearables & Mobile',
    tagline: 'Smartwatches, GaN power & banks',
    subcategories: ['GPS Smartwatches', 'GaN Fast Chargers', 'Laptop Power Banks', 'MagSafe Stands'],
  },
  {
    id: 'Laptops & Peripherals',
    label: 'Laptops & Peripherals',
    tagline: 'Keyboards, mice, SSDs & hubs',
    subcategories: ['Mechanical Keyboards', 'Wireless Mice', 'Portable NVMe SSDs', 'Thunderbolt Hubs'],
  },
  {
    id: 'Smart Home & Tech',
    label: 'Smart Home & Tech',
    tagline: 'Wi-Fi 7 routers, lighting & air',
    subcategories: ['Wi-Fi 7 Mesh', 'Smart Desk Lamps', 'HEPA Air Purifiers', '4K Webcams'],
  },
  {
    id: 'Gaming & Cameras',
    label: 'Gaming & Cameras',
    tagline: 'Mirrorless cams & controllers',
    subcategories: ['Mirrorless Cameras', 'Hall-Effect Controllers', 'Streaming Gear', 'Storage Media'],
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-audio',
    eyebrow: 'H.S Electronics Flagship Event',
    headline: 'Precision Audio & Smart Wearables',
    subcopy:
      'Save up to 41% on studio ANC headphones, titanium GPS watches, and 140W GaN charging gear at H.S Electronics.',
    ctaLabel: 'Shop Audio & Gear',
    targetCategory: 'Audio & Headphones',
    bgClass: 'from-[#18191D] via-[#23262D] to-[#131417]',
    accentColor: '#F85606',
    artworkKey: 'hero-audio',
  },
  {
    id: 'slide-desk',
    eyebrow: 'H.S Electronics Desk Setup',
    headline: 'Pro Peripherals & Creator Docks',
    subcopy:
      'Upgrade your workstation with gasket mechanical keyboards, 4K HDR webcams, and 2TB USB-C NVMe storage.',
    ctaLabel: 'Explore Peripherals',
    targetCategory: 'Laptops & Peripherals',
    bgClass: 'from-[#1E2228] via-[#282E36] to-[#171A1F]',
    accentColor: '#F85606',
    artworkKey: 'hero-desk',
  },
  {
    id: 'slide-smart',
    eyebrow: 'H.S Electronics Smart Living',
    headline: 'Next-Gen Wi-Fi 7 & Mirrorless Kits',
    subcopy:
      'Ultra-fast tri-band networking, laser-sensing HEPA air care, and compact 24MP creator cameras ready for same-day dispatch.',
    ctaLabel: 'Browse Smart Tech',
    targetCategory: 'Smart Home & Tech',
    bgClass: 'from-[#221F1D] via-[#2F2A26] to-[#191715]',
    accentColor: '#F85606',
    artworkKey: 'hero-smart',
  },
];

const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: 'r-1',
    author: 'Daniel R.',
    rating: 5,
    date: 'Nov 14, 2026',
    variant: 'Standard Edition',
    comment:
      'Hardware quality from H.S Electronics feels rock solid right out of the box. Arrived the next morning well-packaged and performs cleanly.',
    helpfulCount: 34,
    hasPhoto: true,
  },
  {
    id: 'r-2',
    author: 'Nadia K.',
    rating: 5,
    date: 'Nov 09, 2026',
    variant: 'Standard Edition',
    comment:
      'Great deal during the flash sale. Setup took under two minutes and firmware updates worked seamlessly.',
    helpfulCount: 19,
    hasPhoto: true,
  },
  {
    id: 'r-3',
    author: 'Marcus T.',
    rating: 4,
    date: 'Oct 30, 2026',
    variant: 'Standard Edition',
    comment:
      'Very reliable daily driver. USB-C cable included in the box is braided and sturdy.',
    helpfulCount: 8,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p-1',
    title: 'Acoustic Studio ANC Wireless Over-Ear Headphones',
    brand: 'Sona Audio',
    category: 'Audio & Headphones',
    price: 18900,
    originalPrice: 32000,
    discountPercent: 41,
    rating: 4.9,
    reviewCount: 1428,
    artworkKey: 'headphones',
    isFlashSale: true,
    stockLeft: 14,
    soldCount: 86,
    variants: ['Matte Charcoal', 'Warm Silver', 'Midnight Slate'],
    variantLabel: 'Color Finish',
    description:
      'Engineered for critical listening and uninterrupted travel, the Acoustic Studio ANC combines 40mm custom neodymium drivers with adaptive hybrid noise cancellation, plush memory foam ear cushions, and 45-hour battery endurance.',
    highlights: [
      '40mm custom-tuned neodymium acoustic drivers with Hi-Res wired USB-C audio',
      'Adaptive hybrid Active Noise Cancellation up to -42dB ambient attenuation',
      '45 hours playback with ANC on; 10-minute rapid charge adds 6 hours',
      'Dual-device Bluetooth 5.3 multipoint switching with low-latency mode',
      'Anodized aluminum yoke arms and foldable hardshell travel case included',
    ],
    specs: [
      {label: 'Driver Size', value: '40 mm Dynamic Neodymium'},
      {label: 'Connectivity', value: 'Bluetooth 5.3 / USB-C / 3.5mm'},
      {label: 'Battery Life', value: '45 hrs (ANC On) / 60 hrs (Off)'},
      {label: 'Weight', value: '254 g'},
      {label: 'Microphones', value: '6-Mic Beamforming Array'},
      {label: 'In the Box', value: 'Headphones, Case, USB-C & Aux Cables'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Official Brand Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [86, 10, 3, 1, 0],
    reviews: [
      {
        id: 'p1-r1',
        author: 'Amina S.',
        rating: 5,
        date: 'Nov 15, 2026',
        variant: 'Matte Charcoal',
        comment:
          'The ANC completely drowns out cabin hum on flights without ear pressure. Clamping force is super comfortable even with glasses.',
        helpfulCount: 47,
        hasPhoto: true,
      },
      {
        id: 'p1-r2',
        author: 'Kevin W.',
        rating: 5,
        date: 'Nov 10, 2026',
        variant: 'Warm Silver',
        comment:
          'Multipoint switching between my laptop and phone works effortlessly. Bass is tight and vocals are crystal clear.',
        helpfulCount: 23,
        hasPhoto: true,
      },
      {
        id: 'p1-r3',
        author: 'Priya M.',
        rating: 4,
        date: 'Nov 03, 2026',
        variant: 'Midnight Slate',
        comment:
          'Battery lasts me a full work week on one charge. Case is sturdy and compact enough for a slim tech backpack.',
        helpfulCount: 11,
      },
    ],
  },
  {
    id: 'p-2',
    title: 'Apex Series 4 Titanium GPS Smartwatch',
    brand: 'Chronos Tech',
    category: 'Wearables & Mobile',
    price: 28500,
    originalPrice: 42500,
    discountPercent: 33,
    rating: 4.8,
    reviewCount: 1104,
    artworkKey: 'smartwatch',
    isFlashSale: true,
    stockLeft: 9,
    soldCount: 124,
    variants: ['44mm Titanium', '40mm Titanium'],
    variantLabel: 'Case Size',
    description:
      'Sapphire crystal AMOLED display, dual-frequency L1+L5 GPS, 14-day battery autonomy, and continuous heart rate, SpO2, and sleep recovery tracking.',
    highlights: [
      'Grade-5 brushed titanium bezel with scratch-proof sapphire lens',
      '2000-nit LTPO AMOLED screen legible in direct midday sunlight',
      '5ATM + IP68 water resistance for open-water swimming',
      'Offline topographic maps and 100+ workout profiles',
    ],
    specs: [
      {label: 'Display', value: '1.45" Sapphire LTPO AMOLED'},
      {label: 'Navigation', value: 'Dual-Band L1+L5 GNSS'},
      {label: 'Water Rating', value: '5 ATM (50 Meters)'},
      {label: 'Battery Life', value: 'Up to 14 Days Typical'},
      {label: 'Strap Width', value: '22 mm Quick-Release'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Official Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [84, 11, 3, 1, 1],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-3',
    title: 'Velo 75% Hot-Swappable Wireless Mechanical Keyboard',
    brand: 'KeyForge',
    category: 'Laptops & Peripherals',
    price: 12500,
    originalPrice: 19500,
    discountPercent: 36,
    rating: 4.9,
    reviewCount: 814,
    artworkKey: 'keyboard',
    isFlashSale: true,
    stockLeft: 11,
    soldCount: 95,
    variants: ['Tactile Brown', 'Linear Red', 'Silent Cream'],
    variantLabel: 'Switch Type',
    description:
      'Gasket-mounted CNC aluminum frame with tri-mode Bluetooth 5.3, low-latency 2.4GHz wireless dongle, PBT dye-sub keycaps, and seamless Mac/Windows switching.',
    highlights: [
      '75% compact 84-key layout preserves function row and arrow cluster',
      '5-pin hot-swappable PCB supports custom switches without soldering',
      'Dual-layer Poron acoustic dampening for deep, thocky keystroke feel',
      '4000mAh battery delivers up to 180 hours wireless typing',
    ],
    specs: [
      {label: 'Layout', value: '75% ANSI (84 Keys)'},
      {label: 'Connectivity', value: '2.4GHz / Bluetooth 5.3 / USB-C'},
      {label: 'Keycaps', value: '1.5mm Double-Shot PBT'},
      {label: 'Battery', value: '4000 mAh Li-Po'},
      {label: 'OS Support', value: 'macOS, Windows, Linux'},
    ],
    shippingNote: 'Express Courier Delivery',
    warrantyNote: '2-Year Hardware Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [89, 8, 2, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-4',
    title: 'Spatial ANC True Wireless Pocket Earbuds',
    brand: 'Sona Audio',
    category: 'Audio & Headphones',
    price: 4500,
    originalPrice: 6500,
    discountPercent: 31,
    rating: 4.8,
    reviewCount: 1640,
    artworkKey: 'earbuds',
    isFlashSale: true,
    stockLeft: 18,
    soldCount: 215,
    variants: ['Pebble White', 'Graphite'],
    variantLabel: 'Color Finish',
    description:
      'Pocket-sized USB-C & Qi wireless charging case, IPX5 sweat resistance, wind-reduction call mics, and 32 hours of combined playback.',
    highlights: [
      '11mm dynamic titanium-coated drivers with personalized EQ app',
      'Hybrid ANC with transparent awareness mode for street safety',
      'IPX5 sweat and rain sealed for gym and outdoor runs',
      '8 hours per charge + 24 hours from pocket wireless case',
    ],
    specs: [
      {label: 'Drivers', value: '11 mm Titanium Diaphragm'},
      {label: 'Water Rating', value: 'IPX5 Earbuds'},
      {label: 'Charging', value: 'USB-C & Qi Wireless'},
      {label: 'Total Playback', value: '32 Hours'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '1-Year Replacement Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [82, 13, 3, 1, 1],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-5',
    title: 'VoltMax 140W 4-Port GaN PD 3.1 Fast Wall Charger',
    brand: 'VoltCore',
    category: 'Wearables & Mobile',
    price: 3850,
    originalPrice: 6200,
    discountPercent: 38,
    rating: 4.9,
    reviewCount: 928,
    artworkKey: 'gan-charger',
    isFlashSale: true,
    stockLeft: 16,
    soldCount: 142,
    variants: ['Space Gray (US/Global)', 'Matte Black (EU/UK Kit)'],
    variantLabel: 'Plug Edition',
    description:
      'Next-gen Gallium Nitride architecture packs 140W USB-C PD 3.1 output into a palm-sized foldable brick capable of fast-charging two laptops and a phone simultaneously.',
    highlights: [
      '140W max single-port PD 3.1 powers 16" MacBook Pro to 50% in 26 mins',
      '3× USB-C + 1× USB-A intelligent dynamic power allocation',
      'Real-time thermal guard monitors temperature 200 times per second',
      'Foldable prongs and 1.5m braided 240W USB-C cable included',
    ],
    specs: [
      {label: 'Max Output', value: '140 W Total (PD 3.1 / PPS)'},
      {label: 'Ports', value: '3 × USB-C, 1 × USB-A'},
      {label: 'Semiconductor', value: 'GaN III High-Efficiency'},
      {label: 'Weight', value: '215 g'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Surge & Replacement Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [88, 9, 2, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-6',
    title: 'Pulse360 Waterproof Portable Bluetooth Speaker',
    brand: 'Sona Audio',
    category: 'Audio & Headphones',
    price: 10900,
    originalPrice: 17500,
    discountPercent: 38,
    rating: 4.7,
    reviewCount: 518,
    artworkKey: 'speaker',
    isFlashSale: true,
    stockLeft: 8,
    soldCount: 67,
    variants: ['Obsidian Black', 'Slate & Ember'],
    variantLabel: 'Colorway',
    description:
      'Dual passive bass radiators, IP67 dust and waterproof acoustic mesh, and 24-hour battery playback engineered for studio desks and outdoor trips.',
    highlights: [
      '360-degree omnidirectional soundstage with 30W RMS clarity',
      'IP67 waterproof & dustproof rated up to 1m submersion',
      'Stereo pair two speakers wirelessly for left/right separation',
      'USB-C reverse power-out tops up smartphones on the go',
    ],
    specs: [
      {label: 'Output Power', value: '30 W RMS Dual Driver'},
      {label: 'Protection', value: 'IP67 Waterproof & Dustproof'},
      {label: 'Battery Life', value: '24 Hours Playback'},
      {label: 'Bluetooth', value: '5.3 + AAC / SBC'},
    ],
    shippingNote: 'Express Courier Delivery',
    warrantyNote: '2-Year Audio Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [79, 14, 5, 1, 1],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-7',
    title: 'GlidePro 8K Wireless Ultralight Ergonomic Mouse',
    brand: 'KeyForge',
    category: 'Laptops & Peripherals',
    price: 9800,
    originalPrice: 12600,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 634,
    artworkKey: 'mouse',
    variants: ['Matte Charcoal', 'Chalk White'],
    variantLabel: 'Shell Finish',
    description:
      '54g ultralight shell with PAW3395 26,000 DPI optical sensor, crisp optical microswitches, and 8000Hz polling receiver for pixel-accurate productivity and gaming.',
    highlights: [
      '54g balanced honeycomb-free unibody magnesium-composite frame',
      'Optical switches rated for 90 million crisp zero-double-click actuations',
      '90-hour battery life with fast USB-C paracord charging',
      'Virgin-grade PTFE skates for effortless glide on any surface',
    ],
    specs: [
      {label: 'Sensor', value: 'PAW3395 (26,000 DPI)'},
      {label: 'Polling Rate', value: 'Up to 8000 Hz Wireless'},
      {label: 'Weight', value: '54 g'},
      {label: 'Battery', value: '90 Hours Continuous'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Hardware Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [88, 9, 2, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-8',
    title: 'OptiView 4K HDR AI Auto-Framing Studio Webcam',
    brand: 'Lumen Optics',
    category: 'Smart Home & Tech',
    price: 16500,
    originalPrice: 22000,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 412,
    artworkKey: 'webcam',
    variants: ['Graphite Aluminum', 'Silver'],
    variantLabel: 'Housing Finish',
    description:
      'Large 1/1.8" Sony Starvis sensor captures crisp 4K 30fps or 1080p 60fps video even in dim home offices, complete with magnetic privacy shutter and dual stereo mics.',
    highlights: [
      'True 4K UHD glass multi-element lens with f/1.8 low-light aperture',
      'On-device AI auto-framing keeps you centered during presentations',
      'Instant magnetic privacy cap snaps cleanly over the lens',
      'Plug-and-play USB-C connection for Zoom, Meet, and OBS',
    ],
    specs: [
      {label: 'Resolution', value: '4K @ 30fps / 1080p @ 60fps'},
      {label: 'Sensor', value: '1/1.8" Low-Light CMOS'},
      {label: 'Field of View', value: 'Adjustable 65° / 78° / 90°'},
      {label: 'Mount', value: 'Monitor Clip + 1/4" Tripod Thread'},
    ],
    shippingNote: 'Express Courier Delivery',
    warrantyNote: '2-Year Optics Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [84, 12, 3, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-9',
    title: 'CoreCharge 20,000mAh 100W Laptop Power Bank',
    brand: 'VoltCore',
    category: 'Wearables & Mobile',
    price: 11400,
    originalPrice: 15800,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 1205,
    artworkKey: 'powerbank',
    variants: ['Anodized Slate', 'Matte Black'],
    variantLabel: 'Finish',
    description:
      'Airline-approved 72Wh high-density Li-Polymer portable battery with digital wattage readout, 100W bidirectional USB-C, and rugged aluminum chassis.',
    highlights: [
      '100W USB-C PD charges laptops, tablets, drones, and phones at full speed',
      'Smart OLED telemetry display shows live wattage and time remaining',
      'Recharges itself from 0% to 100% in just 55 minutes via 65W+ input',
      'TSA/FAA carry-on compliant 72Wh battery capacity',
    ],
    specs: [
      {label: 'Capacity', value: '20,000 mAh / 72 Wh'},
      {label: 'Output', value: '100 W USB-C1 + 30 W USB-C2 + 18 W USB-A'},
      {label: 'Display', value: 'Real-Time OLED Wattage Screen'},
      {label: 'Dimensions', value: '15.2 × 5.4 × 4.6 cm'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Battery Health Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [89, 8, 2, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-10',
    title: 'Vantage Z2 24MP 4K Compact Mirrorless Camera Kit',
    brand: 'Lumen Optics',
    category: 'Gaming & Cameras',
    price: 145000,
    originalPrice: 166500,
    discountPercent: 13,
    rating: 4.9,
    reviewCount: 348,
    artworkKey: 'camera',
    variants: ['Body + 28-70mm Kit Lens', 'Body Only'],
    variantLabel: 'Kit Configuration',
    description:
      'APS-C 24.2MP back-illuminated sensor with 5-axis in-body stabilization, real-time eye autofocus, and 10-bit 4K 60fps video capture for hybrid creators.',
    highlights: [
      '24.2MP BSI CMOS sensor with 14-stop dynamic range',
      '5-axis in-body image stabilization rated to 5.5 stops',
      'Fully articulating 3.0" touchscreen + 2.36M-dot OLED EVF',
      'Dual UHS-II SD slots and direct USB-C webcam streaming',
    ],
    specs: [
      {label: 'Sensor', value: '24.2 MP APS-C BSI CMOS'},
      {label: 'Video', value: '4K 60fps 10-bit 4:2:2'},
      {label: 'Stabilization', value: '5-Axis In-Body IBIS'},
      {label: 'Weight', value: '418 g (Body Only)'},
    ],
    shippingNote: 'Insured Express Courier',
    warrantyNote: '2-Year Official Camera Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [91, 7, 2, 0, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-11',
    title: 'PureFlow Smart Laser-Sensor H13 HEPA Air Purifier',
    brand: 'ClimaTech',
    category: 'Smart Home & Tech',
    price: 22900,
    originalPrice: 27900,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 890,
    artworkKey: 'purifier',
    variants: ['Matte White (450 sq ft)', 'Charcoal (450 sq ft)'],
    variantLabel: 'Finish & Coverage',
    description:
      '360-degree vortex intake with Wi-Fi app control captures 99.97% of dust, pollen, and smoke down to 0.3 microns at whisper-quiet 21dB sleep mode.',
    highlights: [
      '3-stage filtration: Nylon Pre-Filter, H13 True HEPA, Activated Carbon',
      'Laser PM2.5 particle sensor auto-adjusts fan speed in real time',
      'App & voice-assistant scheduling for bedrooms and studios',
      'Blackout night mode dims all LEDs for undisturbed sleep',
    ],
    specs: [
      {label: 'CADR Rating', value: '260 m³/h'},
      {label: 'Filter Grade', value: 'Medical-Grade H13 HEPA'},
      {label: 'Noise Range', value: '21 dB (Sleep) – 48 dB (Turbo)'},
      {label: 'Power Draw', value: '28 W Brushless DC'},
    ],
    shippingNote: 'Includes 1 Pre-Installed Filter',
    warrantyNote: '2-Year Official Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [82, 13, 4, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-12',
    title: 'LumiBar Auto-Dimming Asymmetric LED Desk Lamp',
    brand: 'Atelier Tech',
    category: 'Smart Home & Tech',
    price: 9200,
    rating: 4.7,
    reviewCount: 389,
    artworkKey: 'desk-lamp',
    variants: ['Anodized Space Gray', 'Matte Black'],
    variantLabel: 'Finish',
    description:
      'CRI 97+ asymmetric optical LED bar illuminates your keyboard and desk cleanly with zero monitor screen glare and stepless color-temperature dial.',
    highlights: [
      'Asymmetric optics eliminate reflections on glossy & matte monitors',
      'CRI 97+ full-spectrum LEDs prevent eye strain during late sessions',
      'Wireless rotary desk puck controls brightness and 2700K–6500K warmth',
      'Built-in ambient lux sensor auto-balances desk illumination',
    ],
    specs: [
      {label: 'Color Accuracy', value: 'Ra > 97 High CRI'},
      {label: 'Color Temp', value: '2700 K – 6500 K Stepless'},
      {label: 'Power', value: 'USB-C 15 W'},
      {label: 'Body Material', value: 'CNC Sandblasted Aluminum'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year LED Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [80, 14, 4, 2, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-13',
    title: 'Velocity X2 2TB Rugged USB-C 3.2 NVMe Portable SSD',
    brand: 'VoltCore',
    category: 'Laptops & Peripherals',
    price: 24500,
    originalPrice: 30600,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 774,
    artworkKey: 'ssd',
    variants: ['2 TB (2000 MB/s)', '1 TB (2000 MB/s)', '4 TB (2000 MB/s)'],
    variantLabel: 'Storage Capacity',
    description:
      'Pocket-sized aluminum NVMe external SSD delivering 2,000 MB/s sustained transfers for direct 4K ProRes video editing and instant project backups.',
    highlights: [
      'Up to 2,000 MB/s read/write via USB 3.2 Gen 2x2 Type-C',
      'IP65 water/dust resistant finned aluminum heatsink enclosure',
      'Hardware 256-bit AES encryption ready for sensitive media',
      'Includes both USB-C to C and USB-C to A braided cables',
    ],
    specs: [
      {label: 'Interface', value: 'USB 3.2 Gen 2x2 (20 Gbps)'},
      {label: 'Sequential Speed', value: 'Up to 2,000 MB/s'},
      {label: 'Durability', value: 'IP65 + 2m Drop Rated'},
      {label: 'Compatibility', value: 'macOS, Windows, iPadOS, iPhone 15+'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '5-Year Limited Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [91, 7, 1, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-14',
    title: 'AeroMesh AXE7800 Tri-Band Wi-Fi 7 Gigabit Router',
    brand: 'NetPulse',
    category: 'Smart Home & Tech',
    price: 34900,
    originalPrice: 44700,
    discountPercent: 22,
    rating: 4.8,
    reviewCount: 456,
    artworkKey: 'router',
    variants: ['Single Router (3,000 sq ft)', '2-Pack Mesh (5,800 sq ft)'],
    variantLabel: 'Coverage Kit',
    description:
      'Multi-Link Operation Wi-Fi 7 router with dedicated 6GHz channel, 2.5GbE WAN/LAN ports, and quad-core 2.2GHz processor for lag-free 4K streaming and gaming.',
    highlights: [
      '7.8 Gbps aggregate tri-band throughput across 2.4, 5, and 6 GHz',
      'Dual 2.5Gbps Ethernet ports for multi-gig fiber ISP plans',
      'Multi-Link Operation (MLO) slashes wireless latency under 2ms',
      'Zero-subscription WPA3 network security and parental controls',
    ],
    specs: [
      {label: 'Standard', value: 'Wi-Fi 7 (802.11be) Tri-Band'},
      {label: 'Ethernet Ports', value: '1 × 2.5G WAN, 1 × 2.5G LAN, 3 × 1G'},
      {label: 'Processor', value: '2.2 GHz Quad-Core ARM'},
      {label: 'Coverage', value: 'Up to 3,000 sq ft'},
    ],
    shippingNote: 'Express Courier Delivery',
    warrantyNote: '3-Year Networking Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [85, 11, 3, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-15',
    title: 'TactilePro Hall-Effect Tri-Mode Wireless Controller',
    brand: 'KeyForge',
    category: 'Gaming & Cameras',
    price: 8900,
    originalPrice: 11500,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 689,
    artworkKey: 'controller',
    variants: ['Matte Obsidian', 'Frost White'],
    variantLabel: 'Edition',
    description:
      'Zero-drift Hall-Effect magnetic thumbsticks and triggers paired with microswitch D-pad, two remappable rear paddles, and a matching magnetic charging dock.',
    highlights: [
      'Electromagnetic Hall-Effect joysticks eliminate stick drift permanently',
      'Instant physical trigger locks switch between analog and hair-trigger',
      'Includes matching desktop magnetic pass-through charging dock',
      '1000Hz polling rate via included 2.4GHz USB-C/A receiver',
    ],
    specs: [
      {label: 'Sticks & Triggers', value: 'Drift-Free Hall-Effect Sensors'},
      {label: 'Platforms', value: 'PC, Switch, SteamOS, iOS, Android'},
      {label: 'Battery', value: '1,000 mAh (28 Hours)'},
      {label: 'Included', value: 'Controller, Charging Dock, 2.4G Dongle'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Replacement Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [90, 8, 1, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-16',
    title: 'DockStation 11-in-1 Aluminum 4K60 USB-C Hub',
    brand: 'VoltCore',
    category: 'Laptops & Peripherals',
    price: 4200,
    originalPrice: 5750,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 842,
    artworkKey: 'usb-hub',
    variants: ['Space Gray', 'Silver'],
    variantLabel: 'Finish',
    description:
      'Precision-milled CNC aluminum multiport adapter adding dual 4K HDMI/DisplayPort, 100W PD pass-through, Gigabit Ethernet, and UHS-II SD card slots to any laptop.',
    highlights: [
      'Dual-display 4K@60Hz output via HDMI 2.0 + DisplayPort',
      '100W USB-C Power Delivery keeps host laptop charged at full speed',
      '3 × 10Gbps USB 3.2 data ports + simultaneous SD/microSD readers',
      'Braided flexible cable resists kinks inside travel sleeves',
    ],
    specs: [
      {label: 'Total Ports', value: '11 Ports (HDMI, DP, RJ45, SD, USB)'},
      {label: 'Power Pass-Through', value: '100 W PD (85 W to Host)'},
      {label: 'Data Speed', value: '10 Gbps USB 3.2 Gen 2'},
      {label: 'Enclosure', value: 'Anodized CNC Aluminum'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Hardware Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [86, 10, 3, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-17',
    title: 'StudioCast Cardioid USB-C Condenser Podcast Mic',
    brand: 'Sona Audio',
    category: 'Audio & Headphones',
    price: 14200,
    rating: 4.8,
    reviewCount: 521,
    artworkKey: 'mic',
    variants: ['Matte Black + Desk Stand', 'Slate + Shock Mount'],
    variantLabel: 'Bundle',
    description:
      '24-bit/96kHz broadcast-grade condenser microphone with tap-to-mute capacitive top ring, zero-latency headphone monitoring, and weighted desktop stand.',
    highlights: [
      'Focused cardioid pickup pattern rejects keyboard and room echo',
      '24-bit / 96kHz internal ADC preamp requires zero audio interface',
      'Capacitive tap-to-mute LED ring gives instant visual status',
      '3.5mm real-time monitoring jack with physical gain & mix knobs',
    ],
    specs: [
      {label: 'Sample Rate', value: '24-Bit / 96 kHz'},
      {label: 'Polar Pattern', value: 'Cardioid Unidirectional'},
      {label: 'Connection', value: 'USB-C Plug & Play'},
      {label: 'Mount Thread', value: '5/8" & 3/8" Boom Compatible'},
    ],
    shippingNote: 'Express Courier Delivery',
    warrantyNote: '2-Year Studio Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [85, 11, 3, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
  {
    id: 'p-18',
    title: 'AlloyFold 3-in-1 Qi2 Magnetic Wireless Charging Stand',
    brand: 'Atelier Tech',
    category: 'Wearables & Mobile',
    price: 4600,
    originalPrice: 6300,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 477,
    artworkKey: 'stand',
    variants: ['Space Gray', 'Titanium Silver'],
    variantLabel: 'Metal Finish',
    description:
      'CNC-machined weighted aluminum desktop stand delivering certified 15W Qi2 magnetic fast charging for smartphone, smartwatch, and wireless earbuds.',
    highlights: [
      'Certified 15W Qi2 magnetic alignment snaps phone in portrait or landscape',
      'Dedicated fold-out smartwatch fast-charging puck + 5W earbud pad',
      'Folds flat to 18mm thickness for compact travel packing',
      '30W USB-C GaN adapter and braided cable included in box',
    ],
    specs: [
      {label: 'Phone Output', value: '15 W Qi2 Magnetic Fast Charge'},
      {label: 'Watch & Buds', value: '5 W Watch + 5 W Earbuds'},
      {label: 'Material', value: 'Zinc-Aluminum Alloy + Silicone'},
      {label: 'Included', value: '30 W Adapter + USB-C Cable'},
    ],
    shippingNote: 'Next-Day Courier Dispatch',
    warrantyNote: '2-Year Warranty',
    sellerName: 'H.S Electronics Official',
    sellerRating: 99,
    ratingBreakdown: [84, 12, 3, 1, 0],
    reviews: DEFAULT_REVIEWS,
  },
];
