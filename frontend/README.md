# Gamer Backlog — Frontend

SPA en Nuxt 4 con estética retro-pixel para gestionar y priorizar tu backlog de videojuegos.

## Stack

- **Framework:** Nuxt 4 (Vue 3.5 + Composition API + `<script setup>`)
- **Routing:** Auto-routing (app/pages/), guards de autenticación
- **Bundler:** Vite 8
- **Estilos:** Tailwind CSS 3.4 (paleta retro, animaciones pixel, CRT/scanlines)
- **UI:** @headlessui/vue (modales accesibles)
- **Utilidades:** @vueuse/core (useDebounce, useIntersectionObserver)
- **Validación:** Zod 3.25

## Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | pages/index.vue | Hero 90vh + avatar + GBA SP mockup con scroll-reveal |
| `/login` | pages/login.vue | Inicio de sesión |
| `/registro` | pages/registro.vue | Registro de usuario |
| `/olvide-password` | pages/olvide-password.vue | Solicitar restablecimiento |
| `/restablecer-password` | pages/restablecer-password.vue | Nueva contraseña con token |
| `/perfil` | pages/perfil.vue | Perfil y estadísticas tipo RPG (auth) |
| `/juegos` | pages/juegos/index.vue | Listado con filtros y ordenación |
| `/juegos/nuevo` | pages/juegos/nuevo.vue | Crear juego |
| `/juegos/:id` | pages/juegos/[id].vue | Detalle del juego |
| `/juegos/edicion/:id` | pages/juegos/edicion/[id].vue | Editar juego |

## Homepage

- **Hero**: Ocupa ~90% del viewport. Avatar grande (96x96), glitch title `<GB/>`, CTAs, scroll chevron abajo.
- **GBA SP Mockup**: Consola retro con pantalla Game Boy verde mostrando backlog simulado (Zelda BOTW, Elden Ring, Celeste). D-Pad y botones A/B. Scanlines suaves.
- **Scroll reveal**: La sección GBA aparece con fade + slide-up al scrollear, usando `useIntersectionObserver` con stagger escalonado (consola 0.2s, callouts 0.3-0.6s).
- **Paleta**: "Retro Vibrante" — fondo `#1a1a3e`, tarjetas `#252550`, bordes `#3d3d7b`, texto `#fffffe`.
- **Animaciones**: avatar idle (bob + rotate), glitch text, neon pulse, CRT flicker, pixel bounce.

## Comandos

```bash
npm install
npm run dev       # Desarrollo (localhost:3000) con proxy a backend :4000
npm run build     # Build producción
npm run preview   # Previsualizar build
npm run generate  # Generar SPA estática
```

## Estrategia mock → API

`services/gameService.js` tiene mocking automático: sin token usa datos mock (`data/mockGames.js`), con token llama a la API real. Los componentes no se tocan.
