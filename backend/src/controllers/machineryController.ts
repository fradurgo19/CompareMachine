import { Request, Response } from 'express';
import { prisma } from '../index';
import { machineryQuerySchema, createMachinerySchema, updateMachinerySchema } from '../validators/machinery';
import { ApiResponse } from '../types';

export const getMachinery = async (req: Request, res: Response) => {
  try {
    const query = machineryQuerySchema.parse(req.query);
    const { page, limit, filters, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.manufacturer) {
      where.manufacturer = {
        contains: filters.manufacturer,
        mode: 'insensitive'
      };
    }

    if (filters?.availability) {
      where.availability = filters.availability;
    }

    if (filters?.priceMin || filters?.priceMax) {
      where.price = {};
      if (filters.priceMin) where.price.gte = filters.priceMin;
      if (filters.priceMax) where.price.lte = filters.priceMax;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { manufacturer: { contains: filters.search, mode: 'insensitive' } }
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
    if (filters?.weightMin || filters?.weightMax || filters?.powerMin || filters?.powerMax) {
      filteredMachinery = machinery.filter(m => {
        if (!m.specifications) return false;
        
        if (filters.weightMin && m.specifications.weight < filters.weightMin) return false;
        if (filters.weightMax && m.specifications.weight > filters.weightMax) return false;
        if (filters.powerMin && m.specifications.power < filters.powerMin) return false;
        if (filters.powerMax && m.specifications.power > filters.powerMax) return false;
        
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

    res.json(response);
  } catch (error) {
    console.error('Error getting machinery by ID:', error);
    res.status(500).json({
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

    const machinery = await prisma.machinery.update({
      where: { id },
      data: {
        ...data,
        ...(data.specifications && {
          specifications: {
            upsert: {
              create: data.specifications,
              update: data.specifications
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

    const manufacturerNames = manufacturers.map(m => m.manufacturer);

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
