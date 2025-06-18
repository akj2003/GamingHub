/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Existing base configuration
  test: {
    globals: true, // Use global APIs like describe, it, expect
    environment: 'jsdom', // Simulate DOM environment
    setupFiles: './src/setupTests.ts', // Path to setup file (we'll create this)
    css: true, // Enable CSS processing if your components import CSS
  },
})
