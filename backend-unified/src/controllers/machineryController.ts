import { Request, Response } from 'express';
import { prisma } from '../index';
import { machineryQuerySchema, createMachinerySchema, updateMachinerySchema } from '../validators/machinery';
import { ApiResponse } from '../types';

// TEMPORARY DIAGNOSTIC ENDPOINT - Returns ALL machinery with NO filters
export const getAllMachineryDirect = async (req: Request, res: Response) => {
  try {
    const allMachinery = await prisma.machinery.findMany({
      include: {
        specifications: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('🔍 DIAGNOSTIC - Total machinery in DB:', allMachinery.length);
    console.log('🔍 DIAGNOSTIC - All names:', allMachinery.map(m => ({ name: m.name, model: m.model, created: m.createdAt })));

    res.json({
      success: true,
      data: allMachinery,
      meta: {
        total: allMachinery.length,
        message: 'DIAGNOSTIC ENDPOINT - NO FILTERS APPLIED'
      }
    });
  } catch (error: any) {
    console.error('Error in diagnostic endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Diagnostic endpoint failed',
      error: error.message
    });
  }
};

export const getMachinery = async (req: Request, res: Response) => {
  try {
    const query = machineryQuerySchema.parse(req.query);
    const { page, limit, category, manufacturer, priceMin, priceMax, weightMin, weightMax, powerMin, powerMax, availability, search, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    // Build where clause - SIMPLIFIED
    const where: any = {};

    // Only filter by category if it's explicitly set (not 'all')
    // Convert to uppercase to match DB format
    if (category && category !== 'all') {
      where.category = category.toUpperCase();
    }

    // Only filter by manufacturer if it's not empty
    if (manufacturer && manufacturer.trim() !== '') {
      where.manufacturer = {
        contains: manufacturer,
        mode: 'insensitive'
      };
    }

    // Only filter by availability if it's explicitly set
    if (availability) {
      where.availability = availability;
    }

    // Only apply price filter if values are realistic
    if (priceMin && priceMin > 0) {
      where.price = { ...where.price, gte: priceMin };
    }
    if (priceMax && priceMax < 10000000) {
      where.price = { ...where.price, lte: priceMax };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy && sortBy !== 'name') { // Default sort is name, skip if it's that
      if (sortBy.includes('.')) {
        const [relation, field] = sortBy.split('.');
        orderBy = { [relation]: { [field]: sortOrder } };
      } else {
        orderBy = { [sortBy]: sortOrder };
      }
    }

    // Get ALL machinery from DB with specifications
    const [allMachinery, total] = await Promise.all([
      prisma.machinery.findMany({
        where,
        include: {
          specifications: true
        },
        orderBy
      }),
      prisma.machinery.count({ where })
    ]);

    // Apply client-side weight and power filters (only if user changed them)
    let filteredMachinery = allMachinery;
    const hasWeightFilter = (weightMin && weightMin > 0) || (weightMax && weightMax < 1000000);
    const hasPowerFilter = (powerMin && powerMin > 0) || (powerMax && powerMax < 1000000);
    
    if (hasWeightFilter || hasPowerFilter) {
      filteredMachinery = allMachinery.filter((m: any) => {
        if (!m.specifications) return true; // Include if no specs
        
        // Get weight (try new fields first, then old)
        const weight = m.specifications.cabVersionWeight || 
                      m.specifications.canopyVersionWeight || 
                      m.specifications.weight || 
                      0;
        
        // Get power (try new fields first, then old)
        const power = m.specifications.ratedPowerISO9249 || 
                     m.specifications.power || 
                     0;
        
        // Apply weight filter only if meaningful
        if (hasWeightFilter) {
          if (weightMin && weightMin > 0 && weight > 0 && weight < weightMin) return false;
          if (weightMax && weightMax < 1000000 && weight > weightMax) return false;
        }
        
        // Apply power filter only if meaningful
        if (hasPowerFilter) {
          if (powerMin && powerMin > 0 && power > 0 && power < powerMin) return false;
          if (powerMax && powerMax < 1000000 && power > powerMax) return false;
        }
        
        return true;
      });
    }

    // Apply pagination AFTER filtering
    const paginatedMachinery = filteredMachinery.slice(skip, skip + limit);

    const response: ApiResponse<typeof paginatedMachinery> = {
      success: true,
      data: paginatedMachinery,
      meta: {
        total: filteredMachinery.length,
        page,
        limit,
        totalPages: Math.ceil(filteredMachinery.length / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting machinery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch machinery'
    });
  }
};

export const getMachineryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const machinery = await prisma.machinery.findUnique({
      where: { id },
      include: {
        specifications: true
      }
    });

    if (!machinery) {
      return res.status(404).json({
        success: false,
        message: 'Machinery not found'
      });
    }

    const response: ApiResponse<typeof machinery> = {
      success: true,
      data: machinery
    };

    return res.json(response);
  } catch (error) {
    console.error('Error getting machinery by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch machinery'
    });
  }
};

export const createMachinery = async (req: Request, res: Response) => {
  try {
    const data = createMachinerySchema.parse(req.body);

    // Use upsert to update if exists, create if not
    const machinery = await prisma.machinery.upsert({
      where: {
        name_model: {
          name: data.name,
          model: data.model
        }
      },
      update: {
        series: data.series,
        category: data.category,
        manufacturer: data.manufacturer,
        images: data.images,
        price: data.price,
        availability: data.availability,
        rating: data.rating,
        specifications: {
          upsert: {
            create: data.specifications,
            update: data.specifications
          }
        }
      },
      create: {
        ...data,
        specifications: {
          create: data.specifications
        }
      },
      include: {
        specifications: true
      }
    });

    const response: ApiResponse<typeof machinery> = {
      success: true,
      data: machinery,
      message: machinery.createdAt.getTime() === machinery.updatedAt.getTime() 
        ? 'Machinery created successfully' 
        : 'Machinery updated successfully'
    };

    res.status(machinery.createdAt.getTime() === machinery.updatedAt.getTime() ? 201 : 200).json(response);
  } catch (error) {
    console.error('Error creating machinery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create machinery'
    });
  }
};

export const updateMachinery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateMachinerySchema.parse(req.body);

    const { specifications, ...machineryData } = data;
    
    const machinery = await prisma.machinery.update({
      where: { id },
      data: {
        ...machineryData,
        ...(specifications && {
          specifications: {
            upsert: {
              create: specifications,
              update: specifications
            }
          }
        })
      },
      include: {
        specifications: true
      }
    });

    const response: ApiResponse<typeof machinery> = {
      success: true,
      data: machinery,
      message: 'Machinery updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating machinery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update machinery'
    });
  }
};

export const deleteMachinery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.machinery.delete({
      where: { id }
    });

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Machinery deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting machinery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete machinery'
    });
  }
};

export const getManufacturers = async (req: Request, res: Response) => {
  try {
    const manufacturers = await prisma.machinery.findMany({
      select: {
        manufacturer: true
      },
      distinct: ['manufacturer'],
      orderBy: {
        manufacturer: 'asc'
      }
    });

    const manufacturerNames = manufacturers.map((m: any) => m.manufacturer);

    const response: ApiResponse<string[]> = {
      success: true,
      data: manufacturerNames
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting manufacturers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch manufacturers'
    });
  }
};
