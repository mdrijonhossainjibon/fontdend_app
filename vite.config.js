import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_DEV_PORT || '5173', 10),
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8888',
          changeOrigin: true,
          timeout: 300000,
          proxyTimeout: 300000,
        },
        '/uploads': {
          target: env.VITE_API_URL || 'http://localhost:8888',
          changeOrigin: true,
        },
        '/public': {
          target: env.VITE_API_URL || 'http://localhost:8888',
          changeOrigin: true,
        },
      }
    }
  }
})
