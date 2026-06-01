# AGENTS.md — Frontend

## Proyecto
Gamer Backlog — app Nuxt 4 SPA con estética retro-pixel para gestionar y priorizar videojuegos.
Backend en `../backend/` — ver `../backend/AGENTS.md`.

## Objetivo actual
- Homepage (index.vue): Hero full viewport (90vh) con avatar grande + glitch title + scroll indicator
- GBA SP mockup con pantalla Game Boy verde y backlog simulado (Zelda, Elden, Celeste)
- Scroll-reveal con useIntersectionObserver (stagger fade/slide-up)
- Paleta "Retro Vibrante": bg #1a1a3e, cards #252550, border #3d3d7b
- Nav: ENTRAR (cyan glow text), REGISTRO (btn-retro sólido), JUEGOS (cyan glow)

## Stack
- Nuxt 4 (Vue 3 + Composition API + `<script setup>`)
- File-based routing (app/pages/)
- Tailwind CSS 3 (colores retro, animaciones pixel, CRT effects)
- @vueuse/core (useDebounce, useIntersectionObserver para scroll-reveal)
- Zod (validación frontend + backend)

## Estructura
```
frontend/
  nuxt.config.ts           Configuración Nuxt 4 (SPA, proxy, tailwind)
  tailwind.config.js       Paleta retro y animaciones pixel
  app/
    app.vue                Entry point (NuxtLayout + NuxtPage)
    layouts/
      default.vue          Header retro + footer + scanlines CRT
    pages/
      index.vue            HomePage — Hero 90vh + GBA console mockup + scroll-reveal
      login.vue            LoginPage — Iniciar sesión
      registro.vue         RegisterPage — Crear cuenta
      olvide-password.vue  ForgotPassword — Solicitar restablecimiento
      restablecer-password.vue ResetPassword — Nueva contraseña con token
      perfil.vue           ProfilePage — Estadísticas tipo RPG
      juegos/
        index.vue          GamesListPage — Listado + filtros + modales
        nuevo.vue          GameCreatePage — Formulario crear
        [id].vue           GameDetailPage — Detalle del juego
        edicion/[id].vue   GameEditPage — Formulario editar
    components/
      games/               7 componentes (GameCard, GameForm, GameFilters...)
      ui/                  4 componentes (BaseButton, BaseInput, BaseSelect, BaseModal)
    composables/
      useAuth.js           Auth global (localStorage + fetch)
      useGames.js          CRUD de juegos (con mock fallback)
    services/
      gameService.js       Mock CRUD (misma interfaz que API real)
      authService.js       Auth requests al backend (login, register, forgot/reset password)
    middleware/
      auth.ts              Guard de rutas protegidas
    lib/
      schemas.js           Zod schemas (login, register)
    data/
      mockGames.js         8 juegos de ejemplo
    assets/
      css/main.css         Tailwind directives + animaciones CRT/pixel
```

## Rutas (auto-routing Nuxt 4)
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| / | pages/index.vue | Presentación + CTA |
| /login | pages/login.vue | Iniciar sesión |
| /registro | pages/registro.vue | Crear cuenta |
| /olvide-password | pages/olvide-password.vue | Solicitar restablecimiento de contraseña |
| /restablecer-password | pages/restablecer-password.vue | Nueva contraseña con token |
| /perfil | pages/perfil.vue | Estadísticas del agente |
| /juegos | pages/juegos/index.vue | Listado con filtros/ordenación |
| /juegos/nuevo | pages/juegos/nuevo.vue | Formulario crear |
| /juegos/:id | pages/juegos/[id].vue | Detalle del juego |
| /juegos/edicion/:id | pages/juegos/edicion/[id].vue | Formulario editar |

## Endpoints de la API (backend)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/health | No | Health check |
| POST | /api/auth/register | No (rate-limited) | Registrar usuario |
| POST | /api/auth/login | No (rate-limited) | Login |
| GET | /api/auth/me | Sí | Perfil del usuario autenticado |
| GET | /api/auth/stats | Sí | Estadísticas del usuario |
| POST | /api/auth/forgot-password | No (rate-limited) | Solicitar restablecimiento |
| POST | /api/auth/reset-password | No (rate-limited) | Restablecer con token |
| GET | /api/games | Sí | Listar con filtros y ordenación |
| GET | /api/games/:id | Sí | Obtener juego por ID |
| POST | /api/games | Sí | Crear juego |
| PUT | /api/games/:id | Sí | Actualizar juego |
| DELETE | /api/games/:id | Sí | Eliminar juego |
| PATCH | /api/games/:id/complete | Sí | Marcar como completado |

## Estrategia mock → API real
`services/gameService.js` tiene mocking automático: sin token usa datos mock,
con token llama a la API real. Los componentes no se tocan.

## Autenticación
- JWT almacenado en localStorage (clave: `token`)
- `checkAuth()` se llama desde layout `onMounted`
- Middleware `auth.ts` bloquea rutas protegidas
- Password reset usa Resend (email) + token con expiración de 1 hora
- Contraseñas hasheadas con argon2

## Comandos útiles
- `npm run dev` — entorno desarrollo (localhost:3000) con proxy a backend :4000
- `npm run build` — build producción
- `npm run preview` — previsualizar build
- `npm run generate` — generar SPA estática
