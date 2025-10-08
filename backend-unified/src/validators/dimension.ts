import { z } from 'zod';

// Schema for creating a machinery dimension
export const createDimensionSchema = z.object({
  applicableModels: z.array(
    z.string()
      .min(1, 'Model name cannot be empty')
      .transform(val => val.trim()) // Trim whitespace
  ).min(1, 'At least one model must be specified'),
  imageUrl: z.string()
    .url('Must be a valid URL')
    .transform(val => val.trim()),
  description: z.string()
    .optional()
    .transform(val => val?.trim() || undefined),
});

// Schema for updating a machinery dimension
export const updateDimensionSchema = z.object({
  applicableModels: z.array(
    z.string()
      .min(1)
      .transform(val => val.trim())
  ).min(1).optional(),
  imageUrl: z.string()
    .url()
    .transform(val => val.trim())
    .optional(),
  description: z.string()
    .optional()
    .transform(val => val?.trim() || undefined),
});

// Schema for search query
export const searchDimensionSchema = z.object({
  model: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
});

export type CreateDimensionInput = z.infer<typeof createDimensionSchema>;
export type UpdateDimensionInput = z.infer<typeof updateDimensionSchema>;
export type SearchDimensionInput = z.infer<typeof searchDimensionSchema>;

