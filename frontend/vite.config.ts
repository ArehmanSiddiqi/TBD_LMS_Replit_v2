import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // base: '/static/frontend/', // for replit deployment
  build: {
 outDir: './dist',  
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
  },
})
