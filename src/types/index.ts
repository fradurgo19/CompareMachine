// Core type definitions for the Heavy Machinery Comparator

export interface Machinery {
  id: string;
  name: string;
  model: string;
  series: string;
  category: MachineryCategory;
  manufacturer: string;
  images: string[];
  specifications: MachinerySpecifications;
  price?: number;
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  rating: number;
  createdAt: string;
}

export interface MachinerySpecifications {
  weight: number; // in tons
  power: number; // in HP
  maxOperatingWeight: number;
  bucketCapacity?: number;
  maxDigDepth?: number;
  maxReach?: number;
  transportLength: number;
  transportWidth: number;
  transportHeight: number;
  engineModel: string;
  fuelCapacity: number;
  hydraulicSystem?: string;
}

export type MachineryCategory = 
  | 'EXCAVATORS'
  | 'BULLDOZERS'
  | 'LOADERS'
  | 'CRANES'
  | 'DUMP_TRUCKS'
  | 'COMPACTORS'
  | 'GRADERS';

export interface ComparisonItem extends Machinery {
  isSelected: boolean;
}

export interface JointEvaluation {
  id: number;
  joint: number;
  standardDiameter: number;
  structureHousingDiameter: number;
  bushingDiameter: number;
  pinDiameter: number;
  criterion: number;
  aeResult: number;
  apResult: number;
  epResult: number;
  beResult: number;
  bpResult: number;
  criteria: string[];
  model: string;
  series: string;
  ott: string;
  photos: File[];
}

export interface FilterOptions {
  category: MachineryCategory | 'all';
  manufacturer: string;
  priceRange: [number, number];
  weightRange: [number, number];
  powerRange: [number, number];
  availability: 'all' | 'AVAILABLE' | 'LIMITED';
}

export interface SortOptions {
  field: keyof Machinery | 'specifications.weight' | 'specifications.power';
  direction: 'asc' | 'desc';
}

export interface AppContextType {
  selectedMachinery: string[];
  comparisonMode: boolean;
  filters: FilterOptions;
  sortBy: SortOptions;
  setSelectedMachinery: (ids: string[]) => void;
  toggleComparisonMode: () => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  updateSort: (sort: SortOptions) => void;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}