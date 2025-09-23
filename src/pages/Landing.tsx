import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, Calculator, Plus, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';

const Landing: React.FC = () => {
  const features = [
    {
      icon: GitCompare,
      title: 'Comparación Avanzada',
      description: 'Compara múltiples máquinas con gráficos interactivos y análisis detallado de especificaciones.',
    },
    {
      icon: Calculator,
      title: 'Evaluación de Juntas',
      description: 'Herramienta especializada para evaluar criterios de juntas en maquinaria pesada.',
    },
    {
      icon: Plus,
      title: 'Gestión de Inventario',
      description: 'Agrega y administra tu inventario de maquinaria con especificaciones detalladas.',
    },
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Análisis Profesional',
      description: 'Herramientas de análisis avanzadas para tomar decisiones informadas.',
    },
    {
      icon: Shield,
      title: 'Datos Seguros',
      description: 'Tus datos están protegidos con las mejores prácticas de seguridad.',
    },
    {
      icon: Zap,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva diseñada para facilitar tu trabajo diario.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <GitCompare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Comparador de Maquinaria Pesada
                </h1>
                <p className="text-xs text-gray-500">Análisis de Equipos Industriales</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Compara Maquinaria Pesada
            <span className="block text-blue-600">Como un Profesional</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plataforma más avanzada para análisis y comparación de equipos industriales. 
            Toma decisiones informadas con datos precisos y herramientas profesionales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Comenzar Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Funcionalidades Principales
          </h2>
          <p className="text-lg text-gray-600">
            Todo lo que necesitas para gestionar tu maquinaria pesada
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestra plataforma?
            </h2>
            <p className="text-lg text-gray-600">
              Diseñada por profesionales para profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a profesionales que ya confían en nuestra plataforma
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Crear Cuenta Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <GitCompare className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Comparador de Maquinaria Pesada</span>
            </div>
            <p className="text-gray-400">
              © 2024 Comparador de Maquinaria. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
