import { z } from 'zod';

export const machinerySpecificationsSchema = z.object({
  weight: z.number().positive('Weight must be positive'),
  power: z.number().positive('Power must be positive'),
  maxOperatingWeight: z.number().positive('Max operating weight must be positive'),
  bucketCapacity: z.number().positive().optional(),
  maxDigDepth: z.number().positive().optional(),
  maxReach: z.number().positive().optional(),
  transportLength: z.number().positive('Transport length must be positive'),
  transportWidth: z.number().positive('Transport width must be positive'),
  transportHeight: z.number().positive('Transport height must be positive'),
  engineModel: z.string().min(1, 'Engine model is required'),
  fuelCapacity: z.number().positive('Fuel capacity must be positive'),
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
  priceMin: z.coerce.number().positive().optional(),
  priceMax: z.coerce.number().positive().optional(),
  weightMin: z.coerce.number().positive().optional(),
  weightMax: z.coerce.number().positive().optional(),
  powerMin: z.coerce.number().positive().optional(),
  powerMax: z.coerce.number().positive().optional(),
  availability: z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});
