import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({  //config de base pour Vite, avec plugins et proxy pour l'API
  plugins: [           // Intégration de Tailwind CSS et React
    tailwindcss(),
    react(),
  ],
  server: {
    port: 5173,
    proxy: {           // Proxy pour rediriger les requêtes API vers le backend
      '/api': {        //chaque requête commençant par /api sera redirigée vers le backend
        // target: 'https://projet-ecommerce-synthese-production.up.railway.app',
        target: 'http://localhost:8003',
        changeOrigin: true,
      },
      '/storage': {           
        target: 'http://localhost:8003',
        changeOrigin: true,
      },

    },
  },
})
