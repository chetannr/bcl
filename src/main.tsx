import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

console.log('[Main] Application initializing...');
console.log('[Main] Route tree loaded:', routeTree);

// Create a new router instance
const router = createRouter({ 
  routeTree,
  basepath: '/bcl', // Add this line
});
console.log('[Main] Router created:', router);

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Create a query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds - shorter for real-time auction
      gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 1, // Reduce retries for faster failure feedback
    },
    mutations: {
      retry: false, // Don't retry mutations
    },
  },
});

console.log('[Main] QueryClient created');
console.log('[Main] Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'MISSING');
console.log('[Main] Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'MISSING');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[Main] ERROR: Root element not found!');
  throw new Error('Root element not found');
}

console.log('[Main] Rendering application...');
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
console.log('[Main] Application rendered successfully');
