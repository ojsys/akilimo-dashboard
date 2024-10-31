import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './lib/auth';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/Login';
import Layout from './components/Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    console.log('App component mounted')
  }, []);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        {isAuthenticated ? <Dashboard /> : <Login />}
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
