// Configuración de entorno dinámico
interface EnvironmentConfig {
  apiUrl: string;
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Función para obtener la URL de la API de forma segura
const getApiUrl = (): string => {
  // Prioridad 1: Variable de entorno explícita
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Prioridad 2: URL por defecto según el modo
  if (import.meta.env.MODE === 'production') {
    return 'https://backend-3749ma7e3-partequipos-projects.vercel.app';
  }
  
  // Prioridad 3: Desarrollo local
  return 'http://localhost:3001/api';
};

const config: EnvironmentConfig = {
  apiUrl: getApiUrl(),
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production'
};

// Log de configuración para debugging (solo en desarrollo)
if (import.meta.env.MODE === 'development') {
  console.log('🔧 Environment Config:', config);
}

// Validación de configuración
if (!config.apiUrl) {
  console.error('❌ VITE_API_URL no está configurada');
  throw new Error('VITE_API_URL no está configurada');
}

export default config;
