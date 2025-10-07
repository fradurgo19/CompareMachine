import React from 'react';
import { Machinery } from '../types';

interface RadarChartProps {
  machinery: Machinery[];
}

interface ChartData {
  name: string;
  values: number[];
}

const RadarChart: React.FC<RadarChartProps> = ({ machinery }) => {
  if (machinery.length === 0) return null;

  const categories = [
    'Peso',
    'Potencia', 
    'Combustible',
    'Bucket Capacity Range (ISO heaped)',
    'Hydraulic System incl. oil tank (L)'
  ];

  const normalizeValue = (value: number, max: number, min: number = 0) => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  const chartData: ChartData[] = machinery.map((machine, index) => {
    const weight = machine.specifications.cabVersionWeight || machine.specifications.canopyVersionWeight || 0;
    const power = machine.specifications.ratedPowerISO9249 || 0;
    const fuel = machine.specifications.fuelTankCapacity || 0;
    const bucketCapacity = machine.specifications.bucketCapacity || 0;
    const hydraulicSystem = machine.specifications.hydraulicSystemCapacity || 0;
    
    const values = [
      normalizeValue(weight, 10000, 0), // Peso normalizado (kg)
      normalizeValue(power, 100, 0), // Potencia normalizada (kW)
      normalizeValue(fuel, 200, 0), // Combustible normalizado (L)
      normalizeValue(bucketCapacity, 5, 0), // Bucket Capacity normalizado (m³)
      normalizeValue(hydraulicSystem, 300, 0) // Hydraulic System normalizado (L)
    ];

    return {
      name: machine.name,
      values
    };
  });

  const colors = [
    '#3B82F6', // Azul
    '#EF4444', // Rojo
    '#10B981', // Verde
    '#F59E0B', // Amarillo
    '#8B5CF6'  // Púrpura
  ];

  const radius = 120;
  const centerX = 200;
  const centerY = 200;
  const angleStep = (2 * Math.PI) / categories.length;

  const getPoint = (categoryIndex: number, value: number) => {
    const angle = categoryIndex * angleStep - Math.PI / 2; // Comenzar desde arriba
    const distance = (value / 100) * radius;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    return { x, y };
  };

  const createPath = (values: number[]) => {
    const points = values.map((value, index) => getPoint(index, value));
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
    return pathData;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">Análisis Comparativo Radar</h3>
      
      <div className="flex justify-center">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* Líneas de la grilla */}
          {[20, 40, 60, 80, 100].map((level) => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={(level / 100) * radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Líneas radiales */}
          {categories.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const endX = centerX + radius * Math.cos(angle);
            const endY = centerY + radius * Math.sin(angle);
            
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            );
          })}

          {/* Etiquetas de categorías */}
          {categories.map((category, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const labelX = centerX + (radius + 30) * Math.cos(angle);
            const labelY = centerY + (radius + 30) * Math.sin(angle);
            
            return (
              <text
                key={index}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-700"
              >
                {category}
              </text>
            );
          })}

          {/* Líneas de datos */}
          {chartData.map((data, dataIndex) => (
            <path
              key={dataIndex}
              d={createPath(data.values)}
              fill={`${colors[dataIndex]}20`}
              stroke={colors[dataIndex]}
              strokeWidth="2"
              strokeOpacity="0.8"
            />
          ))}

          {/* Puntos de datos */}
          {chartData.map((data, dataIndex) =>
            data.values.map((value, valueIndex) => {
              const point = getPoint(valueIndex, value);
              return (
                <circle
                  key={`${dataIndex}-${valueIndex}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={colors[dataIndex]}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {chartData.map((data, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: colors[index] }}
            ></div>
            <span className="text-sm font-medium">{data.name}</span>
          </div>
        ))}
      </div>

      {/* Escala de valores */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Escala: 0-100% (normalizado según el rango de valores)
        </p>
      </div>
    </div>
  );
};

export default RadarChart;
