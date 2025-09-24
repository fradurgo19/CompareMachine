import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const register = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
};

export const login = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
};

export const getProfile = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
};
