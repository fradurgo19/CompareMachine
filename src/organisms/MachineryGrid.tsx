import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { machineryApi } from '../services/machineryApi';
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
    queryFn: () => machineryApi.getMachinery(filters, sortBy),
  });

  const machinery = machineryResponse?.data || [];

  const sortOptions = [
    { value: 'name:asc', label: 'Name (A-Z)' },
    { value: 'name:desc', label: 'Name (Z-A)' },
    { value: 'specifications.weight:asc', label: 'Weight (Low to High)' },
    { value: 'specifications.weight:desc', label: 'Weight (High to Low)' },
    { value: 'specifications.power:asc', label: 'Power (Low to High)' },
    { value: 'specifications.power:desc', label: 'Power (High to Low)' },
    { value: 'price:asc', label: 'Price (Low to High)' },
    { value: 'price:desc', label: 'Price (High to Low)' },
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
        <p className="text-red-600">Error loading machinery data</p>
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
            Filters
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
            {machineryResponse.meta.total} results found
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
          <p className="text-gray-500 mb-4">No machinery found matching your criteria</p>
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
          >
            Adjust Filters
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