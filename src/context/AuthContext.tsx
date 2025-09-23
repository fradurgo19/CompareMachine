import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: localStorage.getItem('authToken'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      console.log('AuthContext: Initializing auth, token exists:', !!token);
      
      if (token) {
        try {
          const response = await api.getProfile();
          if (response.success && response.data) {
            console.log('AuthContext: User authenticated:', response.data);
            dispatch({ type: 'SET_USER', payload: response.data });
          } else {
            // Token is invalid
            console.log('AuthContext: Invalid token, removing');
            localStorage.removeItem('authToken');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } catch (error) {
          // Token is invalid
          console.log('AuthContext: Token validation failed:', error);
          localStorage.removeItem('authToken');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        console.log('AuthContext: No token found, user not authenticated');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.login({ email, password });
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.register({ name, email, password });
      
      if (response.success) {
        // After successful registration, automatically log in
        await login(email, password);
      } else {
        throw new Error(response.message || 'Error al registrarse');
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const refreshUser = async () => {
    try {
      const response = await api.getProfile();
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
      }
    } catch (error) {
      // If refresh fails, logout
      logout();
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
