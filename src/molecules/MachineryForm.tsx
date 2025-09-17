import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, X, Loader2 } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import FileUpload from '../atoms/FileUpload';
import Card from '../atoms/Card';
import { Machinery, MachineryCategory } from '../types';

interface MachineryFormData {
  name: string;
  model: string;
  series: string;
  category: MachineryCategory;
  manufacturer: string;
  price?: number;
  availability: 'available' | 'limited' | 'unavailable';
  // Specifications
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
  // Additional fields
  description?: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  model: yup.string().required('Model is required'),
  series: yup.string().required('Series is required'),
  category: yup.string().required('Category is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  price: yup.number().positive('Price must be positive').nullable(),
  availability: yup.string().required('Availability is required'),
  weight: yup.number().required('Weight is required').positive('Weight must be positive'),
  power: yup.number().required('Power is required').positive('Power must be positive'),
  maxOperatingWeight: yup.number().required('Max operating weight is required').positive(),
  bucketCapacity: yup.number().positive('Bucket capacity must be positive').nullable(),
  maxDigDepth: yup.number().positive('Max dig depth must be positive').nullable(),
  maxReach: yup.number().positive('Max reach must be positive').nullable(),
  transportLength: yup.number().required('Transport length is required').positive(),
  transportWidth: yup.number().required('Transport width is required').positive(),
  transportHeight: yup.number().required('Transport height is required').positive(),
  engineModel: yup.string().required('Engine model is required'),
  fuelCapacity: yup.number().required('Fuel capacity is required').positive(),
  hydraulicSystem: yup.string().nullable(),
  description: yup.string().nullable(),
});

interface MachineryFormProps {
  onSubmit: (data: MachineryFormData, images: File[]) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<MachineryFormData>;
  isLoading?: boolean;
}

const MachineryForm: React.FC<MachineryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [images, setImages] = useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<MachineryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      availability: 'available',
      category: 'excavators',
      ...initialData
    }
  });

  const selectedCategory = watch('category');

  const categoryOptions = [
    { value: 'excavators', label: 'Excavators' },
    { value: 'bulldozers', label: 'Bulldozers' },
    { value: 'loaders', label: 'Loaders' },
    { value: 'cranes', label: 'Cranes' },
    { value: 'dump-trucks', label: 'Dump Trucks' },
    { value: 'compactors', label: 'Compactors' },
    { value: 'graders', label: 'Graders' },
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available' },
    { value: 'limited', label: 'Limited' },
    { value: 'unavailable', label: 'Unavailable' },
  ];

  const manufacturerOptions = [
    { value: 'Caterpillar', label: 'Caterpillar' },
    { value: 'John Deere', label: 'John Deere' },
    { value: 'Komatsu', label: 'Komatsu' },
    { value: 'Volvo', label: 'Volvo' },
    { value: 'Liebherr', label: 'Liebherr' },
    { value: 'Hitachi', label: 'Hitachi' },
    { value: 'Case', label: 'Case' },
    { value: 'JCB', label: 'JCB' },
    { value: 'Other', label: 'Other' },
  ];

  const onFormSubmit = async (data: MachineryFormData) => {
    try {
      await onSubmit(data, images);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const showExcavatorFields = selectedCategory === 'excavators';
  const showLoaderFields = selectedCategory === 'loaders';

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Machinery' : 'Add New Machinery'}
          </h2>
          <Button variant="ghost" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Machinery Name *"
                {...register('name')}
                error={errors.name?.message}
                placeholder="e.g., CAT 320 Hydraulic Excavator"
              />
              
              <Input
                label="Model *"
                {...register('model')}
                error={errors.model?.message}
                placeholder="e.g., 320"
              />
              
              <Input
                label="Series *"
                {...register('series')}
                error={errors.series?.message}
                placeholder="e.g., Next Generation"
              />
              
              <Select
                label="Category *"
                options={categoryOptions}
                {...register('category')}
                error={errors.category?.message}
              />
              
              <Select
                label="Manufacturer *"
                options={manufacturerOptions}
                {...register('manufacturer')}
                error={errors.manufacturer?.message}
              />
              
              <Select
                label="Availability *"
                options={availabilityOptions}
                {...register('availability')}
                error={errors.availability?.message}
              />
              
              <Input
                label="Price (USD)"
                type="number"
                step="1000"
                {...register('price')}
                error={errors.price?.message}
                placeholder="285000"
              />
            </div>
            
            <div className="mt-4">
              <TextArea
                label="Description"
                {...register('description')}
                error={errors.description?.message}
                placeholder="Brief description of the machinery..."
                rows={3}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Operating Weight (tons) *"
                type="number"
                step="0.1"
                {...register('weight')}
                error={errors.weight?.message}
                placeholder="20.2"
              />
              
              <Input
                label="Engine Power (HP) *"
                type="number"
                {...register('power')}
                error={errors.power?.message}
                placeholder="122"
              />
              
              <Input
                label="Max Operating Weight (kg) *"
                type="number"
                {...register('maxOperatingWeight')}
                error={errors.maxOperatingWeight?.message}
                placeholder="20200"
              />
              
              <Input
                label="Engine Model *"
                {...register('engineModel')}
                error={errors.engineModel?.message}
                placeholder="Cat C4.4 ACERT"
              />
              
              <Input
                label="Fuel Capacity (L) *"
                type="number"
                {...register('fuelCapacity')}
                error={errors.fuelCapacity?.message}
                placeholder="410"
              />
              
              <Input
                label="Hydraulic System"
                {...register('hydraulicSystem')}
                error={errors.hydraulicSystem?.message}
                placeholder="Advanced Hydraulic System"
              />
            </div>
          </div>

          {/* Category-Specific Fields */}
          {(showExcavatorFields || showLoaderFields) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {showExcavatorFields ? 'Excavator' : 'Loader'} Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Bucket Capacity (m³)"
                  type="number"
                  step="0.01"
                  {...register('bucketCapacity')}
                  error={errors.bucketCapacity?.message}
                  placeholder="0.91"
                />
                
                {showExcavatorFields && (
                  <>
                    <Input
                      label="Max Dig Depth (m)"
                      type="number"
                      step="0.01"
                      {...register('maxDigDepth')}
                      error={errors.maxDigDepth?.message}
                      placeholder="6.52"
                    />
                    
                    <Input
                      label="Max Reach (m)"
                      type="number"
                      step="0.01"
                      {...register('maxReach')}
                      error={errors.maxReach?.message}
                      placeholder="9.9"
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Transport Dimensions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transport Dimensions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Transport Length (m) *"
                type="number"
                step="0.01"
                {...register('transportLength')}
                error={errors.transportLength?.message}
                placeholder="9.53"
              />
              
              <Input
                label="Transport Width (m) *"
                type="number"
                step="0.01"
                {...register('transportWidth')}
                error={errors.transportWidth?.message}
                placeholder="2.55"
              />
              
              <Input
                label="Transport Height (m) *"
                type="number"
                step="0.01"
                {...register('transportHeight')}
                error={errors.transportHeight?.message}
                placeholder="3.15"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <FileUpload
              label="Machinery Images"
              accept="image/*"
              multiple={true}
              maxFiles={5}
              onFilesChange={setImages}
              value={images}
              helpText="Upload up to 5 high-quality images of the machinery"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              loading={isSubmitting || isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Update Machinery' : 'Add Machinery'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MachineryForm;