import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle, XCircle, Copy } from 'lucide-react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import TextArea from '../atoms/TextArea';
import api from '../services/api';

interface ExtractedMachinery {
  model: string;
  name: string;
  series: string;
  manufacturer: string;
  category: string;
  specifications: {
    regionOfferings?: string[];
    canopyVersionWeight?: number;
    cabVersionWeight?: number;
    bucketCapacity?: number;
    emissionStandardEU?: string;
    emissionStandardEPA?: string;
    engineModel: string;
    ratedPowerISO9249: number;
    ratedPowerSAEJ1349?: number;
    ratedPowerEEC80_1269?: number;
    numberOfCylinders?: number;
    boreByStroke?: string;
    pistonDisplacement?: number;
    implementCircuit?: number;
    swingCircuit?: number;
    travelCircuit?: number;
    maxTravelSpeedHigh?: number;
    maxTravelSpeedLow?: number;
    swingSpeed?: number;
    standardTrackShoeWidth?: number;
    undercarriageLength?: number;
    undercarriageWidth?: number;
    undercarriageWidthExtend?: number;
    undercarriageWidthRetract?: number;
    fuelTankCapacity: number;
    hydraulicSystemCapacity?: number;
  };
  availability: string;
  price?: number;
}

interface TextSpecificationParserProps {
  onParsed: (machinery: ExtractedMachinery[]) => void;
}

