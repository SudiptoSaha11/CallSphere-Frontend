import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      events: 'events',
      util: 'util'
    }
  },
  server: {
    proxy: {
      '/socket.io': 'http://localhost:5000',
      '/api': 'http://localhost:5000'
    }
  }
});
