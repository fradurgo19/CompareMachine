import React from 'react';
import Card from '../atoms/Card';
import { GitCompare as Compare, MousePointer, BarChart3, CheckCircle } from 'lucide-react';

const ComparisonInstructions: React.FC = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Compare className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Cómo Comparar Máquinas
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MousePointer className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">1. Selecciona las máquinas</p>
                <p className="text-blue-700 text-sm">
                  Haz clic en "Comparar" de cada máquina que quieras analizar (mínimo 2, máximo 5)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">2. Activa la comparación</p>
                <p className="text-blue-700 text-sm">
                  Cuando tengas 2 o más máquinas seleccionadas, haz clic en "Comparar Ahora" para ver los gráficos
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">3. Analiza los resultados</p>
                <p className="text-blue-700 text-sm">
                  Compara especificaciones, precios y rendimiento para tomar la mejor decisión. Puedes seguir seleccionando más máquinas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>💡 Tip:</strong> Las máquinas con mejor rendimiento en cada parámetro se destacan con indicadores verdes, 
              mientras que las que necesitan mejora aparecen en rojo.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComparisonInstructions;
