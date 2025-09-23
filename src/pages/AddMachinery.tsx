import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ArrowLeft } from 'lucide-react';
import MachineryForm from '../molecules/MachineryForm';
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
  weight: number;
  power: number;
  maxOperatingWeight: number;
  bucketCapacity?: number;
  maxDigDepth?: number;
  maxReach?: number;
  transportLength: number;
  transportWidth: number;
  transportHeight: number;
  engineModel: string;
  fuelCapacity: number;
  hydraulicSystem?: string;
  description?: string;
}

// Real API function that calls the backend
const addMachinery = async (data: MachineryFormData, _images: File[]): Promise<Machinery> => {
  // For now, we'll use default images since file upload isn't implemented yet
  const defaultImages = [
    'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg'
  ];

  // Prepare the data for the backend
  const machineryData = {
    name: data.name,
    model: data.model,
    series: data.series,
    category: data.category,
    manufacturer: data.manufacturer,
    images: defaultImages,
    specifications: {
      weight: data.weight,
      power: data.power,
      maxOperatingWeight: data.maxOperatingWeight,
      bucketCapacity: data.bucketCapacity,
      maxDigDepth: data.maxDigDepth,
      maxReach: data.maxReach,
      transportLength: data.transportLength,
      transportWidth: data.transportWidth,
      transportHeight: data.transportHeight,
      engineModel: data.engineModel,
      fuelCapacity: data.fuelCapacity,
      hydraulicSystem: data.hydraulicSystem,
    },
    price: data.price,
    availability: data.availability,
  };

  // Call the real backend API
  const response = await api.createMachinery(machineryData);
  
  if (!response.success) {
    throw new Error(response.message || 'Error al crear la maquinaria');
  }

  return response.data;
};

const AddMachinery: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
            La nueva maquinaria ha sido agregada a la base de datos de comparación.
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
                Ingresa especificaciones detalladas para comparación de maquinaria
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <MachineryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={addMachineryMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AddMachinery;