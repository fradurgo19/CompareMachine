import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './organisms/Navigation';
import Landing from './pages/Landing';
import MachineryComparison from './pages/MachineryComparison';
import CriteriaEvaluation from './pages/CriteriaEvaluation';
import AddMachinery from './pages/AddMachinery';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthGuard from './components/AuthGuard';

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
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/compare" 
                    element={
                      <AuthGuard>
                        <MachineryComparison />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/criteria-evaluation" 
                    element={
                      <AuthGuard>
                        <CriteriaEvaluation />
                      </AuthGuard>
                    } 
                  />
                  <Route 
                    path="/add-machinery" 
                    element={
                      <AuthGuard>
                        <AddMachinery />
                      </AuthGuard>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;