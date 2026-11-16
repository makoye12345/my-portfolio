import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite configuration
export default defineConfig({
  plugins: [react()],

  // Disable automatic browser refreshing
  server: {
    hmr: false,
  },
})