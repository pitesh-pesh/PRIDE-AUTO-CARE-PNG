import { WashPackage, Deal, BayState } from './types';

export const WASH_PACKAGES: WashPackage[] = [
  {
    id: 'express',
    name: 'Pride Express Exterior',
    description: 'Quick top-tier exterior foam wash & protective micro-dry.',
    tier: 1,
    sedanPrice: 50,
    suvPrice: 70,
    inclusions: [
      'High-pressure touchless rinse',
      'pH-neutral active snow foam canopy',
      'Mechanical wheel-face wash',
      'Tire hydration dress',
      'Streak-free exterior micro-dry'
    ]
  },
  {
    id: 'deluxe',
    name: 'The Pride Deluxe',
    description: 'The Hero Tier: flawless exterior protection combined with complete deep interior cabin sanitation.',
    tier: 2,
    sedanPrice: 100,
    suvPrice: 130,
    inclusions: [
      'All Tier 1 Express steps inside the bay',
      'Comprehensive interior cabin vacuuming',
      'Anti-static dash and console wipe down',
      'Streak-free window clarity spray',
      'Organic anti-bacterial cabin deodorization'
    ]
  },
  {
    id: 'royal',
    name: 'The Royal Treatment',
    description: 'The prestige complete detail: underbody mud flush, deep deironizer, engine dress, and premium spray-sealant glaze.',
    tier: 3,
    sedanPrice: 220,
    suvPrice: 280,
    inclusions: [
      'All Tier 2 Deluxe detailing steps',
      'Intensive engine bay degreasing & conditioning',
      'Deep wheel-barrel iron chemical decontamination',
      'Underbody high-impact mud flush',
      'Premium spray sealant gloss coat'
    ]
  }
];

export const SPECIAL_DEALS: Deal[] = [
  {
    id: 'monsoon15',
    title: 'Monsoon Mud Special',
    description: 'Get an instant 15% discount off any Royal Treatment package to clean off heavy road grime.',
    code: 'MONSOON15',
    discountPercentage: 15,
    targetPackageId: 'royal',
    category: 'Weather Alert'
  },
  {
    id: 'welcome10',
    title: 'First-Time Client Special',
    description: 'New to Pride Auto Care? Take K10 off any Deluxe or Royal Treatment wash.',
    code: 'PRIDE10',
    discountFixed: 10,
    category: 'Welcome'
  },
  {
    id: 'midweekboost',
    title: 'Midweek Fleet Boost',
    description: 'Keep your vehicle pristine. Get K15 off any Deluxe treatment on Wednesdays & Thursdays.',
    code: 'MIDWEEK',
    discountFixed: 15,
    targetPackageId: 'deluxe',
    category: 'Flash Deal'
  }
];

export const INITIAL_BAYS: BayState[] = [
  {
    id: 1,
    name: 'Bay 1',
    type: 'Wet Ingress',
    status: 'SOP-Step-2',
    currentVehicle: {
      licensePlate: 'NCD-492',
      model: 'Toyota Land Cruiser 70-Series',
      package: 'The Royal Treatment',
      stepTimeElapsed: 12
    }
  },
  {
    id: 2,
    name: 'Bay 2',
    type: 'Wet Ingress',
    status: 'Available'
  },
  {
    id: 3,
    name: 'Bay 3',
    type: 'Dry Staging',
    status: 'SOP-Step-4',
    currentVehicle: {
      licensePlate: 'PNG-817',
      model: 'Ford Ranger Rapture XL',
      package: 'The Pride Deluxe',
      stepTimeElapsed: 18
    }
  },
  {
    id: 4,
    name: 'Bay 4',
    type: 'Dry Staging',
    status: 'Available'
  }
];

export const SOP_STEPS = [
  {
    num: '01',
    title: 'Heavy Mud Knockdown & Wheels First',
    description: 'Use high-pressure water bars to blast dense road grit from lower rocker panels and wheel arches. Clean wheels, tires, and inner barrels first using separate dedicated wheel brushes to completely avoid cross-contamination.'
  },
  {
    num: '02',
    title: 'Active Snow Foam Blanket',
    description: 'Apply a deep, rich layer of active pH-neutral snow foam across the vehicle from bottom to top. Allow the foam to dwell on the vehicle paint for exactly 3 minutes to break down and lift traffic biofilm before hand contact.'
  },
  {
    num: '03',
    title: 'The Three-Bucket Method',
    description: 'Technicians utilize separate dedicated wash, rinse, and wheel buckets equipped with physical grit-guards. Premium scratch-safe microfiber wash mitts are thoroughly dunked and rinsed in the guard bucket after clearing each individual panel.'
  },
  {
    num: '04',
    title: 'Linear Contact & Specialized Drying',
    description: 'Wash strictly in straight, linear, overlapping motions—never circular, preventing swirl scratches. Dry paintwork using ultra-plush 1200GSM microfibers paired with premium lubricated quick-gloss detail spray.'
  }
];
