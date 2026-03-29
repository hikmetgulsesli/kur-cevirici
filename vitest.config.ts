import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'node_modules/@testing-library/jest-dom/dist/vitest.mjs')],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
