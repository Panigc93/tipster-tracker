import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@core': path.resolve(__dirname, './src/core'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@tipsters': path.resolve(__dirname, './src/features/tipsters'),
      '@picks': path.resolve(__dirname, './src/features/picks'),
      '@follows': path.resolve(__dirname, './src/features/follows'),
      '@dashboard': path.resolve(__dirname, './src/features/dashboard'),
    },
  },
})
