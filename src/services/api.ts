// API service for connecting to the backend
import config from '../config/environment';

const API_BASE_URL = config.apiUrl;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { skipAuth?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists and skipAuth is not true
    const token = localStorage.getItem('authToken');
    if (token && !options.skipAuth) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const { skipAuth, ...requestOptions } = options;

    const config: RequestInit = {
      ...requestOptions,
      headers: {
        ...defaultHeaders,
        ...requestOptions.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }

  // Machinery endpoints
  async getMachinery(params?: {
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
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/machinery?${queryString}` : '/machinery';
    
    // This is a public endpoint, don't send authorization header
    return this.request(endpoint, { skipAuth: true });
  }

  async getMachineryById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/machinery/${id}`);
  }

  async getManufacturers(): Promise<ApiResponse<string[]>> {
    // This is a public endpoint, don't send authorization header
    return this.request('/machinery/manufacturers', { skipAuth: true });
  }

  async createMachinery(data: any): Promise<ApiResponse<any>> {
    return this.request('/machinery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMachinery(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/machinery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMachinery(id: string): Promise<ApiResponse<any>> {
    return this.request(`/machinery/${id}`, {
      method: 'DELETE',
    });
  }

  // Joint evaluation endpoints
  async getJointEvaluations(params?: {
    page?: number;
    limit?: number;
    model?: string;
    series?: string;
    ott?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/joint-evaluations?${queryString}` : '/joint-evaluations';
    
    return this.request(endpoint);
  }

  async getJointEvaluationById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/joint-evaluations/${id}`);
  }

  async createJointEvaluation(data: any): Promise<ApiResponse<any>> {
    return this.request('/joint-evaluations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJointEvaluation(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/joint-evaluations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJointEvaluation(id: string): Promise<ApiResponse<any>> {
    return this.request(`/joint-evaluations/${id}`, {
      method: 'DELETE',
    });
  }

  async calculateJointEvaluation(data: {
    standardDiameter: number;
    structureHousingDiameter: number;
    bushingDiameter: number;
    pinDiameter: number;
  }): Promise<ApiResponse<any>> {
    return this.request('/joint-evaluations/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile');
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/users/profile');
  }

  async updateUserProfile(data: {
    name?: string;
    email?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserJointEvaluations(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users/joint-evaluations?${queryString}` : '/users/joint-evaluations';
    
    return this.request(endpoint);
  }

  // Extraction endpoints (OpenAI - deprecated due to costs)
  async extractSpecifications(file: File): Promise<ApiResponse<any[]>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/extraction/specifications`;
    const token = localStorage.getItem('authToken');

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al extraer especificaciones');
      }

      return data;
    } catch (error) {
      console.error('Extraction API request failed:', error);
      throw error;
    }
  }

  // Text parser endpoints (Free alternative to OpenAI)
  async parseTextSpecifications(text: string): Promise<ApiResponse<any[]>> {
    return this.request('/text-parser/specifications', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Excel parser endpoints
  async parseExcelSpecifications(file: File): Promise<ApiResponse<any[]>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/excel-parser/specifications`;
    const token = localStorage.getItem('authToken');

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el archivo Excel');
      }

      return data;
    } catch (error) {
      console.error('Excel parsing API request failed:', error);
      throw error;
    }
  }

  async downloadExcelTemplate(): Promise<void> {
    // baseURL already includes /api, so we need to construct the full path differently
    const baseUrl = this.baseURL.replace('/api', ''); // Remove /api if present
    const url = `${baseUrl}/api/excel-parser/template`;
    window.open(url, '_blank');
  }
}

export const apiService = new ApiService();
export default apiService;
