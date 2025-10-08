import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Upload, Download, Calculator, FileText } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Card from '../atoms/Card';
import { calculateJointResults } from '../hooks/useJointCalculations';
import { exportToPDF } from '../utils/pdfExport';

interface PinType {
  oreja: string;
  orejaUrl: string;
  sujecion: string;
  sujecionUrl: string;
  lubricacion: string;
  lubricacionUrl: string;
}

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
  // Pin data
  pinType: PinType;
  pinDiameterValue: number;
  pinLength: number;
  // Bushing data
  bushingInnerDiameter: number;
  bushingOuterDiameter: number;
  bushingLength: number;
  // Washer data
  washerInnerDiameter: number;
  washerOuterDiameter: number;
  washerLength: number;
}

// Pin type options with images
const PIN_OREJA_OPTIONS = [
  { value: 'sin-oreja', label: 'Sin oreja', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759931946/SinOreja_sjbozb.png' },
  { value: 'oreja-redonda', label: 'Oreja redonda', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759931946/ConOrejaRedonda_jaregn.png' },
  { value: 'oreja-espigo', label: 'Oreja con espigo', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759931946/OrejaConEspigo_tcbjja.png' },
  { value: 'oreja-platina', label: 'Oreja con platina', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759931946/OrejaConPlatina_rvtwk9.png' }
];

const PIN_SUJECION_OPTIONS = [
  { value: 'un-agujero', label: 'Un agujero', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932375/1_agujero_ww58by.png' },
  { value: 'dos-agujeros-extremos', label: 'Dos agujeros - Uno en cada extremo', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932502/2_agujeros_-_1_en_cada_extremo_evdixk.png' },
  { value: 'snap-ring', label: 'Por medio de snap ring', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932599/por_medio_de_snap_ring_o7pr1h.png' },
  { value: 'dos-snap-ring', label: 'Dos snap ring - Uno en cada extremo', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932704/2_snap_ring_-_1_en_cada_extremo_bl3axc.png' },
  { value: 'dos-agujeros-mismo-extremo', label: 'Dos agujeros en Un solo extremo', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932761/2_agujeros_en_1_solo_extremo_mavtii.png' }
];

const PIN_LUBRICACION_OPTIONS = [
  { value: 'central-acanalado', label: 'Punto de lubricación central con acanalado', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932868/punto_de_lubricacion_central_con_acanalado_teo70x.png' },
  { value: 'dos-puntos-acanalado', label: 'Dos puntos de lubricación con acanalado', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932930/2_punto_de_lubricacion_con_acanalado_sdb2rr.png' },
  { value: 'central', label: 'Punto de lubricación central', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759932993/punto_de_lubricacion_central_xshlle.png' },
  { value: 'dos-puntos', label: 'Dos puntos de lubricación', url: 'https://res.cloudinary.com/dbufrzoda/image/upload/v1759933049/2_punto_de_lubricacion_t3tdkh.png' }
];

// Utility function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Utility function to convert multiple files to base64
const filesToBase64 = async (files: FileList | null): Promise<string[]> => {
  if (!files || files.length === 0) return [];
  
  const promises = Array.from(files).map(file => fileToBase64(file));
  return Promise.all(promises);
};

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
      pinType: {
        oreja: '',
        orejaUrl: '',
        sujecion: '',
        sujecionUrl: '',
        lubricacion: '',
        lubricacionUrl: ''
      },
      pinDiameterValue: 0,
      pinLength: 0,
      bushingInnerDiameter: 0,
      bushingOuterDiameter: 0,
      bushingLength: 0,
      washerInnerDiameter: 0,
      washerOuterDiameter: 0,
      washerLength: 0
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
        pinType: {
          oreja: '',
          orejaUrl: '',
          sujecion: '',
          sujecionUrl: '',
          lubricacion: '',
          lubricacionUrl: ''
        },
        pinDiameterValue: 0,
        pinLength: 0,
        bushingInnerDiameter: 0,
        bushingOuterDiameter: 0,
        bushingLength: 0,
        washerInnerDiameter: 0,
        washerOuterDiameter: 0,
        washerLength: 0
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

  const exportToCSV = async () => {
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
      'OTT',
      'TIPO PASADOR - OREJA',
      'TIPO PASADOR - SUJECIÓN',
      'TIPO PASADOR - LUBRICACIÓN',
      'PASADOR DIÁMETRO',
      'PASADOR LONGITUD',
      'BUJE Ø INTERNO',
      'BUJE Ø EXTERNO',
      'BUJE LONGITUD',
      'ARANDELA Ø INTERNO',
      'ARANDELA Ø EXTERNO',
      'ARANDELA LONGITUD',
      'FOTOS_BASE64'
    ];

    const rows = await Promise.all(evaluations.map(async evaluation => {
      const calculations = calculateJointResults({
        standardDiameter: evaluation.standardDiameter,
        structureHousingDiameter: evaluation.structureHousingDiameter,
        bushingDiameter: evaluation.bushingDiameter,
        pinDiameter: evaluation.pinDiameter
      });

      const photoBase64 = await filesToBase64(evaluation.photos);
      const photosData = photoBase64.length > 0 
        ? photoBase64.join(' | ') // Separate multiple photos with |
        : 'Sin fotos';

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
        evaluation.ott,
        evaluation.pinType.oreja,
        evaluation.pinType.sujecion,
        evaluation.pinType.lubricacion,
        evaluation.pinDiameterValue,
        evaluation.pinLength,
        evaluation.bushingInnerDiameter,
        evaluation.bushingOuterDiameter,
        evaluation.bushingLength,
        evaluation.washerInnerDiameter,
        evaluation.washerOuterDiameter,
        evaluation.washerLength,
        photosData
      ];
    }));

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

  const handleExportToPDF = async () => {
    const pdfData = await Promise.all(evaluations.map(async evaluation => {
      const calculations = calculateJointResults({
        standardDiameter: evaluation.standardDiameter,
        structureHousingDiameter: evaluation.structureHousingDiameter,
        bushingDiameter: evaluation.bushingDiameter,
        pinDiameter: evaluation.pinDiameter
      });

      const photoBase64 = await filesToBase64(evaluation.photos);
      const photoNames = evaluation.photos && evaluation.photos.length > 0 
        ? Array.from(evaluation.photos).map(photo => photo.name).join('; ')
        : 'Sin fotos';

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
        ott: evaluation.ott,
        photos: photoNames,
        photosBase64: photoBase64,
        // Pin data
        pinType: evaluation.pinType,
        pinDiameterValue: evaluation.pinDiameterValue,
        pinLength: evaluation.pinLength,
        // Bushing data
        bushingInnerDiameter: evaluation.bushingInnerDiameter,
        bushingOuterDiameter: evaluation.bushingOuterDiameter,
        bushingLength: evaluation.bushingLength,
        // Washer data
        washerInnerDiameter: evaluation.washerInnerDiameter,
        washerOuterDiameter: evaluation.washerOuterDiameter,
        washerLength: evaluation.washerLength
      };
    }));

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

        {/* Evaluation Cards */}
        <div className="space-y-4">
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

// Image Selector Component for Pin Types
interface ImageSelectorProps {
  options: { value: string; label: string; url: string }[];
  selectedValue: string;
  onSelect: (value: string, url: string) => void;
  title: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ options, selectedValue, onSelect, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="relative">
      <div className="text-xs font-medium text-gray-700 mb-1">{title}</div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-lg p-2 hover:border-blue-400 transition-colors bg-white flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedOption ? (
            <>
              <img
                src={selectedOption.url}
                alt={selectedOption.label}
                className="w-10 h-10 object-contain"
              />
              <span className="text-xs text-gray-700">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Seleccionar...</span>
          )}
        </div>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value, option.url);
                setIsOpen(false);
              }}
              className={`w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                selectedValue === option.value ? 'bg-blue-100' : ''
              }`}
            >
              <img
                src={option.url}
                alt={option.label}
                className="w-16 h-16 object-contain border border-gray-200 rounded"
              />
              <span className="text-sm text-gray-700 text-left">{option.label}</span>
            </button>
          ))}
        </div>
      )}
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
    const files = e.target.files;
    if (files && files.length > 0) {
      // If there are existing photos, append new ones
      if (evaluation.photos && evaluation.photos.length > 0) {
        const existingFiles = Array.from(evaluation.photos);
        const newFiles = Array.from(files);
        const combinedFiles = [...existingFiles, ...newFiles];
        
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        combinedFiles.forEach(file => dataTransfer.items.add(file));
        onUpdate(evaluation.id, 'photos', dataTransfer.files);
      } else {
        onUpdate(evaluation.id, 'photos', files);
      }
    }
  };

  const removePhoto = (indexToRemove: number) => {
    if (evaluation.photos && evaluation.photos.length > 0) {
      const files = Array.from(evaluation.photos);
      files.splice(indexToRemove, 1);
      
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      onUpdate(evaluation.id, 'photos', dataTransfer.files);
    }
  };

  return (
    <Card className="my-4 bg-white hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full px-4 py-2">
              <span className="text-blue-800 font-bold text-lg">#{evaluation.joint || '?'}</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Articulación</div>
              <div className="text-lg font-semibold text-gray-900">
                Criterio: <span className="text-blue-600">{calculations.criterion.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg text-blue-700 hover:text-blue-800 transition-all duration-200">
                <Upload className="w-5 h-5" />
                <span className="text-sm font-medium">Fotos</span>
              </div>
            </label>
            {canRemove && (
              <button
                onClick={() => onRemove(evaluation.id)}
                className="px-4 py-2 text-red-500 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200"
                title="Eliminar articulación"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section 1: Basic Measurements */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2">Medidas Básicas</h3>
            <div>
              <label className="text-xs font-medium text-gray-700">Articulación N°</label>
        <Input
          type="number"
          value={evaluation.joint || ''}
          onChange={(e) => onUpdate(evaluation.id, 'joint', parseInt(e.target.value) || 0)}
                className="text-sm w-full mt-1"
          placeholder="N°"
        />
      </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Diámetro Estándar</label>
        <Input
          type="number"
          step="0.01"
          value={evaluation.standardDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'standardDiameter', parseFloat(e.target.value) || 0)}
                className="text-sm w-full mt-1"
          placeholder="0.00"
        />
      </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Diámetro Alojamiento</label>
        <Input
          type="number"
          step="0.01"
          value={evaluation.structureHousingDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'structureHousingDiameter', parseFloat(e.target.value) || 0)}
                className="text-sm w-full mt-1"
          placeholder="0.00"
        />
      </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Diámetro Bocina</label>
        <Input
          type="number"
          step="0.01"
          value={evaluation.bushingDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'bushingDiameter', parseFloat(e.target.value) || 0)}
                className="text-sm w-full mt-1"
          placeholder="0.00"
        />
      </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Diámetro Pin</label>
        <Input
          type="number"
          step="0.01"
          value={evaluation.pinDiameter || ''}
          onChange={(e) => onUpdate(evaluation.id, 'pinDiameter', parseFloat(e.target.value) || 0)}
                className="text-sm w-full mt-1"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Section 2: Pin Data */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2">Datos del Pasador</h3>
            
            {/* Pin Type Selectors */}
            <ImageSelector
              title="Oreja"
              options={PIN_OREJA_OPTIONS}
              selectedValue={evaluation.pinType.oreja}
              onSelect={(value, url) => {
                onUpdate(evaluation.id, 'pinType', { ...evaluation.pinType, oreja: value, orejaUrl: url });
              }}
            />
            
            <ImageSelector
              title="Sujeción"
              options={PIN_SUJECION_OPTIONS}
              selectedValue={evaluation.pinType.sujecion}
              onSelect={(value, url) => {
                onUpdate(evaluation.id, 'pinType', { ...evaluation.pinType, sujecion: value, sujecionUrl: url });
              }}
            />
            
            <ImageSelector
              title="Lubricación"
              options={PIN_LUBRICACION_OPTIONS}
              selectedValue={evaluation.pinType.lubricacion}
              onSelect={(value, url) => {
                onUpdate(evaluation.id, 'pinType', { ...evaluation.pinType, lubricacion: value, lubricacionUrl: url });
              }}
            />
            
            <div>
              <label className="text-xs font-medium text-gray-700">Pasador - Diámetro</label>
              <Input
                type="number"
                step="0.01"
                value={evaluation.pinDiameterValue || ''}
                onChange={(e) => onUpdate(evaluation.id, 'pinDiameterValue', parseFloat(e.target.value) || 0)}
                className="text-sm w-full mt-1"
          placeholder="0.00"
        />
      </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Pasador - Longitud</label>
              <Input
                type="number"
                step="0.01"
                value={evaluation.pinLength || ''}
                onChange={(e) => onUpdate(evaluation.id, 'pinLength', parseFloat(e.target.value) || 0)}
                className="text-sm w-full mt-1"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Section 3: Bushing and Washer Data */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2">Buje y Arandela</h3>
            
            {/* Bushing */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-gray-700 uppercase">Buje</div>
              <div>
                <label className="text-xs font-medium text-gray-600">Ø Interno</label>
                <Input
                  type="number"
                  step="0.01"
                  value={evaluation.bushingInnerDiameter || ''}
                  onChange={(e) => onUpdate(evaluation.id, 'bushingInnerDiameter', parseFloat(e.target.value) || 0)}
                  className="text-sm w-full mt-1"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Ø Externo</label>
                <Input
                  type="number"
                  step="0.01"
                  value={evaluation.bushingOuterDiameter || ''}
                  onChange={(e) => onUpdate(evaluation.id, 'bushingOuterDiameter', parseFloat(e.target.value) || 0)}
                  className="text-sm w-full mt-1"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Longitud</label>
                <Input
                  type="number"
                  step="0.01"
                  value={evaluation.bushingLength || ''}
                  onChange={(e) => onUpdate(evaluation.id, 'bushingLength', parseFloat(e.target.value) || 0)}
                  className="text-sm w-full mt-1"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Washer */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-gray-700 uppercase">Arandela Ajuste</div>
              <div>
                <label className="text-xs font-medium text-gray-600">Ø Interno</label>
                <Input
                  type="number"
                  step="0.01"
                  value={evaluation.washerInnerDiameter || ''}
                  onChange={(e) => onUpdate(evaluation.id, 'washerInnerDiameter', parseFloat(e.target.value) || 0)}
                  className="text-sm w-full mt-1"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Ø Externo</label>
                <Input
                  type="number"
                  step="0.01"
                  value={evaluation.washerOuterDiameter || ''}
                  onChange={(e) => onUpdate(evaluation.id, 'washerOuterDiameter', parseFloat(e.target.value) || 0)}
                  className="text-sm w-full mt-1"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Longitud</label>
                <Input
                  type="number"
                  step="0.01"
                  value={evaluation.washerLength || ''}
                  onChange={(e) => onUpdate(evaluation.id, 'washerLength', parseFloat(e.target.value) || 0)}
                  className="text-sm w-full mt-1"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
      </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="text-xs font-medium text-gray-700">Modelo</label>
        <Input
          type="text"
          value={evaluation.model}
          onChange={(e) => onUpdate(evaluation.id, 'model', e.target.value)}
              className="text-sm w-full mt-1"
          placeholder="Modelo"
        />
      </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Serie</label>
        <Input
          type="text"
          value={evaluation.series}
          onChange={(e) => onUpdate(evaluation.id, 'series', e.target.value)}
              className="text-sm w-full mt-1"
          placeholder="Serie"
        />
      </div>
          <div>
            <label className="text-xs font-medium text-gray-700">OTT</label>
        <Input
          type="text"
          value={evaluation.ott}
          onChange={(e) => onUpdate(evaluation.id, 'ott', e.target.value)}
              className="text-sm w-full mt-1"
          placeholder="OTT"
        />
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Criterios de Evaluación</h3>
          {calculations.criteria.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {calculations.criteria.map((criterion, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {criterion}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No se cumplen criterios</div>
          )}
      </div>

        {/* Photos Section */}
        {evaluation.photos && evaluation.photos.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Fotos Adjuntas ({evaluation.photos.length})
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {Array.from(evaluation.photos).map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-20 object-cover rounded border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                    title={`${photo.name} (${(photo.size / 1024).toFixed(1)} KB)`}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                    title="Eliminar foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CriteriaEvaluation;