import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Machinery } from '../types';
import MachineryGrid from '../organisms/MachineryGrid';
import { Eye, X, Download, Star, Wrench, Plus } from 'lucide-react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { useAppContext } from '../context/AppContext';

const MachineryComparison: React.FC = () => {
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const { comparisonMode } = useAppContext();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Heavy Machinery Comparison
              </h1>
              <p className="text-gray-600">
                Compare industrial equipment specifications, performance, and pricing
              </p>
            </div>
            
            {!comparisonMode && (
              <Link to="/add-machinery">
                <Button variant="primary" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Machinery
                </Button>
              </Link>
            )}
          </div>
        </div>

        <MachineryGrid onViewDetails={handleViewDetails} />

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
                    Download Report
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
                        <h3 className="text-lg font-semibold mb-2">Price</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          ${selectedMachinery.price.toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Category</h3>
                      <p className="text-gray-600 capitalize">
                        {selectedMachinery.category.replace('-', ' ')}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Series Information</h3>
                      <p className="text-gray-600">
                        Series: {selectedMachinery.series}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Specifications */}
                <Card>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Technical Specifications
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Operating Weight</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.weight} tons
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Engine Power</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.power} HP
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Engine Model</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.engineModel}
                        </dd>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedMachinery.specifications.bucketCapacity && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Bucket Capacity</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.bucketCapacity} m³
                          </dd>
                        </div>
                      )}

                      {selectedMachinery.specifications.maxDigDepth && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Max Dig Depth</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {selectedMachinery.specifications.maxDigDepth} m
                          </dd>
                        </div>
                      )}

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fuel Capacity</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.fuelCapacity} L
                        </dd>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Transport Length</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.transportLength} m
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Transport Width</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {selectedMachinery.specifications.transportWidth} m
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">Transport Height</dt>
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
                          Hydraulic System
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