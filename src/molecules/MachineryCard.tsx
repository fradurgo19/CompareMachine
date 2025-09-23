import React from 'react';
import { Star, Eye, GitCompare as Compare } from 'lucide-react';
import { Machinery } from '../types';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
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
    switch (machinery.availability) {
      case 'available':
        return <Badge variant="success">Disponible</Badge>;
      case 'limited':
        return <Badge variant="warning">Limitado</Badge>;
      case 'unavailable':
        return <Badge variant="error">No Disponible</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card 
      hover={true} 
      padding="none"
      className={`overflow-hidden transition-all duration-300 ${
        comparisonMode && isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <div className="relative">
        <img
          src={machinery.images[0]}
          alt={machinery.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          {getAvailabilityBadge()}
        </div>
        {machinery.price && (
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-md px-2 py-1">
            <span className="text-sm font-semibold text-gray-900">
              ${machinery.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {machinery.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span>{machinery.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-1">{machinery.manufacturer}</p>
        <p className="text-xs text-gray-500 mb-3">
          {machinery.model} • {machinery.series}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Peso:</span>
            <span className="ml-1 font-medium">{machinery.specifications.weight}t</span>
          </div>
          <div>
            <span className="text-gray-500">Potencia:</span>
            <span className="ml-1 font-medium">{machinery.specifications.power}hp</span>
          </div>
        </div>

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