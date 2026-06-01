// ============================================================
// auth.ts — Guard de rutas (middleware Nuxt 4)
// ============================================================
// Se ejecuta antes de cargar cada página. Si la ruta requiere
// autenticación y no hay token, redirige a /login.
// Si el usuario ya está logueado y visita login/registro, lo
// manda directo a /juegos.

export default defineNuxtRouteMiddleware((to) => {
  const token = localStorage.getItem('token')
  // Páginas que no necesitan estar logueado
  const publicPages: string[] = ['login', 'registro', 'index']

  // Sin token + ruta protegida → login
  if (!token && !publicPages.includes(to.name as string)) {
    return navigateTo('/login')
  }

  // Con token + página pública → juegos
  if (token && publicPages.includes(to.name as string)) {
    return navigateTo('/juegos')
  }
})
