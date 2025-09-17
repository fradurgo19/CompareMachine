import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import Navigation from './organisms/Navigation';
import MachineryComparison from './pages/MachineryComparison';
import CriteriaEvaluation from './pages/CriteriaEvaluation';
import AddMachinery from './pages/AddMachinery';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<MachineryComparison />} />
                <Route path="/criteria-evaluation" element={<CriteriaEvaluation />} />
                <Route path="/add-machinery" element={<AddMachinery />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;