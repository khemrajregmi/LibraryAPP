// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
  ],
  app: {
    head: {
      link: [
        // Preconnect to the API origin
        // { rel: 'preconnect', href: 'https://68604c568e7486408442eb64.mockapi.io', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap' },
        // Remove or update the LCP image preload if not used
        // { rel: 'preload', as: 'image', href: '/path-to-lcp-image.jpg' },
        // Preload web fonts to avoid layout shifts
        // { rel: 'preload', as: 'font', href: '/path-to-font.woff2', type: 'font/woff2', crossorigin: 'anonymous' },
      ]
    },
  },
  css: [
    '~/assets/css/tailwind.css',
  ],
})