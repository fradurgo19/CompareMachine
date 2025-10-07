import React, { useState } from 'react';
import { FileSpreadsheet, Download, Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import api from '../services/api';

interface ExtractedMachinery {
  model: string;
  name: string;
  series: string;
  manufacturer: string;
  category: string;
  specifications: any;
  availability: string;
  price?: number;
}

interface ExcelSpecificationParserProps {
  onParsed: (machinery: ExtractedMachinery[]) => void;
}

const ExcelSpecificationParser: React.FC<ExcelSpecificationParserProps> = ({ onParsed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ExtractedMachinery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type) && 
        !selectedFile.name.endsWith('.xlsx') && 
        !selectedFile.name.endsWith('.xls')) {
      setError('Tipo de archivo no válido. Solo se aceptan archivos Excel (.xlsx, .xls).');
      return;
    }

    if (selectedFile.size > maxSize) {
      setError('El archivo es demasiado grande. Tamaño máximo: 10MB.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setParsedData([]);
  };

  const handleParse = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo Excel primero.');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const result = await api.parseExcelSpecifications(file);

      if (result.success && result.data) {
        setParsedData(result.data);
        onParsed(result.data);
      } else {
        setError(result.message || 'Error al parsear el archivo Excel.');
      }
    } catch (err: any) {
      console.error('Parse error:', err);
      setError(err.message || 'Error al procesar el archivo Excel. Verifica el formato.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Define template structure with example data (30 columns - organized logically)
      const templateData = [
        {
          // Basic Information
          'Model': 'ZX38U-5A',
          'Manufacturer': 'Hitachi',
          'Category': 'EXCAVATORS',
          
          // Region and Weight Information
          'Region Offerings': 'SE Asia, Oceania, Europe',
          'Operating Weight Range (kg)': 4000,
          'Canopy Version Weight (kg)': 3770,
          'Cab Version Weight (kg)': 3940,
          'Bucket Capacity (m³)': 0.10,
          
          // Emission Standards
          'Emission Standard EU': 'Stage III A',
          'Emission Standard EPA': 'Interim Tier4',
          
          // Engine and Power Information
          'Engine Model': 'Yanmar EDM-3TNV88',
          'Rated Power ISO14396 (kW)': 21.2,
          'Rated Power ISO9249 (kW)': 21.2,
          'Rated Power SAE J1349 (kW)': 21.2,
          'Rated Power EEC 80/1269 (kW)': 21.2,
          'Number of Cylinders': 3,
          'Bore x Stroke (mm)': '88 x 90',
          'Piston Displacement (L)': 1.642,
          
          // Hydraulic System
          'Implement Circuit (MPa)': 24.5,
          'Swing Circuit (MPa)': 18.6,
          'Travel Circuit (MPa)': 24.5,
          'Max Travel Speed High (km/h)': 4.3,
          'Max Travel Speed Low (km/h)': 2.8,
          'Swing Speed (min-1)': 9.1,
          
          // Undercarriage
          'Standard Track Shoe Width (mm)': 300,
          'Undercarriage Length (mm)': 2110,
          'Undercarriage Width (mm)': 1740,
          
          // Fuel and Hydraulic Capacity
          'Fuel Tank (L)': 42.0,
          'Hydraulic System (L)': 88.0,
          
          // Availability
          'Availability': 'AVAILABLE'
        }
      ];
      
      // Create worksheet from data
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      
      // Set column widths for better readability (30 columns)
      worksheet['!cols'] = [
        { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 30 },
        { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 18 }, { wch: 20 }, { wch: 20 },
        { wch: 20 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 18 },
        { wch: 18 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 },
        { wch: 25 }, { wch: 25 }, { wch: 18 }, { wch: 25 }, { wch: 22 },
        { wch: 22 }, { wch: 15 }, { wch: 20 }, { wch: 12 }
      ];
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Machinery Template');
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, 'machinery-template.xlsx');
    } catch (error) {
      console.error('Error generating template:', error);
      setError('Error al generar el template. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-start">
            <FileSpreadsheet className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Subir Archivo Excel
              </h3>
              <p className="text-gray-600 mb-4">
                Sube un archivo Excel (.xlsx o .xls) con las especificaciones de maquinaria.
                Puedes agregar múltiples máquinas en un solo archivo.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-900 mb-2">✨ Ventajas del Excel:</h4>
                <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                  <li>📊 Formato familiar y fácil de usar</li>
                  <li>🚀 Carga masiva: 10, 50, 100+ máquinas a la vez</li>
                  <li>✅ Sin errores de formato: columnas predefinidas</li>
                  <li>💾 Puedes guardar y reutilizar templates</li>
                  <li>📝 Edita y revisa antes de subir</li>
                </ul>
              </div>

              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="w-full md:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Template Excel
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Area */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subir Archivo Excel
          </h3>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="excel-file-upload"
              className="hidden"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileChange}
            />

            <div className="flex flex-col items-center">
              <FileSpreadsheet className="w-12 h-12 text-green-500 mb-4" />
              
              <div className="mt-2">
                {file ? (
                  <div>
                    <p className="text-lg font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="excel-file-upload"
                      className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
                    >
                      Haz clic para subir
                    </label>
                    <span className="text-gray-600"> o arrastra y suelta</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Archivos Excel (.xlsx, .xls) hasta 10MB
              </p>
            </div>

            {file && (
              <div className="mt-4 flex justify-center gap-3">
                <label htmlFor="excel-file-upload">
                  <Button variant="outline" type="button" size="sm">
                    Cambiar Archivo
                  </Button>
                </label>
                <Button
                  onClick={handleParse}
                  disabled={isParsing}
                  loading={isParsing}
                  size="sm"
                >
                  {isParsing ? 'Procesando...' : 'Procesar Excel'}
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Parsed Data Preview */}
      {parsedData.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                Excel Procesado ({parsedData.length} {parsedData.length === 1 ? 'Máquina' : 'Máquinas'})
              </h3>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>✓ Procesamiento exitoso!</strong> Se encontraron {parsedData.length} máquina(s). 
                Revisa los datos y haz clic en "Agregar" para guardarlas.
              </p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {parsedData.map((machinery, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{machinery.name}</h4>
                      <p className="text-sm text-gray-600">
                        {machinery.model} • {machinery.series} • {machinery.manufacturer}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {machinery.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Motor:</span>
                      <span className="ml-2 font-medium">{machinery.specifications.engineModel}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Potencia:</span>
                      <span className="ml-2 font-medium">{machinery.specifications.ratedPowerISO9249} kW</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Combustible:</span>
                      <span className="ml-2 font-medium">{machinery.specifications.fuelTankCapacity} L</span>
                    </div>
                    {machinery.specifications.bucketCapacity && (
                      <div>
                        <span className="text-gray-500">Balde:</span>
                        <span className="ml-2 font-medium">{machinery.specifications.bucketCapacity} m³</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isParsing && (
        <Card>
          <div className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Procesando Archivo Excel...
            </h3>
            <p className="text-gray-600">
              Leyendo y validando las especificaciones del archivo.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExcelSpecificationParser;

