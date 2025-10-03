import { z } from 'zod';

export const machinerySpecificationsSchema = z.object({
  // Region Offerings
  regionOfferings: z.array(z.string()).optional().default([]),
  
  // Operating Weight Range
  canopyVersionWeight: z.number().nonnegative().optional(),  // kg
  cabVersionWeight: z.number().nonnegative().optional(),     // kg
  
  // Bucket Capacity
  bucketCapacity: z.number().nonnegative().optional(),  // m³
  
  // Emission Standard
  emissionStandardEU: z.string().optional(),
  emissionStandardEPA: z.string().optional(),
  
  // Engine Model
  engineModel: z.string().optional().default('Unknown'),
  
  // Rated Power
  ratedPowerISO9249: z.number().nonnegative().optional().default(0),  // kW
  ratedPowerSAEJ1349: z.number().nonnegative().optional(),  // kW
  ratedPowerEEC80_1269: z.number().nonnegative().optional(), // kW
  numberOfCylinders: z.number().int().nonnegative().optional(),
  boreByStroke: z.string().optional(),        // mm
  pistonDisplacement: z.number().nonnegative().optional(),  // L
  
  // Relief Valve Settings
  implementCircuit: z.number().nonnegative().optional(),    // MPa
  swingCircuit: z.number().nonnegative().optional(),        // MPa
  travelCircuit: z.number().nonnegative().optional(),       // MPa
  maxTravelSpeedHigh: z.number().nonnegative().optional(),  // km/h
  maxTravelSpeedLow: z.number().nonnegative().optional(),   // km/h
  swingSpeed: z.number().nonnegative().optional(),          // min-1
  standardTrackShoeWidth: z.number().nonnegative().optional(),  // mm
  undercarriageLength: z.number().nonnegative().optional(),     // mm
  undercarriageWidth: z.number().nonnegative().optional(),      // mm
  undercarriageWidthExtend: z.number().nonnegative().optional(),   // mm
  undercarriageWidthRetract: z.number().nonnegative().optional(),  // mm
  
  // Capacity (Refilled)
  fuelTankCapacity: z.number().nonnegative().optional().default(0),  // L
  hydraulicSystemCapacity: z.number().nonnegative().optional(), // L
  
  // Backward compatibility (deprecated but optional)
  weight: z.number().nonnegative().optional(),
  power: z.number().nonnegative().optional(),
  maxOperatingWeight: z.number().nonnegative().optional(),
  maxDigDepth: z.number().nonnegative().optional(),
  maxReach: z.number().nonnegative().optional(),
  transportLength: z.number().nonnegative().optional(),
  transportWidth: z.number().nonnegative().optional(),
  transportHeight: z.number().nonnegative().optional(),
  fuelCapacity: z.number().nonnegative().optional(),
  hydraulicSystem: z.string().optional()
});

export const createMachinerySchema = z.object({
  name: z.string().min(1, 'Name is required').optional().default('Unknown Machinery'),
  model: z.string().min(1, 'Model is required').optional().default('Unknown'),
  series: z.string().min(1, 'Series is required').optional().default('Unknown Series'),
  category: z.enum(['EXCAVATORS', 'BULLDOZERS', 'LOADERS', 'CRANES', 'DUMP_TRUCKS', 'COMPACTORS', 'GRADERS']).optional().default('EXCAVATORS'),
  manufacturer: z.string().min(1, 'Manufacturer is required').optional().default('Unknown'),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  price: z.number().positive().optional(),
  availability: z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']).optional().default('AVAILABLE'),
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
