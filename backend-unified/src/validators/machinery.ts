import { z } from 'zod';

export const machinerySpecificationsSchema = z.object({
  // Region Offerings
  regionOfferings: z.array(z.string()).optional().default([]),
  
  // Operating Weight Range
  canopyVersionWeight: z.number().positive().optional(),  // kg
  cabVersionWeight: z.number().positive().optional(),     // kg
  
  // Bucket Capacity
  bucketCapacity: z.number().positive().optional(),  // m³
  
  // Emission Standard
  emissionStandardEU: z.string().optional(),
  emissionStandardEPA: z.string().optional(),
  
  // Engine Model
  engineModel: z.string().min(1, 'Engine model is required'),
  
  // Rated Power
  ratedPowerISO9249: z.number().positive('Rated power ISO9249 is required'),  // kW
  ratedPowerSAEJ1349: z.number().positive().optional(),  // kW
  ratedPowerEEC80_1269: z.number().positive().optional(), // kW
  numberOfCylinders: z.number().int().positive().optional(),
  boreByStroke: z.string().optional(),        // mm
  pistonDisplacement: z.number().positive().optional(),  // L
  
  // Relief Valve Settings
  implementCircuit: z.number().positive().optional(),    // MPa
  swingCircuit: z.number().positive().optional(),        // MPa
  travelCircuit: z.number().positive().optional(),       // MPa
  maxTravelSpeedHigh: z.number().positive().optional(),  // km/h
  maxTravelSpeedLow: z.number().positive().optional(),   // km/h
  swingSpeed: z.number().positive().optional(),          // min-1
  standardTrackShoeWidth: z.number().positive().optional(),  // mm
  undercarriageLength: z.number().positive().optional(),     // mm
  undercarriageWidth: z.number().positive().optional(),      // mm
  undercarriageWidthExtend: z.number().positive().optional(),   // mm
  undercarriageWidthRetract: z.number().positive().optional(),  // mm
  
  // Capacity (Refilled)
  fuelTankCapacity: z.number().positive('Fuel tank capacity is required'),  // L
  hydraulicSystemCapacity: z.number().positive().optional(), // L
  
  // Backward compatibility (deprecated but optional)
  weight: z.number().positive().optional(),
  power: z.number().positive().optional(),
  maxOperatingWeight: z.number().positive().optional(),
  maxDigDepth: z.number().positive().optional(),
  maxReach: z.number().positive().optional(),
  transportLength: z.number().positive().optional(),
  transportWidth: z.number().positive().optional(),
  transportHeight: z.number().positive().optional(),
  fuelCapacity: z.number().positive().optional(),
  hydraulicSystem: z.string().optional()
});

export const createMachinerySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  model: z.string().min(1, 'Model is required'),
  series: z.string().min(1, 'Series is required'),
  category: z.enum(['EXCAVATORS', 'BULLDOZERS', 'LOADERS', 'CRANES', 'DUMP_TRUCKS', 'COMPACTORS', 'GRADERS']),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  price: z.number().positive().optional(),
  availability: z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']).default('AVAILABLE'),
  rating: z.number().min(0).max(5).default(0),
  specifications: machinerySpecificationsSchema
});

export const updateMachinerySchema = createMachinerySchema.partial();

export const machineryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  weightMin: z.coerce.number().min(0).optional(),
  weightMax: z.coerce.number().min(0).optional(),
  powerMin: z.coerce.number().min(0).optional(),
  powerMax: z.coerce.number().min(0).optional(),
  availability: z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});
