import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Machinery } from '../types';
import MachineryGrid from '../organisms/MachineryGrid';
import MachineryForm from '../molecules/MachineryForm';
import ComparisonChart from '../components/ComparisonChart';
import ComparisonInstructions from '../components/ComparisonInstructions';
import { X, Download, Star, Wrench, Plus, BarChart3, Edit2, Trash2 } from 'lucide-react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const MachineryComparison: React.FC = () => {
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { comparisonMode, selectedMachinery: selectedIds, toggleComparisonMode, clearSelection } = useAppContext();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  
  const isAdmin = user?.role === 'ADMIN';

  const handleViewDetails = (machinery: Machinery) => {
    setSelectedMachinery(machinery);
  };

  const handleCloseModal = () => {
    setSelectedMachinery(null);
    setIsEditMode(false);
  };

  const handleDownloadReport = () => {
    // In a real application, this would generate and download a PDF report
    console.log('Downloading comparison report...');
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const deleteMachineryMutation = useMutation({
    mutationFn: (id: string) => api.deleteMachinery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machinery'] });
      setSelectedMachinery(null);
      alert('Maquinaria eliminada exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting machinery:', error);
      alert('Error al eliminar la maquinaria. Por favor, inténtalo de nuevo.');
    },
  });

  const handleDelete = async () => {
    if (!selectedMachinery) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar "${selectedMachinery.name}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      deleteMachineryMutation.mutate(selectedMachinery.id);
    }
  };

  const handleUpdateSubmit = async (data: any, _images: File[]) => {
    if (!selectedMachinery) return;

    try {
      const updateData = {
        name: data.name || `${data.manufacturer || 'Unknown'} ${data.model || 'Unknown'} Excavator`,
        model: data.model || selectedMachinery.model,
        series: data.series || selectedMachinery.series,
        category: data.category || selectedMachinery.category,
        manufacturer: data.manufacturer || selectedMachinery.manufacturer,
        specifications: {
          regionOfferings: data.regionOfferings ? data.regionOfferings.split(',').map((s: string) => s.trim()) : [],
          canopyVersionWeight: data.canopyVersionWeight,
          cabVersionWeight: data.cabVersionWeight,
          bucketCapacity: data.bucketCapacity,
          emissionStandardEU: data.emissionStandardEU,
          emissionStandardEPA: data.emissionStandardEPA,
          engineModel: data.engineModel || 'Unknown',
          ratedPowerISO9249: data.ratedPowerISO9249 || 0,
          ratedPowerSAEJ1349: data.ratedPowerSAEJ1349,
          ratedPowerEEC80_1269: data.ratedPowerEEC80_1269,
          numberOfCylinders: data.numberOfCylinders,
          boreByStroke: data.boreByStroke,
          pistonDisplacement: data.pistonDisplacement,
          implementCircuit: data.implementCircuit,
          swingCircuit: data.swingCircuit,
          travelCircuit: data.travelCircuit,
          maxTravelSpeedHigh: data.maxTravelSpeedHigh,
          maxTravelSpeedLow: data.maxTravelSpeedLow,
          swingSpeed: data.swingSpeed,
          standardTrackShoeWidth: data.standardTrackShoeWidth,
          undercarriageLength: data.undercarriageLength,
          undercarriageWidth: data.undercarriageWidth,
          fuelTankCapacity: data.fuelTankCapacity || 0,
          hydraulicSystemCapacity: data.hydraulicSystemCapacity,
        },
        price: data.price,
        availability: data.availability || 'AVAILABLE',
      };

      const response = await api.updateMachinery(selectedMachinery.id, updateData);
      
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['machinery'] });
        setIsEditMode(false);
        setSelectedMachinery(response.data);
        alert('Maquinaria actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error updating machinery:', error);
      alert('Error al actualizar la maquinaria. Por favor, inténtalo de nuevo.');
    }
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
                    {isEditMode ? 'Editar Maquinaria' : selectedMachinery.name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedMachinery.manufacturer} • {selectedMachinery.model}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!isEditMode && isAdmin && (
                    <>
                      <Button variant="outline" onClick={handleEdit}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleDelete}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </>
                  )}
                  {!isEditMode && (
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                      Descargar
                  </Button>
                  )}
                  <Button variant="ghost" onClick={handleCloseModal}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {isEditMode ? (
                  /* Edit Mode - Show Form */
                  <MachineryForm
                    onSubmit={handleUpdateSubmit}
                    onCancel={handleCancelEdit}
                    initialData={{
                      model: selectedMachinery.model,
                      category: selectedMachinery.category as any,
                      manufacturer: selectedMachinery.manufacturer,
                      regionOfferings: selectedMachinery.specifications.regionOfferings?.join(', '),
                      canopyVersionWeight: selectedMachinery.specifications.canopyVersionWeight,
                      cabVersionWeight: selectedMachinery.specifications.cabVersionWeight,
                      bucketCapacity: selectedMachinery.specifications.bucketCapacity,
                      emissionStandardEU: selectedMachinery.specifications.emissionStandardEU,
                      emissionStandardEPA: selectedMachinery.specifications.emissionStandardEPA,
                      engineModel: selectedMachinery.specifications.engineModel,
                      ratedPowerISO9249: selectedMachinery.specifications.ratedPowerISO9249,
                      ratedPowerSAEJ1349: selectedMachinery.specifications.ratedPowerSAEJ1349,
                      ratedPowerEEC80_1269: selectedMachinery.specifications.ratedPowerEEC80_1269,
                      numberOfCylinders: selectedMachinery.specifications.numberOfCylinders,
                      boreByStroke: selectedMachinery.specifications.boreByStroke,
                      pistonDisplacement: selectedMachinery.specifications.pistonDisplacement,
                      implementCircuit: selectedMachinery.specifications.implementCircuit,
                      swingCircuit: selectedMachinery.specifications.swingCircuit,
                      travelCircuit: selectedMachinery.specifications.travelCircuit,
                      maxTravelSpeedHigh: selectedMachinery.specifications.maxTravelSpeedHigh,
                      maxTravelSpeedLow: selectedMachinery.specifications.maxTravelSpeedLow,
                      swingSpeed: selectedMachinery.specifications.swingSpeed,
                      standardTrackShoeWidth: selectedMachinery.specifications.standardTrackShoeWidth,
                      undercarriageLength: selectedMachinery.specifications.undercarriageLength,
                      undercarriageWidth: selectedMachinery.specifications.undercarriageWidth,
                      fuelTankCapacity: selectedMachinery.specifications.fuelTankCapacity,
                      hydraulicSystemCapacity: selectedMachinery.specifications.hydraulicSystemCapacity,
                    }}
                  />
                ) : (
                  /* View Mode - Show Specifications */
                <Card>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Especificaciones Técnicas Completas
                  </h3>
                  
                  <div className="space-y-6">
                    {/* 2. Region Offerings */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">2. Region Offerings</h4>
                      <dd className="text-lg font-semibold text-gray-900">
                        {selectedMachinery.specifications.regionOfferings && selectedMachinery.specifications.regionOfferings.length > 0
                          ? selectedMachinery.specifications.regionOfferings.join(', ')
                          : '—'}
                      </dd>
                    </div>
                    {/* 3. Operating Weight Range */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">3. Operating Weight Range</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-gray-500">3.1 Canopy Version (kg)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.canopyVersionWeight?.toFixed(0) || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">3.2 Cab Version (kg)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.cabVersionWeight?.toFixed(0) || '—'}
                          </dd>
                    </div>
                  </div>
                </div>

                    {/* 4. Bucket Capacity */}
                      <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">4. Bucket Capacity Range (ISO heaped)</h4>
                        <dd className="text-lg font-semibold text-gray-900">
                        {selectedMachinery.specifications.bucketCapacity || '—'} m³
                        </dd>
                      </div>
                      
                    {/* 5. Emission Standard */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">5. Emission Standard</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <dt className="text-sm text-gray-500">5.1 EU</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.emissionStandardEU || '—'}
                        </dd>
                      </div>
                      <div>
                          <dt className="text-sm text-gray-500">5.2 EPA</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.emissionStandardEPA || '—'}
                        </dd>
                        </div>
                      </div>
                    </div>

                    {/* 6. Engine Model */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">6. Engine Model</h4>
                      <dd className="text-lg font-semibold text-gray-900">
                        {selectedMachinery.specifications.engineModel || '—'}
                      </dd>
                    </div>

                    {/* 7. Rated Power */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">7. Rated Power</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm text-gray-500">7.1 ISO9249,net (kW)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.ratedPowerISO9249 || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">7.2 SAE J1349, net (kW)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.ratedPowerSAEJ1349 || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">7.3 EEC 80/1269, net (kW)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.ratedPowerEEC80_1269 || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">7.4 No. of Cylinders</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.numberOfCylinders || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">7.5 Bore × Stroke (mm)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.boreByStroke || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">7.6 Piston Displacement (L)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.pistonDisplacement || '—'}
                          </dd>
                        </div>
                      </div>
                    </div>

                    {/* 8. Relief Valve Settings */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">8. Relief Valve Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm text-gray-500">8.1 Implement Circuit (MPa)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.implementCircuit || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">8.2 Swing Circuit (MPa)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.swingCircuit || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">8.3 Travel Circuit (MPa)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.travelCircuit || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">8.4 Max. Travel Speed Hi / Low (km/h)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.maxTravelSpeedHigh || '—'} / {selectedMachinery.specifications.maxTravelSpeedLow || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">8.5 Swing Speed (min⁻¹)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.swingSpeed || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">8.6 Standard Track Shoe Width (mm)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.standardTrackShoeWidth || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">8.7 Undercarriage Length (mm)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.undercarriageLength || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">8.8 Undercarriage Width (mm)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.undercarriageWidth || 
                             selectedMachinery.specifications.undercarriageWidthExtend || '—'}
                          </dd>
                        </div>
                      </div>
                    </div>


                    {/* 9. Capacity (Refilled) */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">9. Capacity (Refilled)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-gray-500">9.1 Fuel Tank (L)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.fuelTankCapacity || '—'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">9.2 Hydraulic System incl. oil tank (L)</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.hydraulicSystemCapacity || '—'}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineryComparison;