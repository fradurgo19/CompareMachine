import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, X, Loader2 } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import Card from '../atoms/Card';
import { MachineryCategory } from '../types';

interface MachineryFormData {
  name: string;
  model: string;
  series: string;
  category: MachineryCategory;
  manufacturer: string;
  price?: number;
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  
  // Region Offerings
  regionOfferings: string;
  
  // Operating Weight Range
  canopyVersionWeight?: number;
  cabVersionWeight?: number;
  
  // Bucket Capacity
  bucketCapacity?: number;
  
  // Emission Standards
  emissionStandardEU?: string;
  emissionStandardEPA?: string;
  
  // Engine Model & Rated Power
  engineModel: string;
  ratedPowerISO9249: number;
  ratedPowerSAEJ1349?: number;
  ratedPowerEEC80_1269?: number;
  numberOfCylinders?: number;
  boreByStroke?: string;
  pistonDisplacement?: number;
  
  // Relief Valve Settings
  implementCircuit?: number;
  swingCircuit?: number;
  travelCircuit?: number;
  maxTravelSpeedHigh?: number;
  maxTravelSpeedLow?: number;
  swingSpeed?: number;
  standardTrackShoeWidth?: number;
  undercarriageLength?: number;
  undercarriageWidth?: number;
  
  // Capacity
  fuelTankCapacity: number;
  hydraulicSystemCapacity?: number;
}

