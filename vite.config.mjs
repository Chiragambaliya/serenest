import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // FIX Bug 6: removed '@daily-co/daily-js' from manualChunks — it is not
          // confirmed as an installed dependency. If you add daily-co to package.json
          // and use it in src/, uncomment the line below:
          // daily: ['@daily-co/daily-js'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
