import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

console.log('[Main] Application initializing...');
console.log('[Main] Route tree loaded:', routeTree);

// Create Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
console.log('[Main] Convex client created');
console.log('[Main] Convex URL:', import.meta.env.VITE_CONVEX_URL ? 'Configured' : 'MISSING');

// Create a new router instance
const router = createRouter({ 
  routeTree,
  basepath: '/bcl',
});
console.log('[Main] Router created:', router);

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[Main] ERROR: Root element not found!');
  throw new Error('Root element not found');
}

console.log('[Main] Rendering application...');
createRoot(rootElement).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ConvexAuthProvider>
        <RouterProvider router={router} />
      </ConvexAuthProvider>
    </ConvexProvider>
  </StrictMode>,
);
console.log('[Main] Application rendered successfully');
