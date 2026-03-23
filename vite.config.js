// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // GitHub Pages serves the site at /resume-forge/
  // This base must match your repository name exactly.
  base: '/resume-forge/',

  server: {
    port: 3000,
    open: true,
  },

  preview: {
    port: 4173,
  },

  build: {
    outDir: 'dist',
    // Generate a smaller bundle by splitting vendor code
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})