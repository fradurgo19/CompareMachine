import React, { useState, useEffect } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import Button from '../atoms/Button';
import Select from '../atoms/Select';
import Input from '../atoms/Input';
import { FilterOptions, MachineryCategory } from '../types';
import { useAppContext } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { machineryApi } from '../services/machineryApi';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { filters, updateFilters } = useAppContext();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const { data: manufacturersResponse } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: () => machineryApi.getManufacturers(),
  });

  const manufacturers = manufacturersResponse?.data || [];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'excavators', label: 'Excavators' },
  ];

  // Fixed list of manufacturers
  const manufacturerOptions = [
    { value: '', label: 'All Manufacturers' },
    { value: 'Hitachi', label: 'Hitachi' },
    { value: 'Case', label: 'Case' },
    { value: 'Liugong', label: 'Liugong' },
  ];

  const handleApplyFilters = () => {
    updateFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      category: 'all',
      manufacturer: '',
      priceRange: [0, 1000000],
      weightRange: [0, 100],
      powerRange: [0, 1000],
      availability: 'all',
    };
    setLocalFilters(resetFilters);
    updateFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Filter Machinery</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto h-full pb-20">
          <Select
            label="Category"
            options={categoryOptions}
            value={localFilters.category}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              category: e.target.value as MachineryCategory | 'all'
            })}
          />

          <Select
            label="Manufacturer"
            options={manufacturerOptions}
            value={localFilters.manufacturer}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              manufacturer: e.target.value
            })}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;