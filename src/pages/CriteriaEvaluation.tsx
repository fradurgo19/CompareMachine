import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Upload, Download, Calculator } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Card from '../atoms/Card';
import { useJointCalculations } from '../hooks/useJointCalculations';

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
      joint: 1,
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
        joint: newId,
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
      'JOINT',
      'CRITERION', 
      'STANDARD DIAMETER',
      'STRUCTURE HOUSING DIAMETER',
      'BUSHING DIAMETER',
      'PIN DIAMETER',
      'A-E',
      'A-P', 
      'E-P',
      'B-E',
      'B-P',
      'CRITERIA',
      'MODEL',
      'SERIES',
      'OTT'
    ];

    const rows = evaluations.map(evaluation => {
      const calculations = useJointCalculations({
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
    link.download = 'joint-evaluation-criteria.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criteria for Joint Evaluation
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis table with automated calculations for machinery joint assessments
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button onClick={addNewRow}>
              <Plus className="w-4 h-4 mr-2" />
              Add Joint
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            <Calculator className="w-4 h-4 inline mr-1" />
            {evaluations.length} joint{evaluations.length !== 1 ? 's' : ''} evaluated
          </div>
        </div>

        {/* Evaluation Table */}
        <Card padding="none" className="overflow-x-auto">
          <div className="min-w-[1400px]">
            {/* Table Header */}
            <div className="grid grid-cols-16 gap-2 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div>JOINT</div>
              <div>CRITERION</div>
              <div>STANDARD DIAMETER</div>
              <div>STRUCTURE HOUSING DIAMETER</div>
              <div>BUSHING DIAMETER</div>
              <div>PIN DIAMETER</div>
              <div>A-E</div>
              <div>A-P</div>
              <div>E-P</div>
              <div>B-E</div>
              <div>B-P</div>
              <div className="col-span-2">CRITERIA</div>
              <div>MODEL</div>
              <div>SERIES</div>
              <div>OTT</div>
              <div>ACTIONS</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {evaluations.map((evaluation) => {
                const calculations = useJointCalculations({
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

        {/* Formula Legend */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Formula Reference</h3>
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
      </div>
    </div>
  );
};

interface EvaluationRowProps {
  evaluation: JointEvaluationRow;
  calculations: ReturnType<typeof useJointCalculations>;
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
    <div className="grid grid-cols-16 gap-2 p-4 text-sm items-center hover:bg-gray-50">
      {/* Joint Number */}
      <div className="text-center font-medium">{evaluation.joint}</div>
      
      {/* Criterion (calculated) */}
      <div className="text-center font-medium text-blue-600">
        {calculations.criterion.toFixed(1)}
      </div>

      {/* Input Fields */}
      <div>
        <Input
          type="number"
          step="0.01"
          value={evaluation.standardDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'standardDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs"
          placeholder="0.00"
        />
      </div>
      
      <div>
        <Input
          type="number"
          step="0.01"
          value={evaluation.structureHousingDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'structureHousingDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs"
          placeholder="0.00"
        />
      </div>
      
      <div>
        <Input
          type="number"
          step="0.01"
          value={evaluation.bushingDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'bushingDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs"
          placeholder="0.00"
        />
      </div>
      
      <div>
        <Input
          type="number"
          step="0.01"
          value={evaluation.pinDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'pinDiameter', parseFloat(e.target.value) || 0)}
          className="text-xs"
          placeholder="0.00"
        />
      </div>

      {/* Calculated Results */}
      <div className="text-center font-medium text-green-600">
        {calculations.aeResult}
      </div>
      <div className="text-center font-medium text-green-600">
        {calculations.apResult}
      </div>
      <div className="text-center font-medium text-green-600">
        {calculations.epResult}
      </div>
      <div className="text-center font-medium text-green-600">
        {calculations.beResult}
      </div>
      <div className="text-center font-medium text-green-600">
        {calculations.bpResult}
      </div>

      {/* Criteria Results */}
      <div className="col-span-2 text-xs">
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
          <span className="text-gray-400">No criteria met</span>
        )}
      </div>

      {/* Additional Fields */}
      <div>
        <Input
          type="text"
          value={evaluation.model}
          onChange={(e) => onUpdate(evaluation.id, 'model', e.target.value)}
          className="text-xs"
          placeholder="Model"
        />
      </div>
      
      <div>
        <Input
          type="text"
          value={evaluation.series}
          onChange={(e) => onUpdate(evaluation.id, 'series', e.target.value)}
          className="text-xs"
          placeholder="Series"
        />
      </div>
      
      <div>
        <Input
          type="text"
          value={evaluation.ott}
          onChange={(e) => onUpdate(evaluation.id, 'ott', e.target.value)}
          className="text-xs"
          placeholder="OTT"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
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