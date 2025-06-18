import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import mkcert from 'vite-plugin-mkcert'
import path from 'path' // 👈 добавь это

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    mkcert()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 👈 alias для абсолютных импортов
    }
  }
})
