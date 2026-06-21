import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Jab bhi aap local ya production mein '/api' par request bhejenge, 
      // yeh automatically use aapke live backend URL par redirect kar dega.
      '/api': {
        target: 'https://b4a.run',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
