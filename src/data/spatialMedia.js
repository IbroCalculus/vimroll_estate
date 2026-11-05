/**
 * Spatial 3D massing archetypes, chaptered architectural film configurations,
 * multi-level interactive SVG floorplans, and UHNW enclave/aviation intelligence
 * for VIMROLL Estate.
 */

export const HERO_AMBIENT_VIDEO_URL =
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-luxurious-house-near-the-sea-41521-large.mp4';

const CITY_INTELLIGENCE = {
  Dubai: {
    lat: 25.1124,
    lng: 55.139,
    privateAirport: 'Jetex VIP Terminal · Al Maktoum International (DWC)',
    privateAviation: 'Jetex VIP Terminal (DWC) · 24 mins',
    heliportAccess: 'Palm Jumeirah Helipad · 5 mins',
    solarProfile: 'South-West Arabian Gulf Sunset · 3,500 hrs/yr',
    acousticRating: 'Motorised Vitrocsa Triple-Glazing · 49 dB',
    securityTier: '24/7 Frond Gatehouse & Private Marine Patrol',
    timezone: 'GST (UTC+4)',
    climate: '28°C · Clear Coastal Horizon',
  },
  London: {
    lat: 51.4975,
    lng: -0.1527,
    privateAirport: 'Farnborough Airport (FAB) & RAF Northolt VIP',
    privateAviation: 'Farnborough / RAF Northolt VIP · 36 mins',
    heliportAccess: 'London Heliport (Battersea) · 11 mins',
    solarProfile: 'East–West Garden Square Axis · Dual Aspect',
    acousticRating: 'Heritage Secondary Acoustic Glazing · 51 dB',
    securityTier: '24/7 Belgravia Estate Patrol & Biometric Lift',
    timezone: 'GMT / BST (UTC+0)',
    climate: '16°C · Belgravia Garden Microclimate',
  },
  'New York': {
    lat: 40.7661,
    lng: -73.9776,
    privateAirport: 'Teterboro Executive Airport (TEB) · Private Jet Terminal',
    privateAviation: 'Teterboro Executive Airport (TEB) · 24 mins',
    heliportAccess: 'Manhattan West 30th St Heliport · 9 mins',
    solarProfile: '360° Sky Exposure · Central Park North-South Axis',
    acousticRating: 'Hurricane-Rated Acoustic Curtain Wall · 52 dB',
    securityTier: 'White-Glove Doorman, Private Keyed Elevator & Vault',
    timezone: 'EST (UTC-5)',
    climate: '19°C · Elevated Park Views',
  },
  Paris: {
    lat: 48.8662,
    lng: 2.3075,
    privateAirport: 'Aéroport de Paris–Le Bourget (LBG) Executive Terminal',
    privateAviation: 'Paris–Le Bourget Executive Terminal · 22 mins',
    heliportAccess: 'Héliport de Paris – Issy-les-Moulineaux · 14 mins',
    solarProfile: 'South-Facing Piano Nobile · Seine Light Reflection',
    acousticRating: 'Artisan Double-Casement Oak Glazing · 48 dB',
    securityTier: '24/7 Resident Gardien & Encrypted Courtyard Entry',
    timezone: 'CET (UTC+1)',
    climate: '18°C · Golden Triangle Luminosity',
  },
  Marbella: {
    lat: 36.5194,
    lng: -4.9862,
    privateAirport: 'Málaga–Costa del Sol General Aviation Terminal (AGP)',
    privateAviation: 'Málaga Private Aviation Terminal (AGP) · 34 mins',
    heliportAccess: 'La Zagaleta Private Helipad · 3 mins',
    solarProfile: 'Panoramic South Mediterranean Horizon · 320 Days Sun',
    acousticRating: 'Schüco Minimalist Thermal Glazing · 47 dB',
    securityTier: 'Triple-Gated Armed Sanctuary & Perimeter LiDAR',
    timezone: 'CET (UTC+1)',
    climate: '24°C · Sierra Blanca Coastal Breeze',
  },
  Lagos: {
    lat: 6.4646,
    lng: 3.4526,
    privateAirport: 'ExecuJet Private FBO · Murtala Muhammed (LOS)',
    privateAviation: 'ExecuJet Murtala Muhammed FBO · 25 mins',
    heliportAccess: 'Banana Island Private Helipad · 4 mins',
    solarProfile: 'West-Facing Lagoon & Atlantic Sunset Orientation',
    acousticRating: 'Marine-Grade Laminated Acoustic Glazing · 49 dB',
    securityTier: '24/7 Banana Island Diplomatic Enclave & Jetty Control',
    timezone: 'WAT (UTC+1)',
    climate: '29°C · Tropical Lagoon Breeze',
  },
};

