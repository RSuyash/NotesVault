import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to the backend server
      '/api': {
        target: 'http://127.0.0.1:8000', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        // Optional: rewrite path if needed, but not necessary here
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
