import { Machinery, ApiResponse, FilterOptions, SortOptions } from '../types';

// Mock data for development
const mockMachinery: Machinery[] = [
  {
    id: '1',
    name: 'CAT 320 Hydraulic Excavator',
    model: '320',
    series: 'Next Generation',
    category: 'excavators',
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
    availability: 'available',
    rating: 4.5,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'John Deere 850K Crawler Dozer',
    model: '850K',
    series: 'K-Series',
    category: 'bulldozers',
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
      fuelCapacity: 340,
    },
    price: 420000,
    availability: 'available',
    rating: 4.7,
    createdAt: '2024-01-10T08:15:00Z'
  },
  {
    id: '3',
    name: 'Komatsu PC240LC-11 Excavator',
    model: 'PC240LC-11',
    series: 'Dash-11',
    category: 'excavators',
    manufacturer: 'Komatsu',
    images: [
      'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
      'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
    ],
    specifications: {
      weight: 24.1,
      power: 177,
      maxOperatingWeight: 24100,
      bucketCapacity: 1.14,
      maxDigDepth: 6.84,
      maxReach: 10.25,
      transportLength: 10.12,
      transportWidth: 2.8,
      transportHeight: 3.18,
      engineModel: 'Komatsu SAA6D107E-3',
      fuelCapacity: 400,
      hydraulicSystem: 'CLSS (Closed-Load Sensing System)'
    },
    price: 320000,
    availability: 'limited',
    rating: 4.3,
    createdAt: '2024-01-20T14:20:00Z'
  },
  {
    id: '4',
    name: 'Volvo L120H Wheel Loader',
    model: 'L120H',
    series: 'H-Series',
    category: 'loaders',
    manufacturer: 'Volvo',
    images: [
      'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
      'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
    ],
    specifications: {
      weight: 17.2,
      power: 240,
      maxOperatingWeight: 17200,
      bucketCapacity: 3.2,
      transportLength: 8.78,
      transportWidth: 2.7,
      transportHeight: 3.45,
      engineModel: 'Volvo D8J',
      fuelCapacity: 300,
    },
    price: 380000,
    availability: 'available',
    rating: 4.6,
    createdAt: '2024-01-18T11:45:00Z'
  }
];

export const machineryApi = {
  async getMachinery(
    filters?: FilterOptions,
    sort?: SortOptions,
    page = 1,
    limit = 12
  ): Promise<ApiResponse<Machinery[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredMachinery = [...mockMachinery];

    // Apply filters
    if (filters) {
      filteredMachinery = filteredMachinery.filter(machinery => {
        if (filters.category !== 'all' && machinery.category !== filters.category) {
          return false;
        }
        if (filters.manufacturer && !machinery.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase())) {
          return false;
        }
        if (filters.availability !== 'all' && machinery.availability !== filters.availability) {
          return false;
        }
        if (machinery.price && (machinery.price < filters.priceRange[0] || machinery.price > filters.priceRange[1])) {
          return false;
        }
        if (machinery.specifications.weight < filters.weightRange[0] || machinery.specifications.weight > filters.weightRange[1]) {
          return false;
        }
        if (machinery.specifications.power < filters.powerRange[0] || machinery.specifications.power > filters.powerRange[1]) {
          return false;
        }
        return true;
      });
    }

    // Apply sorting
    if (sort) {
      filteredMachinery.sort((a, b) => {
        let aValue: any, bValue: any;
        
        if (sort.field.includes('.')) {
          const [obj, key] = sort.field.split('.') as [keyof Machinery, string];
          aValue = (a[obj] as any)?.[key];
          bValue = (b[obj] as any)?.[key];
        } else {
          aValue = a[sort.field as keyof Machinery];
          bValue = b[sort.field as keyof Machinery];
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sort.direction === 'asc' ? comparison : -comparison;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return sort.direction === 'asc' ? comparison : -comparison;
        }

        return 0;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedMachinery = filteredMachinery.slice(startIndex, startIndex + limit);

    return {
      data: paginatedMachinery,
      success: true,
      meta: {
        total: filteredMachinery.length,
        page,
        limit
      }
    };
  },

  async getMachineryById(id: string): Promise<ApiResponse<Machinery>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const machinery = mockMachinery.find(m => m.id === id);
    
    if (!machinery) {
      return {
        data: {} as Machinery,
        success: false,
        message: 'Machinery not found'
      };
    }

    return {
      data: machinery,
      success: true
    };
  },

  async getManufacturers(): Promise<ApiResponse<string[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const manufacturers = [...new Set(mockMachinery.map(m => m.manufacturer))].sort();
    
    return {
      data: manufacturers,
      success: true
    };
  },

  async addMachinery(machineryData: Omit<Machinery, 'id' | 'createdAt' | 'rating'>): Promise<ApiResponse<Machinery>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newMachinery: Machinery = {
      ...machineryData,
      id: Date.now().toString(),
      rating: 4.0 + Math.random(),
      createdAt: new Date().toISOString(),
    };

    // In a real app, this would persist to a database
    mockMachinery.unshift(newMachinery);

    return {
      data: newMachinery,
      success: true,
      message: 'Machinery added successfully'
    };
  },

  async updateMachinery(id: string, machineryData: Partial<Machinery>): Promise<ApiResponse<Machinery>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = mockMachinery.findIndex(m => m.id === id);
    
    if (index === -1) {
      return {
        data: {} as Machinery,
        success: false,
        message: 'Machinery not found'
      };
    }

    mockMachinery[index] = { ...mockMachinery[index], ...machineryData };

    return {
      data: mockMachinery[index],
      success: true,
      message: 'Machinery updated successfully'
    };
  },

  async deleteMachinery(id: string): Promise<ApiResponse<boolean>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockMachinery.findIndex(m => m.id === id);
    
    if (index === -1) {
      return {
        data: false,
        success: false,
        message: 'Machinery not found'
      };
    }

    mockMachinery.splice(index, 1);

    return {
      data: true,
      success: true,
      message: 'Machinery deleted successfully'
    };
  }
};