/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // enables describe/it/expect without import
    environment: 'jsdom', // required for @testing-library/react
    setupFiles: './setupTests.ts', // 👈 add this
  },
})
