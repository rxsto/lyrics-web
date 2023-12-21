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
      baseUrl: `https://${process.env.BASE_URL || 'localhost:8080'}/lyrics`,
      wsUrl: `wss://${process.env.BASE_URL || 'localhost:8080'}/lyrics`,
      apiKey: process.env.API_KEY || ''
    }
  }
})
