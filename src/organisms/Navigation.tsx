import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GitCompare as Compare, Calculator, Settings, Plus } from 'lucide-react';
import Button from '../atoms/Button';
import { useAppContext } from '../context/AppContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { comparisonMode, toggleComparisonMode, selectedMachinery } = useAppContext();

  const navItems = [
    {
      path: '/',
      label: 'Compare Machinery',
      icon: Compare,
    },
    {
      path: '/criteria-evaluation',
      label: 'Joint Evaluation',
      icon: Calculator,
    },
    {
      path: '/add-machinery',
      label: 'Add Machinery',
      icon: Plus,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Heavy Machinery Comparator
              </h1>
              <p className="text-xs text-gray-500">Industrial Equipment Analysis</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Comparison Mode Toggle */}
          {location.pathname === '/' && (
            <div className="flex items-center space-x-4">
              <Button
                variant={comparisonMode ? 'primary' : 'outline'}
                onClick={toggleComparisonMode}
                className="relative"
              >
                <Compare className="w-4 h-4 mr-2" />
                {comparisonMode ? 'Exit Compare' : 'Compare Mode'}
                {selectedMachinery.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedMachinery.length}
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Add Machinery Button */}
          {location.pathname !== '/add-machinery' && (
            <div className="flex items-center">
              <Link to="/add-machinery">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Machinery
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;