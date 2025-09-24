import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

// Función para renderizar la aplicación de forma segura
const renderApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('❌ No se encontró el elemento root');
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('❌ Error al renderizar la aplicación:', error);
    
    // Renderizar un componente de error como fallback
    const root = createRoot(rootElement);
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error al cargar la aplicación
          </h1>
          <p className="text-gray-600 mb-4">
            Por favor, recarga la página o contacta al soporte técnico.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }
};

// Verificar que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
