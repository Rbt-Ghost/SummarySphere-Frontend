import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bcbeno.me', 
        // For local development, you can use the following line instead:
        //target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})