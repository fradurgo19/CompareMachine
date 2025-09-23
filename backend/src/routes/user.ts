import { Router } from 'express';
import { Request, Response } from 'express';
// import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';
import { updateUserSchema } from '../validators/auth';
import { ApiResponse } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
});

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
});

// Get user's joint evaluations
router.get('/joint-evaluations', async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
});

export default router;
