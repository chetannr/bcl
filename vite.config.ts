import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Using custom domain bclclub.in, so use root path
  plugins: [
    react(),
    TanStackRouterVite(),
  ],
  css: {
    transformer: 'postcss', // Use PostCSS (which uses lightningcss via Tailwind v4)
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'lightningcss', // Use lightningcss for CSS minification in production
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['@tanstack/react-router'],
          'convex-vendor': ['convex'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router', 'convex'],
  },
})
