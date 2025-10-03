import React from 'react';
import { Star, Eye, GitCompare as Compare } from 'lucide-react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { Machinery } from '../types';
import { useAppContext } from '../context/AppContext';

interface MachineryCardProps {
  machinery: Machinery;
  onViewDetails: (machinery: Machinery) => void;
}

const MachineryCard: React.FC<MachineryCardProps> = ({
  machinery,
  onViewDetails
}) => {
  const { selectedMachinery, setSelectedMachinery, comparisonMode } = useAppContext();
  const isSelected = selectedMachinery.includes(machinery.id);

  const handleToggleSelection = () => {
    if (isSelected) {
      setSelectedMachinery(selectedMachinery.filter(id => id !== machinery.id));
    } else if (selectedMachinery.length < 5) {
      setSelectedMachinery([...selectedMachinery, machinery.id]);
    }
  };

  const handleQuickCompare = () => {
    handleToggleSelection();
  };

  const getAvailabilityBadge = () => {
    const avail = machinery.availability.toUpperCase();
    if (avail === 'AVAILABLE') return <Badge variant="success">Disponible</Badge>;
    if (avail === 'LIMITED') return <Badge variant="warning">Limitado</Badge>;
    return <Badge variant="error">No Disponible</Badge>;
  };

  const specs = machinery.specifications;

  return (
    <Card 
      hover={true} 
      padding="default"
      className={`transition-all duration-300 ${
        comparisonMode && isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {machinery.name}
            </h3>
            <p className="text-sm text-gray-600">{machinery.manufacturer}</p>
            <p className="text-xs text-gray-500">
              {machinery.model} • {machinery.series}
            </p>
          </div>
          <div>
            {getAvailabilityBadge()}
          </div>
        </div>

        {/* Key Specifications */}
        <div className="space-y-2 text-sm">
          {/* 2. Region Offerings */}
          <div className="flex justify-between">
            <span className="text-gray-500">2. Region:</span>
            <span className="ml-2 font-medium text-right">
              {specs?.regionOfferings && specs.regionOfferings.length > 0
                ? specs.regionOfferings.slice(0, 2).join(', ')
                : '—'}
            </span>
          </div>
          
          {/* 3.1 Canopy Version Weight */}
          <div className="flex justify-between">
            <span className="text-gray-500">3.1 Peso Canopy:</span>
            <span className="ml-2 font-medium">
              {specs?.canopyVersionWeight?.toFixed(0) || '—'} kg
            </span>
          </div>
          
          {/* 3.2 Cab Version Weight */}
          <div className="flex justify-between">
            <span className="text-gray-500">3.2 Peso Cab:</span>
            <span className="ml-2 font-medium">
              {specs?.cabVersionWeight?.toFixed(0) || '—'} kg
            </span>
          </div>

          {/* 4. Bucket Capacity */}
          <div className="flex justify-between">
            <span className="text-gray-500">4. Balde:</span>
            <span className="ml-2 font-medium">
              {specs?.bucketCapacity || '—'} m³
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(machinery)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Detalles
          </Button>
          
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={handleQuickCompare}
            disabled={!isSelected && selectedMachinery.length >= 5}
            title={!isSelected && selectedMachinery.length >= 5 ? 'Máximo 5 máquinas para comparar' : ''}
            className="flex-1"
          >
            <Compare className="w-4 h-4 mr-1" />
            {isSelected ? 'Seleccionada' : 'Comparar'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MachineryCard;
