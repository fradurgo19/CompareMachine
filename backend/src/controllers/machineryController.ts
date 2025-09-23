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

    // Apply weight and power filters if specified
    let filteredMachinery = machinery;
    if (weightMin || weightMax || powerMin || powerMax) {
      filteredMachinery = machinery.filter((m: any) => {
        if (!m.specifications) return false;
        
        if (weightMin && m.specifications.weight < weightMin) return false;
        if (weightMax && m.specifications.weight > weightMax) return false;
        if (powerMin && m.specifications.power < powerMin) return false;
        if (powerMax && m.specifications.power > powerMax) return false;
        
        return true;
      });
    }

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

    const machinery = await prisma.machinery.create({
      data: {
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
      message: 'Machinery created successfully'
    };

    res.status(201).json(response);
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
