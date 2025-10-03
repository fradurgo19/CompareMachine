import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ArrowLeft, Copy, FormInput, FileSpreadsheet } from 'lucide-react';
import MachineryForm from '../molecules/MachineryForm';
import TextSpecificationParser from '../components/TextSpecificationParser';
import ExcelSpecificationParser from '../components/ExcelSpecificationParser';
import Button from '../atoms/Button';
import { Machinery } from '../types';
import api from '../services/api';

interface MachineryFormData {
  name: string;
  model: string;
  series: string;
  category: string;
  manufacturer: string;
  price?: number;
  availability: 'available' | 'limited' | 'unavailable';
  
  // New specifications
  regionOfferings?: string;
  canopyVersionWeight?: number;
  cabVersionWeight?: number;
  bucketCapacity?: number;
  emissionStandardEU?: string;
  emissionStandardEPA?: string;
  engineModel?: string;
  ratedPowerISO9249?: number;
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
  fuelTankCapacity?: number;
  hydraulicSystemCapacity?: number;
}

// Real API function that calls the backend
const addMachinery = async (data: MachineryFormData, _images: File[]): Promise<Machinery> => {
  // For now, we'll use default images since file upload isn't implemented yet
  const defaultImages = [
    'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg'
  ];

  // Generate name if not provided
  const name = data.name || `${data.manufacturer || 'Unknown'} ${data.model || 'Unknown'} Excavator`;
  
  // Generate series from model if not provided
  const series = data.series || (data.model?.split('-')[0] || 'Unknown Series');
  
  // Default availability
  const availability = data.availability || 'AVAILABLE';

  // Prepare the data for the backend with new specifications
  const machineryData = {
    name,
    model: data.model || 'Unknown',
    series,
    category: data.category || 'EXCAVATORS',
    manufacturer: data.manufacturer || 'Unknown',
    images: defaultImages,
    specifications: {
      regionOfferings: data.regionOfferings ? data.regionOfferings.split(',').map(s => s.trim()) : [],
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
    availability: availability,
  };

  // Call the real backend API
  const response = await api.createMachinery(machineryData);
  
  if (!response.success) {
    throw new Error(response.message || 'Error al crear la maquinaria');
  }

  return response.data;
};

type TabType = 'manual' | 'paste' | 'excel';

const AddMachinery: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('excel');
  const [parsedMachinery, setParsedMachinery] = useState<any[]>([]);

  const addMachineryMutation = useMutation({
    mutationFn: ({ data, images }: { data: MachineryFormData; images: File[] }) =>
      addMachinery(data, images),
    onSuccess: (newMachinery) => {
      // Update the cache with the new machinery
      queryClient.setQueryData(['machinery'], (oldData: any) => {
        if (!oldData) return { data: [newMachinery], success: true };
        return {
          ...oldData,
          data: [newMachinery, ...oldData.data],
        };
      });
      
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['machinery'] });
      queryClient.invalidateQueries({ queryKey: ['manufacturers'] });
      
      setShowSuccessMessage(true);
      
      // Navigate back after showing success message
      setTimeout(() => {
        navigate('/compare');
      }, 2000);
    },
    onError: (error) => {
      console.error('Error adding machinery:', error);
      alert('Error al agregar maquinaria. Por favor, inténtalo de nuevo.');
    },
  });

  const handleSubmit = async (data: MachineryFormData, images: File[]) => {
    addMachineryMutation.mutate({ data, images });
  };

  const handleCancel = () => {
    navigate('/compare');
  };

  const handleParsed = (machinery: any[]) => {
    setParsedMachinery(machinery);
  };

  const handleAddParsedMachinery = async () => {
    if (parsedMachinery.length === 0) {
      alert('No hay máquinas parseadas para agregar.');
      return;
    }

    try {
      // Add all parsed machinery
      for (const machinery of parsedMachinery) {
        const machineryData = {
          name: machinery.name,
          model: machinery.model,
          series: machinery.series,
          category: machinery.category,
          manufacturer: machinery.manufacturer,
          images: ['https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg'],
          specifications: machinery.specifications,
          price: machinery.price,
          availability: machinery.availability,
        };

        await api.createMachinery(machineryData);
      }

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['machinery'] });
      queryClient.invalidateQueries({ queryKey: ['manufacturers'] });

      setShowSuccessMessage(true);

      // Navigate back after showing success message
      setTimeout(() => {
        navigate('/compare');
      }, 2000);
    } catch (error) {
      console.error('Error adding parsed machinery:', error);
      alert('Error al agregar las máquinas parseadas. Por favor, inténtalo de nuevo.');
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Maquinaria Agregada Exitosamente!
          </h2>
          <p className="text-gray-600 mb-4">
            {parsedMachinery.length > 0 
              ? `Se agregaron ${parsedMachinery.length} máquina(s) a la base de datos.`
              : 'La nueva maquinaria ha sido agregada a la base de datos de comparación.'}
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo a la página principal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/compare')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Comparación
          </Button>
          
          <div className="flex items-center">
            <Plus className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Agregar Nueva Maquinaria
              </h1>
              <p className="text-gray-600 mt-1">
                Sube Excel, copia y pega, o ingresa manualmente las especificaciones
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('excel')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'excel'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  Excel Upload
                </div>
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'paste'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar y Pegar
                </div>
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'manual'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <FormInput className="w-5 h-5 mr-2" />
                  Entrada Manual
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'excel' ? (
          <div>
            <ExcelSpecificationParser onParsed={handleParsed} />
            
            {parsedMachinery.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleAddParsedMachinery} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar {parsedMachinery.length} Máquina(s)
                </Button>
              </div>
            )}
          </div>
        ) : activeTab === 'paste' ? (
          <div>
            <TextSpecificationParser onParsed={handleParsed} />
            
            {parsedMachinery.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleAddParsedMachinery} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar {parsedMachinery.length} Máquina(s)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <MachineryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={addMachineryMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default AddMachinery;