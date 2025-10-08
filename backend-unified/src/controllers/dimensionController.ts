import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createDimensionSchema, updateDimensionSchema, searchDimensionSchema } from '../validators/dimension';

const prisma = new PrismaClient();

/**
 * Get all machinery dimensions with optional search
 */
export const getDimensions = async (req: Request, res: Response) => {
  try {
    const { model, page, limit } = searchDimensionSchema.parse(req.query);

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (model) {
      // Search for model in the applicableModels array (case-insensitive)
      where.applicableModels = {
        hasSome: [model], // Exact match
      };
    }

    const [dimensions, total] = await Promise.all([
      prisma.machineryDimension.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.machineryDimension.count({ where }),
    ]);

    res.json({
      success: true,
      data: dimensions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error getting dimensions:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch dimensions',
    });
  }
};

/**
 * Search dimensions by model (fuzzy search)
 */
export const searchDimensionsByModel = async (req: Request, res: Response) => {
  try {
    const { model } = req.params;

    if (!model) {
      return res.status(400).json({
        success: false,
        message: 'Model parameter is required',
      });
    }

    // Search for dimensions where the model is in the applicableModels array
    // Using case-insensitive search
    const dimensions = await prisma.machineryDimension.findMany({
      where: {
        applicableModels: {
          hasSome: [model],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // If no exact match, try fuzzy search
    if (dimensions.length === 0) {
      const allDimensions = await prisma.machineryDimension.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Filter dimensions that have any model containing the search term (case-insensitive)
      const fuzzyMatches = allDimensions.filter(dim =>
        dim.applicableModels.some(m => 
          m.toLowerCase().includes(model.toLowerCase())
        )
      );

      return res.json({
        success: true,
        data: fuzzyMatches,
        meta: {
          searchType: 'fuzzy',
          total: fuzzyMatches.length,
        },
      });
    }

    res.json({
      success: true,
      data: dimensions,
      meta: {
        searchType: 'exact',
        total: dimensions.length,
      },
    });
  } catch (error: any) {
    console.error('Error searching dimensions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search dimensions',
    });
  }
};

/**
 * Get a single dimension by ID
 */
export const getDimensionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dimension = await prisma.machineryDimension.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!dimension) {
      return res.status(404).json({
        success: false,
        message: 'Dimension not found',
      });
    }

    res.json({
      success: true,
      data: dimension,
    });
  } catch (error: any) {
    console.error('Error getting dimension:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dimension',
    });
  }
};

/**
 * Create a new machinery dimension
 */
export const createDimension = async (req: Request, res: Response) => {
  try {
    const validatedData = createDimensionSchema.parse(req.body);
    const userId = (req as any).user.id;

    const dimension = await prisma.machineryDimension.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: dimension,
      message: 'Dimension created successfully',
    });
  } catch (error: any) {
    console.error('Error creating dimension:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create dimension',
    });
  }
};

/**
 * Update a machinery dimension
 */
export const updateDimension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateDimensionSchema.parse(req.body);
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Check if dimension exists
    const existingDimension = await prisma.machineryDimension.findUnique({
      where: { id },
    });

    if (!existingDimension) {
      return res.status(404).json({
        success: false,
        message: 'Dimension not found',
      });
    }

    // Check authorization (only creator or admin can update)
    if (existingDimension.createdBy !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this dimension',
      });
    }

    const dimension = await prisma.machineryDimension.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: dimension,
      message: 'Dimension updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating dimension:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update dimension',
    });
  }
};

/**
 * Delete a machinery dimension
 */
export const deleteDimension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Check if dimension exists
    const existingDimension = await prisma.machineryDimension.findUnique({
      where: { id },
    });

    if (!existingDimension) {
      return res.status(404).json({
        success: false,
        message: 'Dimension not found',
      });
    }

    // Check authorization (only creator or admin can delete)
    if (existingDimension.createdBy !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this dimension',
      });
    }

    await prisma.machineryDimension.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Dimension deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting dimension:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete dimension',
    });
  }
};

