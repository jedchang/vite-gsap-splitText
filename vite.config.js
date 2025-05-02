import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/vite-gsap-split-text/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})