const TextSpecificationParser: React.FC<TextSpecificationParserProps> = ({ onParsed }) => {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ExtractedMachinery[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!text.trim()) {
      setError('Por favor pega el texto de especificaciones primero.');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const result = await api.parseTextSpecifications(text);

      if (result.success && result.data) {
        setParsedData(result.data);
        onParsed(result.data);
      } else {
        setError(result.message || 'Error al parsear las especificaciones.');
      }
    } catch (err: any) {
      console.error('Parse error:', err);
      setError(err.message || 'Error al procesar el texto. Verifica el formato e intenta de nuevo.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setParsedData([]);
    setError(null);
  };

  const exampleText = `ZX-5A Mini Excavator Series Specifications
Model ZX38U-5A ZX48U-5A ZX55U-5A
Operating Weight Range ;
Cab version kg 3 940 - 4 170 4 860 - 5 060 5 170 - 5 370
Bucket Capacity Range m3 0.10 0.11 0.14
Engine Model Yanmar EDM-3TNV88 EDM-4TNV88 4TNV94L-ZWHB
Rated Power ISO9249,net kW 21.2 28.2 34.1
Fuel Tank L 42.0 70.0 120.0`;

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-start">
            <FileText className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Copiar y Pegar Especificaciones
              </h3>
              <p className="text-gray-600 mb-4">
                Copia la tabla de especificaciones desde un PDF, documento de Word, o página web y pégala
                en el cuadro de texto abajo. El sistema parseará automáticamente la información.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Formato Esperado:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Primera línea: Título con el nombre de la serie (ej: "ZX-5A Mini Excavator Series")</li>
                  <li>Segunda línea: "Model" seguido de los nombres de los modelos</li>
                  <li>Líneas siguientes: Campos con valores para cada modelo</li>
                  <li>Separación: Espacios múltiples o tabulaciones entre columnas</li>
                </ul>
              </div>

              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                  Ver ejemplo de formato ▼
                </summary>
                <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-3">
                  <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre">
{exampleText}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        </div>
      </Card>

      {/* Input Area */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pegar Texto de Especificaciones
          </h3>

          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pega aquí la tabla de especificaciones completa...&#10;&#10;Ejemplo:&#10;ZX-5A Mini Excavator Series Specifications&#10;Model ZX38U-5A ZX48U-5A ZX55U-5A&#10;Operating Weight Range ;&#10;Cab version kg 3 940 - 4 170 4 860 - 5 060 5 170 - 5 370&#10;..."
            rows={12}
            className="font-mono text-sm"
          />

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {text.length > 0 && `${text.length} caracteres`}
            </div>
            <div className="flex gap-3">
              {text.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={isParsing}
                >
                  Limpiar
                </Button>
              )}
              <Button
                onClick={handleParse}
                disabled={isParsing || text.length === 0}
                loading={isParsing}
              >
                {isParsing ? 'Parseando...' : 'Parsear Especificaciones'}
              </Button>
            </div>
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
                Especificaciones Parseadas ({parsedData.length} {parsedData.length === 1 ? 'Máquina' : 'Máquinas'})
              </h3>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>✓ Parseo exitoso!</strong> Se encontraron {parsedData.length} máquina(s). 
                Revisa los datos extraídos y haz clic en "Agregar" para guardarlas en la base de datos.
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

                  {/* Specifications Grid */}
                  <div className="space-y-4">
                    {/* Weight Section */}
                    {(machinery.specifications.canopyVersionWeight || machinery.specifications.cabVersionWeight) && (
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 mb-2">Peso de Operación:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {machinery.specifications.canopyVersionWeight && (
                            <div>
                              <span className="text-gray-500">Canopy:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.canopyVersionWeight.toFixed(0)} kg</span>
                            </div>
                          )}
                          {machinery.specifications.cabVersionWeight && (
                            <div>
                              <span className="text-gray-500">Cabina:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.cabVersionWeight.toFixed(0)} kg</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Engine & Power Section */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Motor y Potencia:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Motor:</span>
                          <span className="ml-2 font-medium">{machinery.specifications.engineModel}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Potencia ISO:</span>
                          <span className="ml-2 font-medium">{machinery.specifications.ratedPowerISO9249} kW</span>
                        </div>
                        {machinery.specifications.numberOfCylinders && (
                          <div>
                            <span className="text-gray-500">Cilindros:</span>
                            <span className="ml-2 font-medium">{machinery.specifications.numberOfCylinders}</span>
                          </div>
                        )}
                        {machinery.specifications.boreByStroke && (
                          <div>
                            <span className="text-gray-500">Bore x Stroke:</span>
                            <span className="ml-2 font-medium">{machinery.specifications.boreByStroke} mm</span>
                          </div>
                        )}
                        {machinery.specifications.pistonDisplacement && (
                          <div>
                            <span className="text-gray-500">Desplazamiento:</span>
                            <span className="ml-2 font-medium">{machinery.specifications.pistonDisplacement} L</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Capacity Section */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Capacidades:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {machinery.specifications.bucketCapacity && (
                          <div>
                            <span className="text-gray-500">Balde:</span>
                            <span className="ml-2 font-medium">{machinery.specifications.bucketCapacity} m³</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Combustible:</span>
                          <span className="ml-2 font-medium">{machinery.specifications.fuelTankCapacity} L</span>
                        </div>
                        {machinery.specifications.hydraulicSystemCapacity && (
                          <div>
                            <span className="text-gray-500">Sistema Hidr.:</span>
                            <span className="ml-2 font-medium">{machinery.specifications.hydraulicSystemCapacity} L</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Undercarriage Section */}
                    {(machinery.specifications.undercarriageLength || machinery.specifications.standardTrackShoeWidth) && (
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 mb-2">Tren de Rodaje:</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {machinery.specifications.undercarriageLength && (
                            <div>
                              <span className="text-gray-500">Longitud:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.undercarriageLength} mm</span>
                            </div>
                          )}
                          {machinery.specifications.undercarriageWidth && (
                            <div>
                              <span className="text-gray-500">Ancho:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.undercarriageWidth} mm</span>
                            </div>
                          )}
                          {(machinery.specifications.undercarriageWidthExtend || machinery.specifications.undercarriageWidthRetract) && (
                            <div>
                              <span className="text-gray-500">Ancho Ext/Ret:</span>
                              <span className="ml-2 font-medium">
                                {machinery.specifications.undercarriageWidthExtend}/{machinery.specifications.undercarriageWidthRetract || '—'} mm
                              </span>
                            </div>
                          )}
                          {machinery.specifications.standardTrackShoeWidth && (
                            <div>
                              <span className="text-gray-500">Zapata:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.standardTrackShoeWidth} mm</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Performance Section */}
                    {(machinery.specifications.maxTravelSpeedHigh || machinery.specifications.swingSpeed) && (
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 mb-2">Rendimiento:</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {machinery.specifications.maxTravelSpeedHigh && (
                            <div>
                              <span className="text-gray-500">Vel. Desplaz.:</span>
                              <span className="ml-2 font-medium">
                                {machinery.specifications.maxTravelSpeedHigh}/{machinery.specifications.maxTravelSpeedLow} km/h
                              </span>
                            </div>
                          )}
                          {machinery.specifications.swingSpeed && (
                            <div>
                              <span className="text-gray-500">Vel. Giro:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.swingSpeed} min⁻¹</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Emissions Section */}
                    {(machinery.specifications.emissionStandardEU || machinery.specifications.emissionStandardEPA) && (
                      <div>
                        <h5 className="text-xs font-semibold text-gray-700 mb-2">Emisiones:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {machinery.specifications.emissionStandardEU && (
                            <div>
                              <span className="text-gray-500">EU:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.emissionStandardEU}</span>
                            </div>
                          )}
                          {machinery.specifications.emissionStandardEPA && (
                            <div>
                              <span className="text-gray-500">EPA:</span>
                              <span className="ml-2 font-medium">{machinery.specifications.emissionStandardEPA}</span>
                            </div>
                          )}
                        </div>
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
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Parseando Especificaciones...
            </h3>
            <p className="text-gray-600">
              Analizando el texto y extrayendo la información de las máquinas.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TextSpecificationParser;

