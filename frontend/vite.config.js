import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

<<<<<<< HEAD
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
=======
// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    },
    dedupe: [
      '@emotion/react',
      '@emotion/styled',
      'react',
      'react-dom'
    ]
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
<<<<<<< HEAD
=======
  },
=======
  plugins: [react()],
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true
      }
    }
<<<<<<< HEAD
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
  }
})
