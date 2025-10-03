import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import api from '../services/api';
import { useAppContext } from '../context/AppContext';
import MachineryCard from '../molecules/MachineryCard';
import FilterPanel from '../molecules/FilterPanel';
import Button from '../atoms/Button';
import Select from '../atoms/Select';
import { Machinery, SortOptions } from '../types';

interface MachineryGridProps {
  onViewDetails: (machinery: Machinery) => void;
}

const MachineryGrid: React.FC<MachineryGridProps> = ({ onViewDetails }) => {
  const { filters, sortBy, updateSort } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);

  const { data: machineryResponse, isLoading, error } = useQuery({
    queryKey: ['machinery', filters, sortBy],
    queryFn: () => api.getMachinery({
      category: filters.category !== 'all' ? filters.category : undefined,
      manufacturer: filters.manufacturer || undefined,
      availability: filters.availability !== 'all' ? filters.availability : undefined,
      priceMin: filters.priceRange[0],
      priceMax: filters.priceRange[1],
      weightMin: filters.weightRange[0],
      weightMax: filters.weightRange[1],
      powerMin: filters.powerRange[0],
      powerMax: filters.powerRange[1],
      sortBy: sortBy.field,
      sortOrder: sortBy.direction,
    }),
    staleTime: 0, // Always consider data stale
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const machinery = machineryResponse?.data || [];

  // Debug: Log machinery data and filters
  console.log('🔍 MachineryGrid Debug:', {
    totalMachinery: machinery.length,
    filters: filters,
    machineryResponse: machineryResponse,
    firstMachinery: machinery[0],
  });

  const sortOptions = [
    { value: 'name:asc', label: 'Nombre (A-Z)' },
    { value: 'name:desc', label: 'Nombre (Z-A)' },
    { value: 'specifications.weight:asc', label: 'Peso (Bajo a Alto)' },
    { value: 'specifications.weight:desc', label: 'Peso (Alto a Bajo)' },
    { value: 'specifications.power:asc', label: 'Potencia (Baja a Alta)' },
    { value: 'specifications.power:desc', label: 'Potencia (Alta a Baja)' },
    { value: 'price:asc', label: 'Precio (Bajo a Alto)' },
    { value: 'price:desc', label: 'Precio (Alto a Bajo)' },
  ];

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split(':') as [string, 'asc' | 'desc'];
    const newSort: SortOptions = {
      field: field as any,
      direction,
    };
    updateSort(newSort);
  };

  const currentSortValue = `${sortBy.field}:${sortBy.direction}`;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar datos de maquinaria</p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <div className="flex items-center">
            <ArrowUpDown className="w-4 h-4 mr-2 text-gray-500" />
            <Select
              options={sortOptions}
              value={currentSortValue}
              onChange={(e) => handleSortChange(e.target.value)}
              className="min-w-[200px]"
            />
          </div>
        </div>

        {machineryResponse?.meta && (
          <p className="text-sm text-gray-500">
            {machineryResponse.meta.total} resultados encontrados
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading machinery...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && machinery.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No se encontró maquinaria que coincida con tus criterios</p>
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
          >
            Ajustar Filtros
          </Button>
        </div>
      )}

      {/* Machinery Grid */}
      {!isLoading && machinery.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {machinery.map((item) => (
            <MachineryCard
              key={item.id}
              machinery={item}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};

export default MachineryGrid;