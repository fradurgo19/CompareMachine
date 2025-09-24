// Configuración de entorno dinámico
interface EnvironmentConfig {
  apiUrl: string;
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: EnvironmentConfig = {
  apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' 
    ? 'https://compare-machine-backend.vercel.app/api' 
    : 'http://localhost:3001/api'),
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production'
};

// Validación de configuración
if (!config.apiUrl) {
  throw new Error('VITE_API_URL no está configurada');
}

export default config;
