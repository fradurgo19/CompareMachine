import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { Machinery } from '../types';

interface MachineryCardProps {
  machinery: Machinery;
  onSelect?: (machinery: Machinery) => void;
  isSelected?: boolean;
}

const MachineryCard: React.FC<MachineryCardProps> = ({
  machinery,
  onSelect,
  isSelected = false
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/machinery/${machinery.id}`);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      EXCAVATORS: 'Excavadora',
      BULLDOZERS: 'Bulldozer',
      LOADERS: 'Cargadora',
      CRANES: 'Grúa',
      DUMP_TRUCKS: 'Volquete',
      COMPACTORS: 'Compactadora',
      GRADERS: 'Niveladora',
    };
    return labels[category] || category;
  };

  const specs = machinery.specifications;

  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{machinery.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{machinery.model}</Badge>
              <Badge variant="secondary">{getCategoryLabel(machinery.category)}</Badge>
            </div>
            <p className="text-sm text-gray-600">
              {machinery.manufacturer} • {machinery.series}
            </p>
          </div>
        </div>

        {/* Key Specifications */}
        <div className="space-y-3 mb-4">
          {/* Operating Weight */}
          {(specs?.cabVersionWeight || specs?.canopyVersionWeight) && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {specs.cabVersionWeight && (
                <div>
                  <span className="text-gray-500">Peso Cab:</span>
                  <span className="ml-2 font-medium">{specs.cabVersionWeight.toFixed(0)} kg</span>
                </div>
              )}
              {specs.canopyVersionWeight && (
                <div>
                  <span className="text-gray-500">Peso Canopy:</span>
                  <span className="ml-2 font-medium">{specs.canopyVersionWeight.toFixed(0)} kg</span>
                </div>
              )}
            </div>
          )}

          {/* Engine & Power */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Motor:</span>
              <span className="ml-2 font-medium">{specs?.engineModel || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Potencia ISO:</span>
              <span className="ml-2 font-medium">{specs?.ratedPowerISO9249 || 0} kW</span>
            </div>
          </div>

          {/* Capacities */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {specs?.bucketCapacity && (
              <div>
                <span className="text-gray-500">Balde:</span>
                <span className="ml-2 font-medium">{specs.bucketCapacity} m³</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Combustible:</span>
              <span className="ml-2 font-medium">{specs?.fuelTankCapacity || 0} L</span>
            </div>
          </div>

          {/* Emission Standards */}
          {(specs?.emissionStandardEU || specs?.emissionStandardEPA) && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {specs.emissionStandardEU && (
                <div>
                  <span className="text-gray-500">Emisión EU:</span>
                  <span className="ml-2 font-medium">{specs.emissionStandardEU}</span>
                </div>
              )}
              {specs.emissionStandardEPA && (
                <div>
                  <span className="text-gray-500">Emisión EPA:</span>
                  <span className="ml-2 font-medium">{specs.emissionStandardEPA}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="mb-4">
          <Badge
            variant={
              machinery.availability === 'AVAILABLE'
                ? 'success'
                : machinery.availability === 'LIMITED'
                ? 'warning'
                : 'danger'
            }
          >
            {machinery.availability === 'AVAILABLE'
              ? 'Disponible'
              : machinery.availability === 'LIMITED'
              ? 'Limitado'
              : 'No Disponible'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onSelect && (
            <Button
              variant={isSelected ? 'primary' : 'outline'}
              onClick={() => onSelect(machinery)}
              className="flex-1"
            >
              {isSelected ? 'Seleccionada' : 'Seleccionar'}
            </Button>
          )}
          <Button variant="ghost" onClick={handleViewDetails}>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MachineryCard;
