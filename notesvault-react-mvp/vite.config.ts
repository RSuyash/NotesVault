import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({ // Remove function form and conditional base
  base: '/', // Always use root-relative paths
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to the backend server
      // Proxy requests starting with /notesvault/api to the XAMPP server
      '/notesvault/api': { 
        target: 'http://localhost/NotesVault', // Target project folder within XAMPP
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/notesvault/, '') // Remove /notesvault prefix
      }
    }
  }
});