export const GLOBAL_AVIATION_ARCS = [
  { from: 'London', to: 'Dubai', flightTime: '6h 40m', aircraft: 'Global 7500', distanceNm: '2,960 NM' },
  { from: 'London', to: 'New York', flightTime: '7h 05m', aircraft: 'Gulfstream G650ER', distanceNm: '3,000 NM' },
  { from: 'London', to: 'Paris', flightTime: '0h 50m', aircraft: 'Citation Longitude', distanceNm: '190 NM' },
  { from: 'London', to: 'Marbella', flightTime: '2h 35m', aircraft: 'Challenger 3500', distanceNm: '910 NM' },
  { from: 'London', to: 'Lagos', flightTime: '6h 15m', aircraft: 'Global 7500', distanceNm: '2,700 NM' },
  { from: 'Dubai', to: 'Lagos', flightTime: '7h 10m', aircraft: 'Gulfstream G650ER', distanceNm: '3,180 NM' },
  { from: 'Paris', to: 'New York', flightTime: '7h 20m', aircraft: 'Global 7500', distanceNm: '3,150 NM' },
  { from: 'Paris', to: 'Marbella', flightTime: '2h 15m', aircraft: 'Phenom 300E', distanceNm: '800 NM' },
  { from: 'Dubai', to: 'Paris', flightTime: '6h 25m', aircraft: 'Global 7500', distanceNm: '2,830 NM' },
  { from: 'Dubai', to: 'New York', flightTime: '12h 50m', aircraft: 'Global 7500', distanceNm: '5,950 NM' },
];

function resolve3DArchetype(property) {
  const type = (property.propertyType || '').toLowerCase();
  const city = property.location?.city || '';
  if (type === 'penthouse') return 'sky-penthouse';
  if (type === 'townhouse') return 'georgian-townhouse';
  if (type === 'residence' && city === 'Paris') return 'haussmann-lateral';
  if (city === 'Marbella') return 'hillside-compound';
  return 'waterfront-villa';
}

