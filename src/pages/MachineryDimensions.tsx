import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface MachineryDimension {
  id: string;
  applicableModels: string[];
  imageUrl: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const MachineryDimensions: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchModel, setSearchModel] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    applicableModels: '',
    imageUrl: '',
    description: '',
  });

  // Fetch dimensions
  const { data: dimensionsData, isLoading } = useQuery({
    queryKey: ['dimensions', searchModel],
    queryFn: async () => {
      const response = await api.request(`/dimensions${searchModel ? `/search/${searchModel}` : ''}`);
      return response.data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('➕ Creating dimension with data:', data);
      const response = await api.request('/dimensions', 'POST', data);
      console.log('✅ Create response:', response);
      return response;
    },
    onSuccess: (response) => {
      console.log('✅ Create successful, response:', response);
      queryClient.invalidateQueries({ queryKey: ['dimensions'] });
      resetForm();
      setIsAddingNew(false);
      alert('✅ Dimensión creada exitosamente!');
    },
    onError: (error: any) => {
      console.error('❌ Create error:', error);
      alert(`❌ Error al crear: ${error.message || 'Error desconocido'}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log('📝 Updating dimension:', id, 'with data:', data);
      const response = await api.request(`/dimensions/${id}`, 'PUT', data);
      console.log('✅ Update response:', response);
      return response;
    },
    onSuccess: (response) => {
      console.log('✅ Update successful, response:', response);
      queryClient.invalidateQueries({ queryKey: ['dimensions'] });
      resetForm();
      setEditingId(null);
      alert('✅ Dimensión actualizada exitosamente!');
    },
    onError: (error: any) => {
      console.error('❌ Update error:', error);
      alert(`❌ Error al actualizar: ${error.message || 'Error desconocido'}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.request(`/dimensions/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dimensions'] });
    },
  });

  const resetForm = () => {
    setFormData({
      applicableModels: '',
      imageUrl: '',
      description: '',
    });
  };

  const handleEdit = (dimension: MachineryDimension) => {
    setEditingId(dimension.id);
    setFormData({
      applicableModels: dimension.applicableModels.join(', '),
      imageUrl: dimension.imageUrl,
      description: dimension.description || '',
    });
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const modelsArray = formData.applicableModels
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);
    
    const data = {
      applicableModels: modelsArray,
      imageUrl: formData.imageUrl.trim(),
      description: formData.description.trim() || undefined,
    };

    console.log('📝 Form submitted');
    console.log('📋 Models count:', modelsArray.length);
    console.log('📋 Models:', modelsArray);
    console.log('🔗 Image URL:', data.imageUrl);
    console.log('📝 Description:', data.description);

    if (editingId) {
      console.log('🔄 Updating dimension ID:', editingId);
      updateMutation.mutate({ id: editingId, data });
    } else {
      console.log('➕ Creating new dimension');
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta dimensión?')) {
      deleteMutation.mutate(id);
    }
  };

  const dimensions = dimensionsData || [];
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dimensiones de Maquinaria
          </h1>
          <p className="text-gray-600">
            Busca y visualiza las dimensiones técnicas de diferentes modelos de maquinaria
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por Modelo
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    value={searchModel}
                    onChange={(e) => setSearchModel(e.target.value)}
                    placeholder="Ej: ZX130LC-5B, ZX200-5B, etc."
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Puedes buscar por modelo exacto o parte del nombre
                </p>
              </div>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setIsAddingNew(!isAddingNew);
                    setEditingId(null);
                    resetForm();
                  }}
                  variant="primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Dimensión
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Add/Edit Form */}
        {(isAddingNew || editingId) && isAdmin && (
          <Card className="mb-6 border-2 border-blue-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingId ? 'Editar Dimensión' : 'Nueva Dimensión'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelos Aplicables *
                  </label>
                  <Input
                    value={formData.applicableModels}
                    onChange={(e) => setFormData({ ...formData, applicableModels: e.target.value })}
                    placeholder="ZX130LC-5B, ZX160LC-5B, ZX180LC-5B"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separa múltiples modelos con comas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen *
                  </label>
                  <Input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL de Cloudinary u otro servicio de almacenamiento
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Opcional)
                  </label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción adicional sobre las dimensiones..."
                    rows={3}
                  />
                </div>

                {/* Preview */}
                {formData.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vista Previa
                    </label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="max-w-full h-auto rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Actualizar' : 'Guardar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingId(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Results */}
        <div className="space-y-6">
          {isLoading ? (
            <Card>
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando dimensiones...</p>
              </div>
            </Card>
          ) : dimensions.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron dimensiones
                </h3>
                <p className="text-gray-600">
                  {searchModel
                    ? `No hay dimensiones registradas para el modelo "${searchModel}"`
                    : 'No hay dimensiones registradas en el sistema'}
                </p>
              </div>
            </Card>
          ) : (
            dimensions.map((dimension: MachineryDimension) => (
              <Card key={dimension.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Modelos Aplicables
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {dimension.applicableModels.map((model, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(dimension)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dimension.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {dimension.description && (
                    <p className="text-gray-600 mb-4">{dimension.description}</p>
                  )}

                  {/* Image */}
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <img
                      src={dimension.imageUrl}
                      alt={`Dimensiones para ${dimension.applicableModels.join(', ')}`}
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Error+al+cargar+imagen';
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div>
                      Creado por: <span className="font-medium">{dimension.user.name}</span>
                    </div>
                    <div>
                      {new Date(dimension.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineryDimensions;

