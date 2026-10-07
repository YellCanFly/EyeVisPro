import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/EyeVisPro/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'three-viewer': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
