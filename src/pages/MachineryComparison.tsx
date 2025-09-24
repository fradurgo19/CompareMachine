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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Images */}
                  <div className="space-y-4">
                    <img
                      src={selectedMachinery.images[0]}
                      alt={selectedMachinery.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {selectedMachinery.images.length > 1 && (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedMachinery.images.slice(1).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedMachinery.name} ${index + 2}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                        <span className="text-lg font-medium">{selectedMachinery.rating}</span>
                      </div>
                      <Badge variant={
                        selectedMachinery.availability === 'available' ? 'success' :
                        selectedMachinery.availability === 'limited' ? 'warning' : 'error'
                      }>
                        {selectedMachinery.availability.charAt(0).toUpperCase() + 
                         selectedMachinery.availability.slice(1)}
                      </Badge>
                    </div>

                    {selectedMachinery.price && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Precio</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          ${selectedMachinery.price.toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Categoría</h3>
                      <p className="text-gray-600 capitalize">
                        {selectedMachinery.category.replace('-', ' ')}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Información de Serie</h3>
                      <p className="text-gray-600">
                        Serie: {selectedMachinery.series}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Specifications */}
                <Card>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Especificaciones Técnicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Peso de Operación</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.weight} tons
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Potencia del Motor</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.power} HP
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Modelo del Motor</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.engineModel}
                        </dd>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedMachinery.specifications.bucketCapacity && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Capacidad del Balde</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.bucketCapacity} m³
                          </dd>
                        </div>
                      )}

                      {selectedMachinery.specifications.maxDigDepth && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Profundidad Máxima de Excavación</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.maxDigDepth} m
                          </dd>
                        </div>
                      )}

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Capacidad de Combustible</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.fuelCapacity} L
                        </dd>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Longitud de Transporte</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.transportLength} m
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Ancho de Transporte</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.transportWidth} m
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Altura de Transporte</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.transportHeight} m
                        </dd>
                      </div>
                    </div>
                  </div>

                  {selectedMachinery.specifications.hydraulicSystem && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">
                          Sistema Hidráulico
                        </dt>
                        <dd className="text-gray-900">
                          {selectedMachinery.specifications.hydraulicSystem}
                        </dd>
                      </div>
                    </div>
                  )}
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