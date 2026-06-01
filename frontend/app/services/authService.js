const API = '/api'

async function request(endpoint, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  let res

  try {
    res = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
    })
  } catch (e) {
    const err = new Error(
      e.name === 'AbortError'
        ? 'El servidor no respondió a tiempo'
        : 'No se puede conectar con el servidor. ¿Está el backend corriendo?'
    )
    err.status = 0
    throw err
  } finally {
    clearTimeout(timeout)
  }

  let data
  try {
    data = await res.json()
  } catch {
    const err = new Error('Error inesperado del servidor')
    err.status = res.status
    throw err
  }

  if (!data.success) {
    const err = new Error(data.message || 'Error de conexión')
    err.status = res.status
    err.errors = data.errors || null
    throw err
  }

  return data.data
}

export const authService = {
  async register(input) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async login(input) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async getMe(token) {
    return request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async getStats(token) {
    return request('/auth/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async forgotPassword(email) {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  async resetPassword({ token, password, passwordRepeat }) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, passwordRepeat }),
    })
  },
}
