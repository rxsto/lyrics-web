export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      baseUrl: `https://${process.env.BASE_URL || 'localhost:8080'}/lyrics`,
      wsUrl: `wss://${process.env.BASE_URL || 'localhost:8080'}/lyrics`,
      apiKey: process.env.API_KEY || ''
    }
  }
})
