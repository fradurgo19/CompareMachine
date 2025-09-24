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
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
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
}

const schema = yup.object({
  name: yup.string().required('El nombre es requerido').min(3, 'El nombre debe tener al menos 3 caracteres'),
  model: yup.string().required('El modelo es requerido'),
  series: yup.string().required('La serie es requerida'),
  category: yup.string().required('La categoría es requerida'),
  manufacturer: yup.string().required('El fabricante es requerido'),
  price: yup.number().positive('El precio debe ser positivo').nullable(),
  availability: yup.string().required('La disponibilidad es requerida'),
  weight: yup.number().required('El peso es requerido').positive('El peso debe ser positivo'),
  power: yup.number().required('La potencia es requerida').positive('La potencia debe ser positiva'),
  maxOperatingWeight: yup.number().required('El peso máximo de operación es requerido').positive(),
  bucketCapacity: yup.number().positive('La capacidad del balde debe ser positiva').nullable(),
  maxDigDepth: yup.number().positive('La profundidad máxima de excavación debe ser positiva').nullable(),
  maxReach: yup.number().positive('El alcance máximo debe ser positivo').nullable(),
  transportLength: yup.number().required('La longitud de transporte es requerida').positive(),
  transportWidth: yup.number().required('El ancho de transporte es requerido').positive(),
  transportHeight: yup.number().required('La altura de transporte es requerida').positive(),
  engineModel: yup.string().required('El modelo del motor es requerido'),
  fuelCapacity: yup.number().required('La capacidad de combustible es requerida').positive(),
  hydraulicSystem: yup.string().nullable(),
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
      availability: 'AVAILABLE',
      category: 'EXCAVATORS',
      ...initialData
    }
  });

  const selectedCategory = watch('category');

  const categoryOptions = [
    { value: 'EXCAVATORS', label: 'Excavadoras' },
    { value: 'BULLDOZERS', label: 'Bulldozers' },
    { value: 'LOADERS', label: 'Cargadores' },
    { value: 'CRANES', label: 'Grúas' },
    { value: 'DUMP_TRUCKS', label: 'Volquetes' },
    { value: 'COMPACTORS', label: 'Compactadores' },
    { value: 'GRADERS', label: 'Niveladoras' },
  ];

  const availabilityOptions = [
    { value: 'AVAILABLE', label: 'Disponible' },
    { value: 'LIMITED', label: 'Limitado' },
    { value: 'UNAVAILABLE', label: 'No Disponible' },
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
    { value: 'Other', label: 'Otro' },
  ];

  const onFormSubmit = async (data: MachineryFormData) => {
    try {
      await onSubmit(data, images);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const showExcavatorFields = selectedCategory === 'EXCAVATORS';
  const showLoaderFields = selectedCategory === 'LOADERS';

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Editar Maquinaria' : 'Agregar Nueva Maquinaria'}
          </h2>
          <Button variant="ghost" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre de la Maquinaria *"
                {...register('name')}
                error={errors.name?.message}
                placeholder="ej., Excavadora Hidráulica CAT 320"
              />
              
              <Input
                label="Modelo *"
                {...register('model')}
                error={errors.model?.message}
                placeholder="e.g., 320"
              />
              
              <Input
                label="Serie *"
                {...register('series')}
                error={errors.series?.message}
                placeholder="ej., Nueva Generación"
              />
              
              <Select
                label="Categoría *"
                options={categoryOptions}
                {...register('category')}
                error={errors.category?.message}
              />
              
              <Select
                label="Fabricante *"
                options={manufacturerOptions}
                {...register('manufacturer')}
                error={errors.manufacturer?.message}
              />
              
              <Select
                label="Disponibilidad *"
                options={availabilityOptions}
                {...register('availability')}
                error={errors.availability?.message}
              />
              
              <Input
                label="Precio (USD)"
                type="number"
                step="1000"
                {...register('price')}
                error={errors.price?.message}
                placeholder="285000"
              />
            </div>
            
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Peso de Operación (toneladas) *"
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