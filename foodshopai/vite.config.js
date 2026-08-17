import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cấu hình Vite cơ bản cho dự án React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
