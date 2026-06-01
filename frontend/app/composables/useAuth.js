// ============================================================
// useAuth — Autenticación global
// ============================================================
// Estado compartido entre todos los componentes gracias a
// refs definidas fuera de la función (module-level).
// login/register guardan el JWT en localStorage.
// checkAuth() se llama desde el layout al montar la app.

import { authService } from '~/services/authService'

// Estado global (compartido entre todos los que llamen useAuth)
const user = ref(null)                      // datos del usuario logueado
const token = ref(localStorage.getItem('token')) // JWT desde localStorage
const loading = ref(false)
const stats = ref(null)
const statsLoading = ref(false)

export function useAuth() {
  // Computed: true solo si hay token en localStorage
  const isAuthenticated = computed(() => !!token.value)

  // Envía email+password al backend, guarda el JWT devuelto
  async function login(input) {
    loading.value = true
    try {
      const result = await authService.login(input)
      token.value = result.token
      user.value = result.user
      localStorage.setItem('token', result.token)
      return result
    } finally {
      loading.value = false
    }
  }

  // Crea cuenta nueva. El backend devuelve token directamente (auto-login)
  async function register(input) {
    loading.value = true
    try {
      const result = await authService.register(input)
      token.value = result.token
      user.value = result.user
      localStorage.setItem('token', result.token)
      return result
    } finally {
      loading.value = false
    }
  }

  // Verifica si el token sigue siendo válido llamando a GET /me
  // Si el backend responde 401, hace logout automático
  async function checkAuth() {
    if (!token.value) return
    loading.value = true
    try {
      user.value = await authService.getMe(token.value)
    } catch {
      logout()
    } finally {
      loading.value = false
    }
  }

  // Carga estadísticas del perfil (nivel, %, horas totales, etc.)
  async function loadStats() {
    if (!token.value) return
    statsLoading.value = true
    try {
      const data = await authService.getStats(token.value)
      stats.value = data.stats
      user.value = data.user
    } catch {
      stats.value = null
    } finally {
      statsLoading.value = false
    }
  }

  // Limpia todo y redirige a login
  function logout() {
    token.value = null
    user.value = null
    stats.value = null
    localStorage.removeItem('token')
    navigateTo('/login')
  }

  return {
    user, token, loading, stats, statsLoading,
    isAuthenticated, login, register, checkAuth, loadStats, logout,
  }
}
