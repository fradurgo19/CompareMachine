import { Request } from 'express';
import { User } from '@prisma/client';

// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Machinery types
export interface MachineryFilters {
  category?: string;
  manufacturer?: string;
  priceMin?: number;
  priceMax?: number;
  weightMin?: number;
  weightMax?: number;
  powerMin?: number;
  powerMax?: number;
  availability?: string;
  search?: string;
}

export interface MachinerySort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface MachineryQuery {
  page?: number;
  limit?: number;
  filters?: MachineryFilters;
  sort?: MachinerySort;
}

// Joint Evaluation types
export interface JointEvaluationInput {
  joint: number;
  standardDiameter: number;
  structureHousingDiameter: number;
  bushingDiameter: number;
  pinDiameter: number;
  model: string;
  series: string;
  ott: string;
  photos?: Express.Multer.File[];
}

export interface JointEvaluationResult {
  criterion: number;
  aeResult: number;
  apResult: number;
  epResult: number;
  beResult: number;
  bpResult: number;
  criteria: string[];
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Error types
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// File upload types
export interface FileUploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  uploadPath: string;
}
