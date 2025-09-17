import { z } from 'zod';

export const jointEvaluationSchema = z.object({
  joint: z.number().int().positive('Joint number must be positive'),
  standardDiameter: z.number().positive('Standard diameter must be positive'),
  structureHousingDiameter: z.number().positive('Structure housing diameter must be positive'),
  bushingDiameter: z.number().positive('Bushing diameter must be positive'),
  pinDiameter: z.number().positive('Pin diameter must be positive'),
  model: z.string().min(1, 'Model is required'),
  series: z.string().min(1, 'Series is required'),
  ott: z.string().min(1, 'OTT is required')
});

export const jointEvaluationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  model: z.string().optional(),
  series: z.string().optional(),
  ott: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});
