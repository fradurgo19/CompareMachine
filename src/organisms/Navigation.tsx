import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GitCompare as Compare, Calculator, Settings, Plus, LogOut, LogIn, UserPlus, User } from 'lucide-react';
import Button from '../atoms/Button';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { comparisonMode, toggleComparisonMode, selectedMachinery } = useAppContext();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    {
      path: '/compare',
      label: 'Comparar Maquinaria',
      icon: Compare,
      requiresAuth: true, // Requires authentication
    },
    {
      path: '/criteria-evaluation',
      label: 'Evaluación de Juntas',
      icon: Calculator,
      requiresAuth: true, // Requires authentication
    },
    {
      path: '/add-machinery',
      label: 'Agregar Maquinaria',
      icon: Plus,
      requiresAuth: true, // Requires authentication
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dbufrzoda/image/upload/v1750457354/Captura_de_pantalla_2025-06-20_170819_wzmyli.png"
              alt="Logo de la empresa"
              className="w-24 h-24 mr-4 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Comparador de Maquinaria Pesada
              </h1>
              <p className="text-xs text-gray-500">Análisis de Equipos Industriales</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems
              .filter(item => !item.requiresAuth || isAuthenticated)
              .map((item) => {
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

          {/* Comparison Mode Toggle - Only for authenticated users */}
          {location.pathname === '/compare' && isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Button
                variant={comparisonMode ? 'primary' : 'outline'}
                onClick={toggleComparisonMode}
                className="relative"
              >
                <Compare className="w-4 h-4 mr-2" />
                {comparisonMode ? 'Cerrar Comparación' : `Seleccionadas (${selectedMachinery.length})`}
                {selectedMachinery.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedMachinery.length}
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Add Machinery Button - Only for authenticated users */}
            {isAuthenticated && location.pathname !== '/add-machinery' && location.pathname === '/compare' && (
              <Link to="/add-machinery">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Maquinaria
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="outline"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  {user?.name}
                  {user?.role === 'admin' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </Button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;