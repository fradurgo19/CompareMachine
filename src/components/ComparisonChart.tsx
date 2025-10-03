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

  // Crear datos de comparación dinámicamente basados en campos disponibles
  const buildComparisonData = (): ComparisonData[] => {
    const data: ComparisonData[] = [];

    // 3. Operating Weight Range (Cab Version)
    const cabWeights = machinery.map(m => m.specifications.cabVersionWeight || 0);
    if (cabWeights.some(w => w > 0)) {
      data.push({
        label: '3.2 Peso Cab Version (kg)',
        values: cabWeights,
        maxValue: Math.max(...cabWeights),
        unit: 'kg'
      });
    }

    // 3.1 Operating Weight Range (Canopy Version)
    const canopyWeights = machinery.map(m => m.specifications.canopyVersionWeight || 0);
    if (canopyWeights.some(w => w > 0)) {
      data.push({
        label: '3.1 Peso Canopy Version (kg)',
        values: canopyWeights,
        maxValue: Math.max(...canopyWeights),
        unit: 'kg'
      });
    }

    // 4. Bucket Capacity
    const bucketCapacities = machinery.map(m => m.specifications.bucketCapacity || 0);
    if (bucketCapacities.some(b => b > 0)) {
      data.push({
        label: '4. Bucket Capacity (m³)',
        values: bucketCapacities,
        maxValue: Math.max(...bucketCapacities),
        unit: 'm³'
      });
    }

    // 7.1 Rated Power ISO9249
    const powerISO = machinery.map(m => m.specifications.ratedPowerISO9249 || 0);
    if (powerISO.some(p => p > 0)) {
      data.push({
        label: '7.1 Potencia ISO9249 (kW)',
        values: powerISO,
        maxValue: Math.max(...powerISO),
        unit: 'kW'
      });
    }

    // 7.4 Number of Cylinders
    const cylinders = machinery.map(m => m.specifications.numberOfCylinders || 0);
    if (cylinders.some(c => c > 0)) {
      data.push({
        label: '7.4 No. de Cilindros',
        values: cylinders,
        maxValue: Math.max(...cylinders),
        unit: ''
      });
    }

    // 7.6 Piston Displacement
    const displacement = machinery.map(m => m.specifications.pistonDisplacement || 0);
    if (displacement.some(d => d > 0)) {
      data.push({
        label: '7.6 Desplazamiento Pistón (L)',
        values: displacement,
        maxValue: Math.max(...displacement),
        unit: 'L'
      });
    }

    // 8.1 Implement Circuit
    const implementCircuit = machinery.map(m => m.specifications.implementCircuit || 0);
    if (implementCircuit.some(i => i > 0)) {
      data.push({
        label: '8.1 Circuito Implementación (MPa)',
        values: implementCircuit,
        maxValue: Math.max(...implementCircuit),
        unit: 'MPa'
      });
    }

    // 8.4 Max Travel Speed High
    const travelSpeedHigh = machinery.map(m => m.specifications.maxTravelSpeedHigh || 0);
    if (travelSpeedHigh.some(s => s > 0)) {
      data.push({
        label: '8.4 Vel. Desplaz. Alta (km/h)',
        values: travelSpeedHigh,
        maxValue: Math.max(...travelSpeedHigh),
        unit: 'km/h'
      });
    }

    // 8.5 Swing Speed
    const swingSpeed = machinery.map(m => m.specifications.swingSpeed || 0);
    if (swingSpeed.some(s => s > 0)) {
      data.push({
        label: '8.5 Vel. Giro (min⁻¹)',
        values: swingSpeed,
        maxValue: Math.max(...swingSpeed),
        unit: 'min⁻¹'
      });
    }

    // 8.7 Undercarriage Length
    const undercarriageLength = machinery.map(m => m.specifications.undercarriageLength || 0);
    if (undercarriageLength.some(l => l > 0)) {
      data.push({
        label: '8.7 Longitud Tren Rodaje (mm)',
        values: undercarriageLength,
        maxValue: Math.max(...undercarriageLength),
        unit: 'mm'
      });
    }

    // 8.6 Standard Track Shoe Width
    const trackWidth = machinery.map(m => m.specifications.standardTrackShoeWidth || 0);
    if (trackWidth.some(w => w > 0)) {
      data.push({
        label: '8.6 Ancho Zapata (mm)',
        values: trackWidth,
        maxValue: Math.max(...trackWidth),
        unit: 'mm'
      });
    }

    // 9.2 Fuel Tank
    const fuelTank = machinery.map(m => m.specifications.fuelTankCapacity || 0);
    if (fuelTank.some(f => f > 0)) {
      data.push({
        label: '9.2 Tanque Combustible (L)',
        values: fuelTank,
        maxValue: Math.max(...fuelTank),
        unit: 'L'
      });
    }

    // 9.3 Hydraulic System
    const hydraulicSystem = machinery.map(m => m.specifications.hydraulicSystemCapacity || 0);
    if (hydraulicSystem.some(h => h > 0)) {
      data.push({
        label: '9.3 Sistema Hidráulico (L)',
        values: hydraulicSystem,
        maxValue: Math.max(...hydraulicSystem),
        unit: 'L'
      });
    }

    return data;
  };

  const comparisonData = buildComparisonData();

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
        <h3 className="text-xl font-semibold mb-4">Resumen de Máquinas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machinery.map((machine, index) => (
            <div key={machine.id} className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className={`w-4 h-4 rounded-full ${colors[index]} mr-3`}></div>
                <h4 className="font-semibold text-sm">{machine.name}</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>1. Modelo:</span>
                  <span className="font-medium">{machine.model}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fabricante:</span>
                  <span className="font-medium">{machine.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span>6. Motor:</span>
                  <span className="font-medium">{machine.specifications.engineModel}</span>
                </div>
                <div className="flex justify-between">
                  <span>7.1 Potencia:</span>
                  <span className="font-medium">{machine.specifications.ratedPowerISO9249} kW</span>
                </div>
                <div className="flex justify-between">
                  <span>9.2 Combustible:</span>
                  <span className="font-medium">{machine.specifications.fuelTankCapacity} L</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Gráfico de Barras Comparativo */}
      <Card>
        <h3 className="text-xl font-semibold mb-6">Comparación de Especificaciones</h3>
        {comparisonData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No hay especificaciones completas para comparar. 
              Las máquinas seleccionadas usan el formato antiguo de especificaciones.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Agrega nuevas máquinas usando "Copiar y Pegar" para ver comparaciones detalladas.
            </p>
          </div>
        ) : (
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
        )}
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
