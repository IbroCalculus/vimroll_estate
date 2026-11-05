import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          motion: ['motion', 'gsap', '@gsap/react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          state: ['zustand', '@tanstack/react-query'],
          maps: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
});
