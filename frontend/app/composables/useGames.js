// ============================================================
// useGames — CRUD de juegos con estado global
// ============================================================
// Igual que useAuth: el estado (games, filters) se comparte
// entre todos los componentes que usen este composable.
// Cada operación (crear, actualizar, eliminar) recarga la lista
// automáticamente para mantenerla sincronizada.

import { gameService } from '~/services/gameService'

const games = ref([])
const loading = ref(false)
const error = ref('')
const filters = reactive({
  search: '',       // búsqueda por nombre
  category: '',     // filtro por categoría
  tag: '',          // filtro por etiqueta
  completed: null,  // true/false/null (todos)
  sortBy: 'priorityScore', // criterio de ordenación
  order: 'desc',    // ascendente o descendente
})

// Si el backend dice token expirado (401), limpia y manda a login
function handleAuthError(err) {
  if (err.code === 'TOKEN_EXPIRED') {
    localStorage.removeItem('token')
    navigateTo('/login')
    return true
  }
  return false
}

export function useGames() {
  // Carga juegos según filtros actuales
  async function loadGames() {
    loading.value = true
    error.value = ''
    try {
      games.value = await gameService.list({ ...filters })
    } catch (err) {
      if (handleAuthError(err)) return
      error.value = err.message || 'Error al cargar los juegos'
    } finally {
      loading.value = false
    }
  }

  async function getGameById(id) {
    try {
      return await gameService.getById(id)
    } catch (err) {
      if (handleAuthError(err)) return
      throw err
    }
  }

  // Crea juego y recarga la lista completa
  async function createGame(data) {
    try {
      const game = await gameService.create(data)
      await loadGames()
      return game
    } catch (err) {
      if (handleAuthError(err)) return
      throw err
    }
  }

  async function updateGame(id, data) {
    try {
      const game = await gameService.update(id, data)
      await loadGames()
      return game
    } catch (err) {
      if (handleAuthError(err)) return
      throw err
    }
  }

  async function deleteGame(id) {
    try {
      await gameService.delete(id)
      await loadGames()
    } catch (err) {
      if (handleAuthError(err)) return
      throw err
    }
  }

  async function completeGame(id, data = {}) {
    try {
      const game = await gameService.complete(id, data)
      await loadGames()
      return game
    } catch (err) {
      if (handleAuthError(err)) return
      throw err
    }
  }

  async function uncompleteGame(id) {
    try {
      const game = await gameService.uncomplete(id)
      await loadGames()
      return game
    } catch (err) {
      if (handleAuthError(err)) return
      throw err
    }
  }

  // Cambia filtros y recarga al instante
  async function setFilters(newFilters) {
    Object.assign(filters, newFilters)
    await loadGames()
  }

  return {
    games, loading, error, filters,
    loadGames, getGameById,
    createGame, updateGame, deleteGame,
    completeGame, uncompleteGame, setFilters,
  }
}