const schema = yup.object({
  name: yup.string().required('El nombre es requerido').min(3, 'El nombre debe tener al menos 3 caracteres'),
  model: yup.string().required('El modelo es requerido'),
  series: yup.string().required('La serie es requerida'),
  category: yup.string().required('La categoría es requerida'),
  manufacturer: yup.string().required('El fabricante es requerido'),
  price: yup.number().positive('El precio debe ser positivo').nullable(),
  availability: yup.string().required('La disponibilidad es requerida'),
  
  regionOfferings: yup.string().nullable(),
  canopyVersionWeight: yup.number().positive().nullable(),
  cabVersionWeight: yup.number().positive().nullable(),
  bucketCapacity: yup.number().positive().nullable(),
  emissionStandardEU: yup.string().nullable(),
  emissionStandardEPA: yup.string().nullable(),
  
  engineModel: yup.string().required('El modelo del motor es requerido'),
  ratedPowerISO9249: yup.number().required('La potencia ISO9249 es requerida').positive(),
  ratedPowerSAEJ1349: yup.number().positive().nullable(),
  ratedPowerEEC80_1269: yup.number().positive().nullable(),
  numberOfCylinders: yup.number().integer().positive().nullable(),
  boreByStroke: yup.string().nullable(),
  pistonDisplacement: yup.number().positive().nullable(),
  
  implementCircuit: yup.number().positive().nullable(),
  swingCircuit: yup.number().positive().nullable(),
  travelCircuit: yup.number().positive().nullable(),
  maxTravelSpeedHigh: yup.number().positive().nullable(),
  maxTravelSpeedLow: yup.number().positive().nullable(),
  swingSpeed: yup.number().positive().nullable(),
  standardTrackShoeWidth: yup.number().positive().nullable(),
  undercarriageLength: yup.number().positive().nullable(),
  undercarriageWidth: yup.number().positive().nullable(),
  
  fuelTankCapacity: yup.number().required('La capacidad de combustible es requerida').positive(),
  hydraulicSystemCapacity: yup.number().positive().nullable(),
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
  } = useForm<MachineryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      availability: 'AVAILABLE',
      category: 'EXCAVATORS',
      ...initialData
    }
  });

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
    { value: 'Hitachi', label: 'Hitachi' },
    { value: 'Komatsu', label: 'Komatsu' },
    { value: 'Volvo', label: 'Volvo' },
    { value: 'Liebherr', label: 'Liebherr' },
    { value: 'John Deere', label: 'John Deere' },
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

  return (
    <div className="max-w-6xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="1. Modelo *"
                {...register('model')}
                error={errors.model?.message}
                placeholder="ej., ZX38U-5A"
              />
              
              <Input
                label="Nombre de la Maquinaria *"
                {...register('name')}
                error={errors.name?.message}
                placeholder="ej., Hitachi ZX38U-5A Excavator"
              />
              
              <Input
                label="Serie *"
                {...register('series')}
                error={errors.series?.message}
                placeholder="ej., ZX-5A"
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

          {/* 2. Region Offerings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Region Offerings</h3>
            <TextArea
              label="Regiones (separadas por coma)"
              {...register('regionOfferings')}
              error={errors.regionOfferings?.message}
              placeholder="SE Asia, Oceania, Europe, Russia・CIS, Africa, Middle East"
              rows={2}
            />
          </div>

          {/* 3. Operating Weight Range */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Operating Weight Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="3.1 Canopy Version (kg)"
                type="number"
                step="1"
                {...register('canopyVersionWeight')}
                error={errors.canopyVersionWeight?.message}
                placeholder="3770"
              />
              
              <Input
                label="3.2 Cab Version (kg)"
                type="number"
                step="1"
                {...register('cabVersionWeight')}
                error={errors.cabVersionWeight?.message}
                placeholder="3940"
              />
            </div>
          </div>

          {/* 4. Bucket Capacity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Bucket Capacity Range (ISO heaped)</h3>
            <Input
              label="Bucket Capacity (m³)"
              type="number"
              step="0.01"
              {...register('bucketCapacity')}
              error={errors.bucketCapacity?.message}
              placeholder="0.10"
            />
          </div>

          {/* 5. Emission Standards */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Emission Standard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="5.1 EU Standard"
                {...register('emissionStandardEU')}
                error={errors.emissionStandardEU?.message}
                placeholder="Stage III A"
              />
              
              <Input
                label="5.2 EPA Standard"
                {...register('emissionStandardEPA')}
                error={errors.emissionStandardEPA?.message}
                placeholder="Interim Tier4"
              />
            </div>
            </div>
            
          {/* 6. Engine Model */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Engine Model</h3>
            <Input
              label="Engine Model *"
              {...register('engineModel')}
              error={errors.engineModel?.message}
              placeholder="Yanmar EDM-3TNV88"
            />
          </div>

          {/* 7. Rated Power */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Rated Power</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="7.1 ISO9249,net (kW) *"
                type="number"
                step="0.1"
                {...register('ratedPowerISO9249')}
                error={errors.ratedPowerISO9249?.message}
                placeholder="21.2"
              />
              
              <Input
                label="7.2 SAE J1349, net (kW)"
                type="number"
                step="0.1"
                {...register('ratedPowerSAEJ1349')}
                error={errors.ratedPowerSAEJ1349?.message}
                placeholder="21.2"
              />
              
              <Input
                label="7.3 EEC 80/1269, net (kW)"
                type="number"
                step="0.1"
                {...register('ratedPowerEEC80_1269')}
                error={errors.ratedPowerEEC80_1269?.message}
                placeholder="21.2"
              />
              
              <Input
                label="7.4 No. of Cylinders"
                type="number"
                {...register('numberOfCylinders')}
                error={errors.numberOfCylinders?.message}
                placeholder="3"
              />
              
              <Input
                label="7.5 Bore × Stroke (mm)"
                {...register('boreByStroke')}
                error={errors.boreByStroke?.message}
                placeholder="88 x 90"
              />
              
              <Input
                label="7.6 Piston Displacement (L)"
                type="number"
                step="0.001"
                {...register('pistonDisplacement')}
                error={errors.pistonDisplacement?.message}
                placeholder="1.642"
              />
            </div>
          </div>

          {/* 8. Relief Valve Settings */}
            <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Relief Valve Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                label="8.1 Implement Circuit (MPa)"
                type="number"
                step="0.1"
                {...register('implementCircuit')}
                error={errors.implementCircuit?.message}
                placeholder="24.5"
              />
              
              <Input
                label="8.2 Swing Circuit (MPa)"
                type="number"
                step="0.1"
                {...register('swingCircuit')}
                error={errors.swingCircuit?.message}
                placeholder="18.6"
              />
              
              <Input
                label="8.3 Travel Circuit (MPa)"
                type="number"
                step="0.1"
                {...register('travelCircuit')}
                error={errors.travelCircuit?.message}
                placeholder="24.5"
              />
              
              <Input
                label="8.4 Max. Travel Speed High (km/h)"
                  type="number"
                step="0.1"
                {...register('maxTravelSpeedHigh')}
                error={errors.maxTravelSpeedHigh?.message}
                placeholder="4.3"
              />
              
                    <Input
                label="8.4 Max. Travel Speed Low (km/h)"
                      type="number"
                step="0.1"
                {...register('maxTravelSpeedLow')}
                error={errors.maxTravelSpeedLow?.message}
                placeholder="2.8"
                    />
                    
                    <Input
                label="8.5 Swing Speed (min⁻¹)"
                      type="number"
                step="0.1"
                {...register('swingSpeed')}
                error={errors.swingSpeed?.message}
                placeholder="9.1"
              />
              
              <Input
                label="8.6 Standard Track Shoe Width (mm)"
                type="number"
                {...register('standardTrackShoeWidth')}
                error={errors.standardTrackShoeWidth?.message}
                placeholder="300"
              />
              
              <Input
                label="8.7 Undercarriage Length (mm)"
                type="number"
                {...register('undercarriageLength')}
                error={errors.undercarriageLength?.message}
                placeholder="2110"
              />
              
              <Input
                label="8.8 Undercarriage Width (mm)"
                type="number"
                {...register('undercarriageWidth')}
                error={errors.undercarriageWidth?.message}
                placeholder="1740"
              />
            </div>
          </div>

          {/* 9. Capacity (Refilled) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">9. Capacity (Refilled)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="9.1 Fuel Tank (L) *"
                type="number"
                step="0.1"
                {...register('fuelTankCapacity')}
                error={errors.fuelTankCapacity?.message}
                placeholder="42.0"
              />
              
              <Input
                label="9.2 Hydraulic System incl. oil tank (L)"
                type="number"
                step="0.1"
                {...register('hydraulicSystemCapacity')}
                error={errors.hydraulicSystemCapacity?.message}
                placeholder="88.0"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              loading={isSubmitting || isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Actualizar Maquinaria' : 'Agregar Maquinaria'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MachineryForm;
