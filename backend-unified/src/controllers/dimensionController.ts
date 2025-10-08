import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { createDimensionSchema, updateDimensionSchema, searchDimensionSchema } from '../validators/dimension';

// Log to verify this controller is loaded correctly in Vercel
console.log('🔧 MachineryDimension Controller Loaded - Version 2025-10-08T18:15:00Z');

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

    console.log('🔍 Searching for model:', model);

    // Get all dimensions and filter them
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
      orderBy: { createdAt: 'desc' },
    });

    console.log('📊 Total dimensions in DB:', allDimensions.length);

    // Normalize search term: remove spaces, convert to uppercase
    const normalizedSearch = model.trim().toUpperCase().replace(/\s+/g, '');
    
    console.log('🔤 Normalized search term:', normalizedSearch);

    // Filter dimensions that have any model matching the search term
    const matches = allDimensions.filter(dim => {
      const hasMatch = dim.applicableModels.some(m => {
        // Normalize model names: remove spaces, convert to uppercase
        const normalizedModel = m.trim().toUpperCase().replace(/\s+/g, '');
        
        // Check for exact match or partial match
        const exactMatch = normalizedModel === normalizedSearch;
        const partialMatch = normalizedModel.includes(normalizedSearch) || 
                            normalizedSearch.includes(normalizedModel);
        
        if (exactMatch || partialMatch) {
          console.log(`✅ Match found: "${m}" matches "${model}"`);
        }
        
        return exactMatch || partialMatch;
      });
      
      return hasMatch;
    });

    console.log('📋 Matches found:', matches.length);

    return res.json({
      success: true,
      data: matches,
      meta: {
        searchTerm: model,
        total: matches.length,
      },
    });
  } catch (error: any) {
    console.error('Error searching dimensions:', error);
    return res.status(500).json({
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

    return res.json({
      success: true,
      data: dimension,
    });
  } catch (error: any) {
    console.error('Error getting dimension:', error);
    return res.status(500).json({
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
    const data = createDimensionSchema.parse(req.body);
    const userId = (req as any).user.id;

    console.log('📝 Creating dimension:', data.applicableModels.length, 'models');

    const dimension = await prisma.machineryDimension.create({
      data: {
        ...data,
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

    console.log('✅ Dimension created with ID:', dimension.id);

    res.status(201).json({
      success: true,
      data: dimension,
      message: 'Dimension created successfully',
    });
  } catch (error: any) {
    console.error('Error creating dimension:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create dimension'
    });
  }
};

/**
 * Update a machinery dimension
 */
export const updateDimension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateDimensionSchema.parse(req.body);

    console.log('📝 Updating dimension ID:', id);
    console.log('📥 Validated data:', JSON.stringify(data, null, 2));

    const dimension = await prisma.machineryDimension.update({
      where: { id },
      data: data,
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

    console.log('✅ Dimension updated successfully!');
    console.log('📋 Updated models count:', dimension.applicableModels.length);

    res.json({
      success: true,
      data: dimension,
      message: 'Dimension updated successfully',
    });
  } catch (error: any) {
    console.error('❌ Error updating dimension:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update dimension'
    });
  }
};

/**
 * Delete a machinery dimension
 */
export const deleteDimension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
      message: 'Failed to delete dimension'
    });
  }
};

