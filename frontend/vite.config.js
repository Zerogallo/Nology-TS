import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou vue, etc.

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Quando o front chamar '/api', o Vite redireciona para a Render
      '/api': {
        target: 'https://backend-02i4.onrender.com', // URL DA SUA RENDER
        changeOrigin: true,
        secure: true, // true se sua api for https
        rewrite: (path) => path.replace(/^\/api/, ''), // Opcional: remove /api do caminho
      },
    },
  },
})
