import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://github.com/Frontend-Freak/Films.git',
  plugins: [react()],
  server: {
    open: true,
    hmr: true
  },
})
