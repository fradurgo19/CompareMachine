import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ArrowLeft } from 'lucide-react';
import MachineryForm from '../molecules/MachineryForm';
import Button from '../atoms/Button';
import { Machinery } from '../types';

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

// Mock API function - in a real app, this would call your backend
const addMachinery = async (data: MachineryFormData, images: File[]): Promise<Machinery> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Convert images to URLs (in a real app, you'd upload to a file storage service)
  const imageUrls = images.map((file, index) => 
    URL.createObjectURL(file) // This is just for demo - use proper file upload service
  );
  
  // If no images provided, use default placeholder
  const finalImages = imageUrls.length > 0 ? imageUrls : [
    'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg'
  ];

  const newMachinery: Machinery = {
    id: Date.now().toString(),
    name: data.name,
    model: data.model,
    series: data.series,
    category: data.category as any,
    manufacturer: data.manufacturer,
    images: finalImages,
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
    rating: 4.0 + Math.random(), // Random rating for demo
    createdAt: new Date().toISOString(),
  };

  return newMachinery;
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
        navigate('/');
      }, 2000);
    },
    onError: (error) => {
      console.error('Error adding machinery:', error);
      alert('Error adding machinery. Please try again.');
    },
  });

  const handleSubmit = async (data: MachineryFormData, images: File[]) => {
    addMachineryMutation.mutate({ data, images });
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Machinery Added Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            The new machinery has been added to the comparison database.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to main page...
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
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Comparison
          </Button>
          
          <div className="flex items-center">
            <Plus className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Machinery
              </h1>
              <p className="text-gray-600 mt-1">
                Enter detailed specifications for machinery comparison
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