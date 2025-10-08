import { z } from 'zod';

// Schema for creating a machinery dimension
export const createDimensionSchema = z.object({
  applicableModels: z.array(z.string().min(1, 'Model name cannot be empty')).min(1, 'At least one model must be specified'),
  imageUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
});

// Schema for updating a machinery dimension
export const updateDimensionSchema = z.object({
  applicableModels: z.array(z.string().min(1)).min(1).optional(),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
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