export function buildSpatialMediaForProperty(property) {
  const city = property.location?.city || 'Dubai';
  const cityMeta = CITY_INTELLIGENCE[city] || CITY_INTELLIGENCE.Dubai;
  const archetype = resolve3DArchetype(property);
  const imgs = property.images || [];
  const totalArea = property.area || 950;

  // 1. Chaptered Architectural Film Configuration
  const videoTour = {
    durationSeconds: 64,
    durationLabel: '01:04',
    videoUrl: HERO_AMBIENT_VIDEO_URL,
    chapters: [
      {
        id: 'arrival',
        index: 1,
        title: '01 · Architectural Arrival & Facade',
        startTime: 0,
        endTime: 16,
        timeLabel: '00:00',
        image: imgs[0],
        caption: `${property.title} — ${property.location.neighbourhood}, ${city}`,
        camera: { fromScale: 1.02, toScale: 1.13, fromX: 0, toX: -1.8, fromY: 0, toY: -1.2 },
      },
      {
        id: 'reception',
        index: 2,
        title: '02 · Principal Reception & Living Volume',
        startTime: 16,
        endTime: 32,
        timeLabel: '00:16',
        image: imgs[1] || imgs[0],
        caption: `Gallery-scale entertaining spaces with bespoke natural stone and floor-to-ceiling glazing.`,
        camera: { fromScale: 1.12, toScale: 1.02, fromX: -1.5, toX: 1.5, fromY: 0.8, toY: -0.8 },
      },
      {
        id: 'suite',
        index: 3,
        title: '03 · Primary Suite & Private Atelier',
        startTime: 32,
        endTime: 48,
        timeLabel: '00:32',
        image: imgs[2] || imgs[0],
        caption: `${property.bedrooms} bedroom suites with acoustic isolation and custom millwork.`,
        camera: { fromScale: 1.03, toScale: 1.14, fromX: 1.2, toX: -1.2, fromY: -0.6, toY: 0.9 },
      },
      {
        id: 'twilight',
        index: 4,
        title: '04 · Terrace Horizon & Dusk Illumination',
        startTime: 48,
        endTime: 64,
        timeLabel: '00:48',
        image: imgs[4] || imgs[3] || imgs[0],
        caption: `Golden-hour orientation across ${property.location.neighbourhood} with integrated architectural lighting.`,
        camera: { fromScale: 1.14, toScale: 1.03, fromX: 0, toX: 0, fromY: 1.2, toY: -1.0 },
      },
    ],
  };

  // 2. 3D Spatial Massing & Solar-Path Metadata
  const spatial3D = {
    archetype,
    archetypeLabel:
      archetype === 'sky-penthouse'
        ? 'Crown Triplex Massing & Sky Loggias'
        : archetype === 'georgian-townhouse'
          ? 'Six-Storey Heritage Terrace & Garden Wing'
          : archetype === 'haussmann-lateral'
            ? 'Piano Nobile Courtyard & Balcony Wing'
            : archetype === 'hillside-compound'
              ? 'Stepped Sierra Blanca Terraced Pavilion'
              : 'Cantilevered Waterfront Pavilion & Infinity Deck',
    orientation: cityMeta.solarProfile.split('·')[0].trim(),
    levels: [
      {
        id: 'level-0',
        code: 'L0',
        name: 'Subterranean Gallery & Wellness Sanctuary',
        sqm: Math.round(totalArea * 0.24),
        ceiling: '3.6m',
        highlight: property.amenities?.[3] || 'Spa, Wine Vault & Collectors Gallery',
        pin: { x: -1.8, y: 0.35, z: 1.4 },
      },
      {
        id: 'level-1',
        code: 'L1',
        name: 'Principal Reception, Salon & Terrace Deck',
        sqm: Math.round(totalArea * 0.36),
        ceiling: '4.5m',
        highlight: '18m Double-Height Reception & Zero-Edge Pool',
        pin: { x: 1.6, y: 1.15, z: 1.8 },
      },
      {
        id: 'level-2',
        code: 'L2',
        name: 'Primary Wing & Guest Bedroom Suites',
        sqm: Math.round(totalArea * 0.26),
        ceiling: '3.8m',
        highlight: `${property.bedrooms} En-Suite Bedrooms & Dual Dressing Ateliers`,
        pin: { x: -1.1, y: 2.15, z: -0.8 },
      },
      {
        id: 'level-3',
        code: 'L3',
        name: 'Sky Loggia, Observatory & Sunset Lounge',
        sqm: Math.round(totalArea * 0.14),
        ceiling: '3.5m',
        highlight: '360° Horizon Deck & Outdoor Dining Pavilion',
        pin: { x: 0.7, y: 3.05, z: 0.4 },
      },
    ],
  };

  // 3. Multi-Level Interactive Architectural Floorplan Blueprint
  const floorplans = [
    {
      id: 'ground',
      level: 'Level 01',
      title: 'Arrival & Principal Reception',
      label: 'Level 01 · Arrival & Reception',
      totalSqm: Math.round(totalArea * 0.48),
      ceilingHeight: '4.5m',
      compassDeg: 225,
      rooms: [
        {
          id: 'salon',
          code: '01',
          name: 'Grand Reception Salon',
          sqm: Math.round(totalArea * 0.16),
          dimensions: '14.2m × 8.4m',
          ceiling: '4.5m',
          aspect: 'South-West Panoramic Glazing',
          feature: 'Retractable motorised Vitrocsa glass wall & limestone hearth',
          rect: { x: 60, y: 55, w: 300, h: 195 },
        },
        {
          id: 'dining',
          code: '02',
          name: 'Formal Dining & Wine Gallery',
          sqm: Math.round(totalArea * 0.08),
          dimensions: '8.6m × 6.2m',
          ceiling: '4.2m',
          aspect: 'West Courtyard Aspect',
          feature: 'Temperature-controlled 600-bottle glass wine vitrine',
          rect: { x: 375, y: 55, w: 190, h: 115 },
        },
        {
          id: 'kitchen',
          code: '03',
          name: 'Show Kitchen & Chef Scullery',
          sqm: Math.round(totalArea * 0.07),
          dimensions: '7.8m × 5.8m',
          ceiling: '4.0m',
          aspect: 'East Morning Light',
          feature: 'Book-matched Calacatta monolith island & Gaggenau 400 series',
          rect: { x: 580, y: 55, w: 160, h: 195 },
        },
        {
          id: 'foyer',
          code: '04',
          name: 'Private Lift & Sculpture Gallery',
          sqm: Math.round(totalArea * 0.05),
          dimensions: '6.4m × 5.2m',
          ceiling: '4.5m',
          aspect: 'Central Atrium Skylight',
          feature: 'Honed Roman travertine colonnade & high-speed passenger lift',
          rect: { x: 375, y: 182, w: 190, h: 68 },
        },
        {
          id: 'terrace',
          code: '05',
          name: 'Infinity Pool & Sunken Fire Loggia',
          sqm: Math.round(totalArea * 0.12),
          dimensions: '22.0m × 6.5m',
          ceiling: 'Open Sky',
          aspect: 'Unobstructed Horizon View',
          feature: 'Zero-edge heated saltwater lap pool & outdoor dining pergola',
          rect: { x: 60, y: 268, w: 680, h: 122 },
        },
      ],
    },
    {
      id: 'upper',
      level: 'Level 02',
      title: 'Principal & Guest Bedroom Suites',
      label: 'Level 02 · Principal & Guest Suites',
      totalSqm: Math.round(totalArea * 0.34),
      ceilingHeight: '3.8m',
      compassDeg: 225,
      rooms: [
        {
          id: 'primary-suite',
          code: '06',
          name: 'Primary Bedroom Sanctuary',
          sqm: Math.round(totalArea * 0.12),
          dimensions: '10.8m × 7.2m',
          ceiling: '3.8m',
          aspect: 'Corner Sunset Horizon',
          feature: 'Private wraparound loggia & acoustic motorized silk drapery',
          rect: { x: 60, y: 55, w: 280, h: 205 },
        },
        {
          id: 'atelier',
          code: '07',
          name: 'Dual Dressing Ateliers & Bath Spa',
          sqm: Math.round(totalArea * 0.08),
          dimensions: '8.4m × 6.0m',
          ceiling: '3.8m',
          aspect: 'South Diffused Clerestory',
          feature: 'Carved marble soaking tub, rain hammam & bespoke walnut wardrobes',
          rect: { x: 355, y: 55, w: 195, h: 205 },
        },
        {
          id: 'study',
          code: '08',
          name: 'Private Library & Executive Study',
          sqm: Math.round(totalArea * 0.05),
          dimensions: '6.2m × 5.4m',
          ceiling: '3.8m',
          aspect: 'North Quiet Aspect',
          feature: 'Acoustic oak panelling & concealed security vault',
          rect: { x: 565, y: 55, w: 175, h: 98 },
        },
        {
          id: 'guest-wing',
          code: '09',
          name: 'Guest Bedroom Suites II–IV',
          sqm: Math.round(totalArea * 0.09),
          dimensions: '12.5m × 5.6m',
          ceiling: '3.6m',
          aspect: 'East & South Garden Views',
          feature: 'Three self-contained en-suite bedrooms with private balconies',
          rect: { x: 565, y: 165, w: 175, h: 225 },
        },
        {
          id: 'upper-loggia',
          code: '10',
          name: 'Sunset Horizon Loggia',
          sqm: Math.round(totalArea * 0.05),
          dimensions: '16.0m × 3.4m',
          ceiling: 'Cantilevered Louvres',
          aspect: 'South-West Panorama',
          feature: 'Frameless glass balustrade overlooking primary entertaining deck',
          rect: { x: 60, y: 275, w: 490, h: 115 },
        },
      ],
    },
    {
      id: 'wellness',
      level: 'Level 03',
      title: 'Wellness & Collectors Gallery',
      label: 'Level 03 · Wellness & Collectors Level',
      totalSqm: Math.round(totalArea * 0.18),
      ceilingHeight: '3.6m',
      compassDeg: 225,
      rooms: [
        {
          id: 'spa',
          code: '11',
          name: 'Hammam, Vitality Pool & Cryo Suite',
          sqm: Math.round(totalArea * 0.07),
          dimensions: '9.5m × 6.2m',
          ceiling: '3.6m',
          aspect: 'Zen Lightwell Courtyard',
          feature: 'Heated stone loungers, cedar sauna & aromatherapy steam room',
          rect: { x: 60, y: 55, w: 320, h: 195 },
        },
        {
          id: 'cinema',
          code: '12',
          name: 'Dolby Atmos Screening Room',
          sqm: Math.round(totalArea * 0.05),
          dimensions: '7.4m × 5.8m',
          ceiling: '3.6m',
          aspect: 'Acoustic Blackout Envelope',
          feature: '12-seat cashmere tiered lounge & 4K laser projection',
          rect: { x: 395, y: 55, w: 345, h: 195 },
        },
        {
          id: 'auto-gallery',
          code: '13',
          name: 'Climate-Controlled Collectors Gallery',
          sqm: Math.round(totalArea * 0.06),
          dimensions: '18.0m × 6.0m',
          ceiling: '3.6m',
          aspect: 'Museum Linear Illumination',
          feature: 'Turntable display plinth, EV fast-charging & private service entry',
          rect: { x: 60, y: 265, w: 680, h: 125 },
        },
      ],
    },
  ];

  return {
    videoTour,
    spatial3D,
    floorplans,
    enclaveIntelligence: cityMeta,
  };
}

export function getCityIntelligence(city) {
  return CITY_INTELLIGENCE[city] || CITY_INTELLIGENCE.Dubai;
}
