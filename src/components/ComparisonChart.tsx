import React from 'react';
import { Machinery } from '../types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import RadarChart from './RadarChart';
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComparisonChartProps {
  machinery: Machinery[];
}

interface ComparisonData {
  label: string;
  values: number[];
  maxValue: number;
  unit: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ machinery }) => {
  if (machinery.length < 2) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500">
            {machinery.length === 0 
              ? "Selecciona al menos 2 máquinas para comparar" 
              : "Selecciona una máquina más para comenzar la comparación"
            }
          </p>
        </div>
      </Card>
    );
  }

  // Normalizar datos para comparación usando nuevos campos
  const comparisonData: ComparisonData[] = [
    {
      label: 'Peso de Operación (Cab)',
      values: machinery.map(m => m.specifications.cabVersionWeight || m.specifications.canopyVersionWeight || 0),
      maxValue: Math.max(...machinery.map(m => m.specifications.cabVersionWeight || m.specifications.canopyVersionWeight || 0)),
      unit: 'kg'
    },
    {
      label: 'Potencia ISO9249',
      values: machinery.map(m => m.specifications.ratedPowerISO9249 || 0),
      maxValue: Math.max(...machinery.map(m => m.specifications.ratedPowerISO9249 || 0)),
      unit: 'kW'
    },
    {
      label: 'Capacidad de Combustible',
      values: machinery.map(m => m.specifications.fuelTankCapacity || 0),
      maxValue: Math.max(...machinery.map(m => m.specifications.fuelTankCapacity || 0)),
      unit: 'L'
    },
    {
      label: 'Capacidad del Balde',
      values: machinery.map(m => m.specifications.bucketCapacity || 0),
      maxValue: Math.max(...machinery.map(m => m.specifications.bucketCapacity || 0)),
      unit: 'm³'
    },
    {
      label: 'Precio',
      values: machinery.map(m => m.price || 0),
      maxValue: Math.max(...machinery.map(m => m.price || 0)),
      unit: 'USD'
    }
  ];

  // Colores para cada máquina
  const colors = [
    'bg-blue-500',
    'bg-red-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500'
  ];

  const getPerformanceIcon = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 80) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (percentage >= 50) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getPerformanceText = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Bajo';
  };

  return (
    <div className="space-y-6">
      {/* Gráfico Radar */}
      {machinery.length >= 2 && (
        <Card>
          <RadarChart machinery={machinery} />
        </Card>
      )}

      {/* Resumen de Comparación */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Resumen de Comparación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machinery.map((machine, index) => (
            <div key={machine.id} className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className={`w-4 h-4 rounded-full ${colors[index]} mr-3`}></div>
                <h4 className="font-semibold text-sm">{machine.name}</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Fabricante:</span>
                  <span className="font-medium">{machine.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modelo:</span>
                  <span className="font-medium">{machine.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio:</span>
                  <span className="font-medium">
                    {machine.price ? `$${machine.price.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Calificación:</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{machine.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Gráfico de Barras Comparativo */}
      <Card>
        <h3 className="text-xl font-semibold mb-6">Comparación de Especificaciones</h3>
        <div className="space-y-6">
          {comparisonData.map((data, dataIndex) => (
            <div key={dataIndex} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{data.label}</h4>
                <span className="text-sm text-gray-500">Máximo: {data.maxValue} {data.unit}</span>
              </div>
              
              <div className="space-y-2">
                {machinery.map((machine, machineIndex) => {
                  const value = data.values[machineIndex];
                  const percentage = (value / data.maxValue) * 100;
                  
                  return (
                    <div key={machine.id} className="flex items-center space-x-3">
                      <div className="w-24 text-sm font-medium text-gray-700">
                        {machine.name}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div
                          className={`h-6 rounded-full ${colors[machineIndex]} flex items-center justify-end pr-2`}
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {data.label === 'Precio' && value > 0 
                              ? `$${value.toLocaleString()}` 
                              : `${value}${data.label === 'Calificación' ? '' : ` ${data.unit}`}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="w-20 flex items-center justify-center">
                        {getPerformanceIcon(value, data.maxValue)}
                      </div>
                      <div className="w-16 text-xs text-gray-600">
                        {getPerformanceText(value, data.maxValue)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Análisis de Fortalezas y Debilidades */}
      <Card>
        <h3 className="text-xl font-semibold mb-6">Análisis de Fortalezas y Debilidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {machinery.map((machine, index) => {
            const strengths: string[] = [];
            const weaknesses: string[] = [];
            
            // Analizar fortalezas y debilidades
            comparisonData.forEach((data) => {
              const value = data.values[index];
              const percentage = (value / data.maxValue) * 100;
              
              if (percentage >= 80) {
                strengths.push(data.label);
              } else if (percentage <= 40) {
                weaknesses.push(data.label);
              }
            });

            return (
              <div key={machine.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className={`w-4 h-4 rounded-full ${colors[index]} mr-3`}></div>
                  <h4 className="font-semibold">{machine.name}</h4>
                </div>
                
                <div className="space-y-4">
                  {strengths.length > 0 && (
                    <div>
                      <h5 className="font-medium text-green-700 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Fortalezas
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {strengths.map((strength, idx) => (
                          <Badge key={idx} variant="success" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {weaknesses.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2 flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        Debilidades
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {weaknesses.map((weakness, idx) => (
                          <Badge key={idx} variant="error" className="text-xs">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {strengths.length === 0 && weaknesses.length === 0 && (
                    <div className="text-center py-4">
                      <Minus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Rendimiento equilibrado</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ComparisonChart;
