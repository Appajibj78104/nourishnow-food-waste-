import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ngo': {
        target: 'http://localhost:5000/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ngo/, '/ngo')
      }
    }
  }
}); 