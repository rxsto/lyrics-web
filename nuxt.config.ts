export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  modules: [
    'nuxt-icon',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt'
  ],

  runtimeConfig: {
    public: {
      baseUrl: `${process.env.BASE_URL || 'http://localhost:8080'}/lyrics`,
      wsUrl: `${process.env.BASE_URL || 'ws://localhost:8080'}/lyrics`,
      apiKey: process.env.API_KEY || ''
    }
  }
})
