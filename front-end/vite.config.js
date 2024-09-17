import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://server-dot-keeper-app-432221.uc.r.appspot.com'
    },
  },
  plugins: [react()],
})