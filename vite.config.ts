import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      writeBundle() {
        try {
          copyFileSync(
            resolve(__dirname, 'public/_redirects'),
            resolve(__dirname, 'dist/_redirects')
          );
        } catch (error) {
          console.warn('Could not copy _redirects file:', error);
        }
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  }
});
