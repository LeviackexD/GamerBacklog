export default defineNuxtConfig({
  compatibilityDate: '2026-05-29',
  future: {
    compatibilityVersion: 4,
  },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    pageTransition: { name: 'route', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap' },
      ],
      meta: [
        { name: 'description', content: 'Gestiona y prioriza tu backlog de videojuegos con Gamer Backlog. Organiza tu colección, descubre tu próxima partida.' },
        { property: 'og:title', content: 'Gamer Backlog' },
        { property: 'og:description', content: 'Gestiona y prioriza tu backlog de videojuegos. Organiza tu colección, descubre tu próxima partida.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'es_ES' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
    },
  },
  components: {
    dirs: [{ path: '~/components', pathPrefix: false }],
  },
  nitro: {
    routeRules: {
      '/api/**': { proxy: { to: 'http://localhost:4000/api/**' } },
    },
  },
  css: ['~/assets/css/main.css'],
})
