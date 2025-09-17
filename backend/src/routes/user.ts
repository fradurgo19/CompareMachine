import { Router } from 'express';
import { Request, Response } from 'express';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';
import { updateUserSchema } from '../validators/auth';
import { ApiResponse } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const data = updateUserSchema.parse(req.body);

    // Check if email is already taken by another user
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      message: 'Profile updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    });
  }
});

// Get user's joint evaluations
router.get('/joint-evaluations', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [evaluations, total] = await Promise.all([
      prisma.jointEvaluation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.jointEvaluation.count({ where: { userId } })
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    const response: ApiResponse<typeof evaluations> = {
      success: true,
      data: evaluations,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting user joint evaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get joint evaluations'
    });
  }
});

export default router;
