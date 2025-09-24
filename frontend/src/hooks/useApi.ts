import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<{ data: T }>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiCall();
        
        if (isMounted) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

// Hook específico para maquinaria
export function useMachinery(params?: {
  page?: number;
  limit?: number;
  category?: string;
  manufacturer?: string;
  priceMin?: number;
  priceMax?: number;
  weightMin?: number;
  weightMax?: number;
  powerMin?: number;
  powerMax?: number;
  availability?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useApi(
    () => apiService.getMachinery(params),
    [JSON.stringify(params)]
  );
}

// Hook específico para fabricantes
export function useManufacturers() {
  return useApi(() => apiService.getManufacturers());
}

// Hook específico para evaluaciones de juntas
export function useJointEvaluations(params?: {
  page?: number;
  limit?: number;
  model?: string;
  series?: string;
  ott?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useApi(
    () => apiService.getJointEvaluations(params),
    [JSON.stringify(params)]
  );
}

// Hook para cálculos de evaluaciones de juntas
export function useJointCalculation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (data: {
    standardDiameter: number;
    structureHousingDiameter: number;
    bushingDiameter: number;
    pinDiameter: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.calculateJointEvaluation(data);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calculation failed';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { calculate, loading, error };
}
