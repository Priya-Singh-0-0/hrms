import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        rooms: resolve(__dirname, 'rooms.html'),
        vacancy: resolve(__dirname, 'vacancy.html'),
        maintenance: resolve(__dirname, 'maintenance.html'),
        profile: resolve(__dirname, 'profile.html'),
      }
    }
  }
})
