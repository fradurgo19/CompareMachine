import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppContextType, FilterOptions, SortOptions } from '../types';

interface AppState {
  selectedMachinery: string[];
  comparisonMode: boolean;
  filters: FilterOptions;
  sortBy: SortOptions;
}

type AppAction =
  | { type: 'SET_SELECTED_MACHINERY'; payload: string[] }
  | { type: 'TOGGLE_COMPARISON_MODE' }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterOptions> }
  | { type: 'UPDATE_SORT'; payload: SortOptions };

const initialState: AppState = {
  selectedMachinery: [],
  comparisonMode: false,
  filters: {
    category: 'all',
    manufacturer: '',
    priceRange: [0, 1000000],
    weightRange: [0, 100],
    powerRange: [0, 1000],
    availability: 'all',
  },
  sortBy: {
    field: 'name',
    direction: 'asc',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SELECTED_MACHINERY':
      return {
        ...state,
        selectedMachinery: action.payload,
      };
    case 'TOGGLE_COMPARISON_MODE':
      return {
        ...state,
        comparisonMode: !state.comparisonMode,
        selectedMachinery: !state.comparisonMode ? state.selectedMachinery : [],
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'UPDATE_SORT':
      return {
        ...state,
        sortBy: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const contextValue: AppContextType = {
    selectedMachinery: state.selectedMachinery,
    comparisonMode: state.comparisonMode,
    filters: state.filters,
    sortBy: state.sortBy,
    setSelectedMachinery: (ids: string[]) =>
      dispatch({ type: 'SET_SELECTED_MACHINERY', payload: ids }),
    toggleComparisonMode: () => dispatch({ type: 'TOGGLE_COMPARISON_MODE' }),
    updateFilters: (filters: Partial<FilterOptions>) =>
      dispatch({ type: 'UPDATE_FILTERS', payload: filters }),
    updateSort: (sort: SortOptions) =>
      dispatch({ type: 'UPDATE_SORT', payload: sort }),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}