import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html in dist folder
    visualizer({
      filename: './dist/stats.html',
      open: false, // Set to true to auto-open in browser after build
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // 'treemap', 'sunburst', 'network'
    }),
  ],
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
  // 🔧 Production build optimizations
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production for smaller bundle
    minify: 'esbuild', // Use esbuild for fast minification (default in Vite)
    target: 'es2015', // Support modern browsers
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Charts
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          // UI libraries
          'ui-vendor': ['lucide-react', 'sonner'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    reportCompressedSize: true, // Report gzip size
  },
  // 🔄 Proxy para redirigir API calls al backend Express en desarrollo
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
