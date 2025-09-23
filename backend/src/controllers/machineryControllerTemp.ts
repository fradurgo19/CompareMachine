import { Request, Response } from 'express';
import { ApiResponse } from '../types';

// Mock data for testing without database
const mockMachinery = [
  {
    id: '1',
    name: 'CAT 320 Hydraulic Excavator',
    model: '320',
    series: 'Next Generation',
    category: 'EXCAVATORS',
    manufacturer: 'Caterpillar',
    images: [
      'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
      'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
    ],
    specifications: {
      weight: 20.2,
      power: 122,
      maxOperatingWeight: 20200,
      bucketCapacity: 0.91,
      maxDigDepth: 6.52,
      maxReach: 9.9,
      transportLength: 9.53,
      transportWidth: 2.55,
      transportHeight: 3.15,
      engineModel: 'Cat C4.4 ACERT',
      fuelCapacity: 410,
      hydraulicSystem: 'Advanced Hydraulic System'
    },
    price: 285000,
    availability: 'AVAILABLE',
    rating: 4.5,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'John Deere 850K Crawler Dozer',
    model: '850K',
    series: 'K-Series',
    category: 'BULLDOZERS',
    manufacturer: 'John Deere',
    images: [
      'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
      'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
    ],
    specifications: {
      weight: 18.7,
      power: 215,
      maxOperatingWeight: 18700,
      transportLength: 5.89,
      transportWidth: 3.05,
      transportHeight: 3.12,
      engineModel: 'John Deere PowerTech PSS',
      fuelCapacity: 340
    },
    price: 420000,
    availability: 'AVAILABLE',
    rating: 4.7,
    createdAt: '2024-01-10T08:15:00Z'
  }
];

export const getMachinery = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const total = mockMachinery.length;
    const machinery = mockMachinery.slice(skip, skip + Number(limit));
    const totalPages = Math.ceil(total / Number(limit));

    const response: ApiResponse<typeof machinery> = {
      success: true,
      data: machinery,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages
      }
    };

    return res.json(response);
  } catch (error) {
    console.error('Error getting machinery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch machinery'
    });
  }
};

export const getMachineryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const machinery = mockMachinery.find(m => m.id === id);

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

export const getManufacturers = async (req: Request, res: Response) => {
  try {
    const manufacturers = [...new Set(mockMachinery.map(m => m.manufacturer))].sort();

    const response: ApiResponse<string[]> = {
      success: true,
      data: manufacturers
    };

    return res.json(response);
  } catch (error) {
    console.error('Error getting manufacturers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch manufacturers'
    });
  }
};

// Placeholder functions for admin operations
export const createMachinery = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
};

export const updateMachinery = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
};

export const deleteMachinery = async (req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: 'Database not configured. Please set up PostgreSQL and run migrations.'
  });
};
