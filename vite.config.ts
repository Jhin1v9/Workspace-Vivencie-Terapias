import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Otimizações de bundle
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    
    // Code splitting
    rollupOptions: {
      output: {
        // Separar vendor em chunks menores
        manualChunks: {
          // Framework
          'react-vendor': ['react', 'react-dom'],
          // Animações
          'animation-vendor': ['framer-motion'],
          // UI Components
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          // Utilidades
          'utils-vendor': ['date-fns', 'uuid', 'zustand'],
          // PDF e documentos
          'doc-vendor': ['jspdf', 'html2canvas'],
        },
        // Nomenclatura de chunks
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || '';
          if (info.endsWith('.css')) {
            return 'assets/styles/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(info)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    
    // Tamanho limite de chunk
    chunkSizeWarningLimit: 800,
    
    // Otimização de assets
    assetsInlineLimit: 4096,
    
    // Terser options para melhor minificação

  },
  
  // Otimizações de dev server
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  
  // Otimizações de preview
  preview: {
    port: 4173,
  },
  
  // CSS
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // Otimização de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      'date-fns',
      'uuid',
    ],
    exclude: [],
  },
  

});
