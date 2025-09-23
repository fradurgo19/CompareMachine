import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Upload, Download, Calculator, FileText } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Card from '../atoms/Card';
import { calculateJointResults } from '../hooks/useJointCalculations';
import { exportToPDF } from '../utils/pdfExport';

interface JointEvaluationRow {
  id: number;
  joint: number;
  standardDiameter: number;
  structureHousingDiameter: number;
  bushingDiameter: number;
  pinDiameter: number;
  model: string;
  series: string;
  ott: string;
  photos: FileList | null;
}

const CriteriaEvaluation: React.FC = () => {
  const [evaluations, setEvaluations] = useState<JointEvaluationRow[]>([
    {
      id: 1,
      joint: 0,
      standardDiameter: 0,
      structureHousingDiameter: 0,
      bushingDiameter: 0,
      pinDiameter: 0,
      model: '',
      series: '',
      ott: '',
      photos: null,
    }
  ]);

  const addNewRow = () => {
    const newId = Math.max(...evaluations.map(e => e.id)) + 1;
    setEvaluations([
      ...evaluations,
      {
        id: newId,
        joint: 0,
        standardDiameter: 0,
        structureHousingDiameter: 0,
        bushingDiameter: 0,
        pinDiameter: 0,
        model: '',
        series: '',
        ott: '',
        photos: null,
      }
    ]);
  };

  const removeRow = (id: number) => {
    if (evaluations.length > 1) {
      setEvaluations(evaluations.filter(e => e.id !== id));
    }
  };

  const updateEvaluation = useCallback((id: number, field: keyof JointEvaluationRow, value: any) => {
    setEvaluations(prevEvaluations =>
      prevEvaluations.map(evaluation =>
        evaluation.id === id ? { ...evaluation, [field]: value } : evaluation
      )
    );
  }, []);

  const exportToCSV = () => {
    const headers = [
      'ARTICULACIÓN',
      'CRITERIO', 
      'DIÁMETRO ESTÁNDAR',
      'DIÁMETRO ALOJAMIENTO',
      'DIÁMETRO BOCINA',
      'DIÁMETRO PIN',
      'A-E',
      'A-P', 
      'E-P',
      'B-E',
      'B-P',
      'CRITERIOS',
      'MODELO',
      'SERIE',
      'OTT'
    ];

    const rows = evaluations.map(evaluation => {
      const calculations = calculateJointResults({
        standardDiameter: evaluation.standardDiameter,
        structureHousingDiameter: evaluation.structureHousingDiameter,
        bushingDiameter: evaluation.bushingDiameter,
        pinDiameter: evaluation.pinDiameter
      });

      return [
        evaluation.joint,
        calculations.criterion,
        evaluation.standardDiameter,
        evaluation.structureHousingDiameter,
        evaluation.bushingDiameter,
        evaluation.pinDiameter,
        calculations.aeResult,
        calculations.apResult,
        calculations.epResult,
        calculations.beResult,
        calculations.bpResult,
        calculations.criteria.join('; '),
        evaluation.model,
        evaluation.series,
        evaluation.ott
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'criterios-evaluacion-articulaciones.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportToPDF = () => {
    const pdfData = evaluations.map(evaluation => {
      const calculations = calculateJointResults({
        standardDiameter: evaluation.standardDiameter,
        structureHousingDiameter: evaluation.structureHousingDiameter,
        bushingDiameter: evaluation.bushingDiameter,
        pinDiameter: evaluation.pinDiameter
      });

      return {
        joint: evaluation.joint,
        criterion: calculations.criterion,
        standardDiameter: evaluation.standardDiameter,
        structureHousingDiameter: evaluation.structureHousingDiameter,
        bushingDiameter: evaluation.bushingDiameter,
        pinDiameter: evaluation.pinDiameter,
        aeResult: calculations.aeResult,
        apResult: calculations.apResult,
        epResult: calculations.epResult,
        beResult: calculations.beResult,
        bpResult: calculations.bpResult,
        criteria: calculations.criteria,
        model: evaluation.model,
        series: evaluation.series,
        ott: evaluation.ott
      };
    });

    exportToPDF(pdfData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criterios para Evaluación de Articulaciones
          </h1>
          <p className="text-gray-600">
            Tabla de análisis integral con cálculos automatizados para evaluaciones de articulaciones de maquinaria
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={addNewRow}
              variant="primary"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Articulación +
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportToPDF}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <Calculator className="w-4 h-4 inline mr-1" />
            {evaluations.length} articulación{evaluations.length !== 1 ? 'es' : ''} evaluada{evaluations.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Evaluation Table */}
        <Card padding="none" className="overflow-x-auto">
          <div className="min-w-[1600px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="min-w-[100px]">ARTICULACIÓN</div>
              <div className="min-w-[80px]">CRITERIO</div>
              <div className="min-w-[120px]">DIÁMETRO ESTÁNDAR</div>
              <div className="min-w-[140px]">DIÁMETRO ALOJAMIENTO</div>
              <div className="min-w-[120px]">DIÁMETRO BOCINA</div>
              <div className="min-w-[100px]">DIÁMETRO PIN</div>
              <div className="min-w-[30px]">A-E</div>
              <div className="col-span-2 min-w-[200px]">CRITERIOS</div>
              <div className="min-w-[100px]">MODELO</div>
              <div className="min-w-[100px]">SERIE</div>
              <div className="min-w-[80px]">OTT</div>
              <div className="min-w-[100px]">ACCIONES</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {evaluations.map((evaluation) => {
                const calculations = calculateJointResults({
                  standardDiameter: evaluation.standardDiameter,
                  structureHousingDiameter: evaluation.structureHousingDiameter,
                  bushingDiameter: evaluation.bushingDiameter,
                  pinDiameter: evaluation.pinDiameter
                });

                return (
                  <EvaluationRow
                    key={evaluation.id}
                    evaluation={evaluation}
                    calculations={calculations}
                    onUpdate={updateEvaluation}
                    onRemove={removeRow}
                    canRemove={evaluations.length > 1}
                  />
                );
              })}
            </div>
          </div>
        </Card>

        {/* Reference Images */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Imágenes de Referencia - Números de Articulaciones</h3>
          <p className="text-gray-600 mb-6">
            Las siguientes imágenes muestran los números de las articulaciones que se van a evaluar:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <img 
                src="https://res.cloudinary.com/dbufrzoda/image/upload/v1758640637/Captura_de_pantalla_2025-09-23_101704_sjywku.png"
                alt="Referencia de articulaciones 1"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              />
              <p className="text-sm text-gray-600 mt-2">Referencia 1</p>
            </div>
            <div className="text-center">
              <img 
                src="https://res.cloudinary.com/dbufrzoda/image/upload/v1758640606/Captura_de_pantalla_2025-09-23_101627_yw6rpq.png"
                alt="Referencia de articulaciones 2"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              />
              <p className="text-sm text-gray-600 mt-2">Referencia 2</p>
            </div>
            <div className="text-center">
              <img 
                src="https://res.cloudinary.com/dbufrzoda/image/upload/v1758640557/Captura_de_pantalla_2025-09-23_101529_hc7adb.png"
                alt="Referencia de articulaciones 3"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              />
              <p className="text-sm text-gray-600 mt-2">Referencia 3</p>
            </div>
            <div className="text-center">
              <img 
                src="https://res.cloudinary.com/dbufrzoda/image/upload/v1758640509/Captura_de_pantalla_2025-09-23_101445_mmxm0u.png"
                alt="Referencia de articulaciones 4"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              />
              <p className="text-sm text-gray-600 mt-2">Referencia 4</p>
            </div>
          </div>
        </Card>

        {/* Formula Legend */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Referencia de Fórmulas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><strong>CRITERION:</strong> IF(Standard Diameter &gt; 60, 1.2, 1)</div>
              <div><strong>A-E:</strong> IF((Structure Housing Diameter - Standard Diameter) ≥ (Criterion - 0.2), 1, 0)</div>
              <div><strong>A-P:</strong> IF((Structure Housing Diameter - Pin Diameter) ≥ Criterion, 1, 0)</div>
            </div>
            <div className="space-y-2">
              <div><strong>E-P:</strong> IF((Standard Diameter - Pin Diameter) ≥ (Criterion - 0.2), 1, 0)</div>
              <div><strong>B-E:</strong> IF((Bushing Diameter - Standard Diameter) ≥ (Criterion - 0.2), 1, 0)</div>
              <div><strong>B-P:</strong> IF((Bushing Diameter - Pin Diameter) ≥ Criterion, 1, 0)</div>
            </div>
          </div>
        </Card>

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={addNewRow}
            variant="primary"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-14 h-14 p-0"
            title="Agregar nueva articulación"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface EvaluationRowProps {
  evaluation: JointEvaluationRow;
  calculations: ReturnType<typeof calculateJointResults>;
  onUpdate: (id: number, field: keyof JointEvaluationRow, value: any) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

const EvaluationRow: React.FC<EvaluationRowProps> = ({
  evaluation,
  calculations,
  onUpdate,
  onRemove,
  canRemove
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(evaluation.id, 'photos', e.target.files);
  };

  return (
    <div className="grid grid-cols-12 gap-3 p-4 text-sm items-center hover:bg-gray-50">
      {/* Articulation Number */}
      <div className="min-w-[100px]">
        <Input
          type="number"
          value={evaluation.joint || ''}
          onChange={(e) => onUpdate(evaluation.id, 'joint', parseInt(e.target.value) || 0)}
          className="text-xs text-center font-medium w-full"
          placeholder="N°"
        />
      </div>
      
      {/* Criterion (calculated) */}
      <div className="min-w-[80px] text-center font-medium text-blue-600">
        {calculations.criterion.toFixed(1)}
      </div>

      {/* Input Fields */}
      <div className="min-w-[120px]">
        <Input
          type="number"
          step="0.01"
          value={evaluation.standardDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'standardDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs w-full"
          placeholder="0.00"
        />
      </div>
      
      <div className="min-w-[140px]">
        <Input
          type="number"
          step="0.01"
          value={evaluation.structureHousingDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'structureHousingDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs w-full"
          placeholder="0.00"
        />
      </div>
      
      <div className="min-w-[120px]">
        <Input
          type="number"
          step="0.01"
          value={evaluation.bushingDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'bushingDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs w-full"
          placeholder="0.00"
        />
      </div>
      
      <div className="min-w-[100px]">
        <Input
          type="number"
          step="0.01"
          value={evaluation.pinDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'pinDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs w-full"
          placeholder="0.00"
        />
      </div>

      {/* Calculated Results - Only A-E visible */}
      <div className="min-w-[30px] text-center font-medium text-green-600">
        {calculations.aeResult}
      </div>

      {/* Criteria Results */}
      <div className="col-span-2 min-w-[200px] text-xs">
        {calculations.criteria.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {calculations.criteria.map((criterion, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                {criterion}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">No se cumplen criterios</span>
        )}
      </div>

      {/* Additional Fields */}
      <div className="min-w-[100px]">
        <Input
          type="text"
          value={evaluation.model}
          onChange={(e) => onUpdate(evaluation.id, 'model', e.target.value)}
          className="text-xs w-full"
          placeholder="Modelo"
        />
      </div>
      
      <div className="min-w-[100px]">
        <Input
          type="text"
          value={evaluation.series}
          onChange={(e) => onUpdate(evaluation.id, 'series', e.target.value)}
          className="text-xs w-full"
          placeholder="Serie"
        />
      </div>
      
      <div className="min-w-[80px]">
        <Input
          type="text"
          value={evaluation.ott}
          onChange={(e) => onUpdate(evaluation.id, 'ott', e.target.value)}
          className="text-xs w-full"
          placeholder="OTT"
        />
      </div>

      {/* Actions */}
      <div className="min-w-[100px] flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
        </label>
        
        {canRemove && (
          <button
            onClick={() => onRemove(evaluation.id)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CriteriaEvaluation;