import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'


import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '#app': resolve(__dirname, 'test/__mocks__/app.js')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.{js,ts}', 'test/**/*.test.js'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
