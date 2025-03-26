import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite conexiones externas
    port: 5173,  // Asegúrate de que el puerto sea el correcto
  }
})
