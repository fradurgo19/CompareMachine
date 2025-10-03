import { Request, Response } from 'express';
import { prisma } from '../index';
import { machineryQuerySchema, createMachinerySchema, updateMachinerySchema } from '../validators/machinery';
import { ApiResponse } from '../types';

export const getMachinery = async (req: Request, res: Response) => {
  try {
    const query = machineryQuerySchema.parse(req.query);
    const { page, limit, category, manufacturer, priceMin, priceMax, weightMin, weightMax, powerMin, powerMax, availability, search, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (manufacturer) {
      where.manufacturer = {
        contains: manufacturer,
        mode: 'insensitive'
      };
    }

    if (availability) {
      where.availability = availability;
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = priceMin;
      if (priceMax) where.price.lte = priceMax;
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
    if (sortBy) {
      if (sortBy.includes('.')) {
        const [relation, field] = sortBy.split('.');
        orderBy = { [relation]: { [field]: sortOrder } };
      } else {
        orderBy = { [sortBy]: sortOrder };
      }
    }

    // Get machinery with specifications
    const [machinery, total] = await Promise.all([
      prisma.machinery.findMany({
        where,
        include: {
          specifications: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.machinery.count({ where })
    ]);

    console.log('🔍 Backend Debug - Before filtering:', {
      totalFromDB: total,
      machineryCount: machinery.length,
      filters: { weightMin, weightMax, powerMin, powerMax },
      firstMachinery: machinery[0] ? {
        name: machinery[0].name,
        model: machinery[0].model,
        specs: machinery[0].specifications
      } : null
    });

    // Apply weight and power filters if specified
    let filteredMachinery = machinery;
    if (weightMin || weightMax || powerMin || powerMax) {
      filteredMachinery = machinery.filter((m: any) => {
        if (!m.specifications) {
          console.log(`❌ ${m.name} - No specifications`);
          return false;
        }
        
        // Get weight from new fields (canopyVersionWeight/cabVersionWeight) or old field (weight)
        const weight = m.specifications.cabVersionWeight || 
                      m.specifications.canopyVersionWeight || 
                      m.specifications.weight || 
                      0;
        
        // Get power from new field (ratedPowerISO9249) or old field (power)
        const power = m.specifications.ratedPowerISO9249 || 
                     m.specifications.power || 
                     0;
        
        console.log(`🔍 Checking ${m.name}:`, { weight, power, weightMin, weightMax, powerMin, powerMax });
        
        if (weightMin && weight < weightMin) {
          console.log(`❌ ${m.name} - Weight ${weight} < ${weightMin}`);
          return false;
        }
        if (weightMax && weight > weightMax) {
          console.log(`❌ ${m.name} - Weight ${weight} > ${weightMax}`);
          return false;
        }
        if (powerMin && power < powerMin) {
          console.log(`❌ ${m.name} - Power ${power} < ${powerMin}`);
          return false;
        }
        if (powerMax && power > powerMax) {
          console.log(`❌ ${m.name} - Power ${power} > ${powerMax}`);
          return false;
        }
        
        console.log(`✅ ${m.name} - PASSED filters`);
        return true;
      });
    }

    console.log('🔍 Backend Debug - After filtering:', {
      filteredCount: filteredMachinery.length,
      names: filteredMachinery.map(m => m.name)
    });

    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<typeof filteredMachinery> = {
      success: true,
      data: filteredMachinery,
      meta: {
        total,
        page,
        limit,
        totalPages
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
