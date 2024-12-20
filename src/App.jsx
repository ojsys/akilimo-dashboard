// src/App.jsx
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './lib/auth';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated, credentials } = useAuthStore();

  useEffect(() => {
    console.log('Auth state:', { 
      isAuthenticated, 
      hasCredentials: !!credentials 
    });
  }, [isAuthenticated, credentials]);

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated && credentials ? <Dashboard /> : <Login />}
    </QueryClientProvider>
  );
}

export default App;

// // src/App.jsx
// import React from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useAuthStore } from './lib/auth';
// import Dashboard from './components/dashboard/Dashboard';
// import Login from './components/Login';

// // Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       cacheTime: 10 * 60 * 1000, // 10 minutes
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// function App() {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <div className="min-h-screen bg-gray-50">
//         {isAuthenticated ? <Dashboard /> : <Login />}
//       </div>
//     </QueryClientProvider>
//   );
// }

// export default App;