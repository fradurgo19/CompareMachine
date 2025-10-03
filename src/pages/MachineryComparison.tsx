import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Machinery } from '../types';
import MachineryGrid from '../organisms/MachineryGrid';
import ComparisonChart from '../components/ComparisonChart';
import ComparisonInstructions from '../components/ComparisonInstructions';
import { X, Download, Star, Wrench, Plus, BarChart3 } from 'lucide-react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const MachineryComparison: React.FC = () => {
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const { comparisonMode, selectedMachinery: selectedIds, toggleComparisonMode, clearSelection } = useAppContext();
  const { isAuthenticated } = useAuth();

  const handleViewDetails = (machinery: Machinery) => {
    setSelectedMachinery(machinery);
  };

  const handleCloseModal = () => {
    setSelectedMachinery(null);
  };

  const handleDownloadReport = () => {
    // In a real application, this would generate and download a PDF report
    console.log('Downloading comparison report...');
  };

  const handleClearSelection = () => {
    // Limpiar la selección usando el contexto
    if (window.confirm('¿Estás seguro de que quieres limpiar la selección?')) {
      // Limpiar la selección y desactivar modo comparación
      clearSelection();
    }
  };

  // Obtener datos de las máquinas seleccionadas
  const { data: machineryData } = useQuery({
    queryKey: ['machinery'],
    queryFn: () => api.getMachinery({}),
  });

  const selectedMachineryData = useMemo(() => {
    if (!machineryData?.data || selectedIds.length === 0) return [];
    return machineryData.data.filter(machine => selectedIds.includes(machine.id));
  }, [machineryData?.data, selectedIds]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Comparación de Maquinaria Pesada
              </h1>
              <p className="text-gray-600">
                Compara especificaciones, rendimiento y precios de equipos industriales
              </p>
            </div>
            
            {!comparisonMode && isAuthenticated && (
              <Link to="/add-machinery">
                <Button variant="primary" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Nueva Maquinaria
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Header de selección */}
          {selectedMachineryData.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Máquinas Seleccionadas
                  </h2>
                  <p className="text-gray-600">
                    {selectedMachineryData.length} máquina{selectedMachineryData.length !== 1 ? 's' : ''} seleccionada{selectedMachineryData.length !== 1 ? 's' : ''} 
                    {selectedMachineryData.length < 5 && '(máximo 5)'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearSelection}
                >
                  Limpiar Selección
                </Button>
                {selectedMachineryData.length >= 2 && !comparisonMode && (
                  <Button
                    variant="primary"
                    onClick={toggleComparisonMode}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Comparar Ahora
                  </Button>
                )}
                {comparisonMode && (
                  <Button
                    variant="outline"
                    onClick={toggleComparisonMode}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cerrar Comparación
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Indicador de selección */}
          {selectedMachineryData.length === 1 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">1</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Máquina seleccionada
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Selecciona al menos una máquina más y luego haz clic en "Comparar Ahora" (máximo 5)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Indicador cuando hay 2 o más máquinas pero no está en modo comparación */}
          {selectedMachineryData.length >= 2 && !comparisonMode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">{selectedMachineryData.length}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Listo para comparar
                  </h3>
                  <p className="text-sm text-green-700">
                    Tienes {selectedMachineryData.length} máquinas seleccionadas. Haz clic en "Comparar Ahora" para ver la comparación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Indicador cuando se alcanza el límite */}
          {selectedMachineryData.length === 5 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">5</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Límite alcanzado
                  </h3>
                  <p className="text-sm text-blue-700">
                    Has seleccionado el máximo de 5 máquinas. Puedes deseleccionar alguna para agregar otra.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mostrar comparación si hay 2 o más máquinas */}
          {selectedMachineryData.length >= 2 && (
            <ComparisonChart machinery={selectedMachineryData} />
          )}
          
          {/* Instrucciones cuando no hay máquinas seleccionadas */}
          {selectedMachineryData.length === 0 && (
            <ComparisonInstructions />
          )}
          
          {/* Siempre mostrar el grid para permitir selección */}
          <MachineryGrid onViewDetails={handleViewDetails} />
        </div>

        {/* Detailed View Modal */}
        {selectedMachinery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedMachinery.name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedMachinery.manufacturer} • {selectedMachinery.model}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Reporte
                  </Button>
                  <Button variant="ghost" onClick={handleCloseModal}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Detailed Specifications */}
                <Card>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Especificaciones Técnicas Completas
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Operating Weight Range */}
                    {(selectedMachinery.specifications.cabVersionWeight || selectedMachinery.specifications.canopyVersionWeight) && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Peso de Operación</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedMachinery.specifications.canopyVersionWeight && (
                            <div>
                              <dt className="text-sm text-gray-500">Versión Canopy</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.canopyVersionWeight.toFixed(0)} kg
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.cabVersionWeight && (
                            <div>
                              <dt className="text-sm text-gray-500">Versión Cab</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.cabVersionWeight.toFixed(0)} kg
                        </dd>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                      
                    {/* Bucket Capacity */}
                    {selectedMachinery.specifications.bucketCapacity && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Capacidad del Balde (ISO heaped)</h4>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.bucketCapacity} m³
                        </dd>
                      </div>
                    )}

                    {/* Emission Standards */}
                    {(selectedMachinery.specifications.emissionStandardEU || selectedMachinery.specifications.emissionStandardEPA) && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Estándares de Emisión</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedMachinery.specifications.emissionStandardEU && (
                            <div>
                              <dt className="text-sm text-gray-500">EU</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.emissionStandardEU}
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.emissionStandardEPA && (
                            <div>
                              <dt className="text-sm text-gray-500">EPA</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.emissionStandardEPA}
                        </dd>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Engine & Rated Power */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Motor y Potencia</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm text-gray-500">Modelo del Motor</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.engineModel}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Potencia ISO9249 (kW)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.ratedPowerISO9249} kW
                          </dd>
                        </div>
                        {selectedMachinery.specifications.ratedPowerSAEJ1349 && (
                          <div>
                            <dt className="text-sm text-gray-500">Potencia SAE J1349 (kW)</dt>
                            <dd className="text-lg font-semibold text-gray-900">
                              {selectedMachinery.specifications.ratedPowerSAEJ1349} kW
                            </dd>
                          </div>
                        )}
                        {selectedMachinery.specifications.ratedPowerEEC80_1269 && (
                          <div>
                            <dt className="text-sm text-gray-500">Potencia EEC 80/1269 (kW)</dt>
                            <dd className="text-lg font-semibold text-gray-900">
                              {selectedMachinery.specifications.ratedPowerEEC80_1269} kW
                            </dd>
                          </div>
                        )}
                        {selectedMachinery.specifications.numberOfCylinders && (
                          <div>
                            <dt className="text-sm text-gray-500">No. de Cilindros</dt>
                            <dd className="text-lg font-semibold text-gray-900">
                              {selectedMachinery.specifications.numberOfCylinders}
                            </dd>
                          </div>
                        )}
                        {selectedMachinery.specifications.boreByStroke && (
                          <div>
                            <dt className="text-sm text-gray-500">Bore × Stroke (mm)</dt>
                            <dd className="text-lg font-semibold text-gray-900">
                              {selectedMachinery.specifications.boreByStroke}
                          </dd>
                        </div>
                      )}
                        {selectedMachinery.specifications.pistonDisplacement && (
                      <div>
                            <dt className="text-sm text-gray-500">Desplazamiento del Pistón (L)</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                              {selectedMachinery.specifications.pistonDisplacement} L
                        </dd>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Relief Valve Settings */}
                    {(selectedMachinery.specifications.implementCircuit || selectedMachinery.specifications.maxTravelSpeedHigh) && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Configuración de Válvulas y Rendimiento</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedMachinery.specifications.implementCircuit && (
                            <div>
                              <dt className="text-sm text-gray-500">Circuito de Implementación (MPa)</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.implementCircuit} MPa
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.swingCircuit && (
                            <div>
                              <dt className="text-sm text-gray-500">Circuito de Giro (MPa)</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.swingCircuit} MPa
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.travelCircuit && (
                            <div>
                              <dt className="text-sm text-gray-500">Circuito de Desplazamiento (MPa)</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.travelCircuit} MPa
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.maxTravelSpeedHigh && (
                            <div>
                              <dt className="text-sm text-gray-500">Vel. Máx. Desplazamiento</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.maxTravelSpeedHigh} / {selectedMachinery.specifications.maxTravelSpeedLow} km/h
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.swingSpeed && (
                            <div>
                              <dt className="text-sm text-gray-500">Velocidad de Giro (min⁻¹)</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.swingSpeed} min⁻¹
                        </dd>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Undercarriage */}
                    {(selectedMachinery.specifications.undercarriageLength || selectedMachinery.specifications.standardTrackShoeWidth) && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Tren de Rodaje</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedMachinery.specifications.standardTrackShoeWidth && (
                            <div>
                              <dt className="text-sm text-gray-500">Ancho Zapata Estándar (mm)</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.standardTrackShoeWidth} mm
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.undercarriageLength && (
                            <div>
                              <dt className="text-sm text-gray-500">Longitud Tren de Rodaje (mm)</dt>
                              <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.undercarriageLength} mm
                              </dd>
                            </div>
                          )}
                          {selectedMachinery.specifications.undercarriageWidth && (
                            <div>
                              <dt className="text-sm text-gray-500">Ancho Tren de Rodaje (mm)</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                                {selectedMachinery.specifications.undercarriageWidth} mm
                        </dd>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Capacity (Refilled) */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Capacidades (Rellenado)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-gray-500">Tanque de Combustible (L)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.fuelTankCapacity} L
                          </dd>
                        </div>
                        {selectedMachinery.specifications.hydraulicSystemCapacity && (
                      <div>
                            <dt className="text-sm text-gray-500">Sistema Hidráulico incl. tanque (L)</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                              {selectedMachinery.specifications.hydraulicSystemCapacity} L
                        </dd>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineryComparison;