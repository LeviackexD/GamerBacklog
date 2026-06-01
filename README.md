# 🎮 TFC Gamer

**Gestiona y prioriza tu backlog de videojuegos** — aplicación full-stack con estética retro-pixel, autenticación JWT, CRUD completo de juegos, y algoritmo de prioridad inteligente.

## Stack

### Backend — `backend/`

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 24 | Runtime |
| Express | 4.21 | Framework web |
| Prisma | 6.1 | ORM |
| MySQL | 8 | Base de datos (Aiven) |
| Zod | 3.25 | Validación de esquemas |
| JWT | 9.0 | Autenticación |
| Argon2 | 0.43 | Hash de contraseñas |
| helmet | 8.1 | Seguridad HTTP |
| express-rate-limit | 8.5 | Rate limiting |
| Resend | 4.2 | Email transaccional |

### Frontend — `frontend/`

| Tecnología | Versión | Uso |
|---|---|---|
| Nuxt | 4 | Framework (app/ auto-routing) |
| Vue | 3.5 | Framework UI |
| Vite | 8.0 | Bundler / dev server |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| @headlessui/vue | 1.7 | Modales accesibles |
| @vueuse/core | 14.3 | useDebounce, useIntersectionObserver |
| Zod | 3.25 | Validación (compartida) |

## Arquitectura

```
TFCGamer/
├── backend/                    # API REST
│   └── src/
│       ├── config/             # Env, Prisma client
│       ├── email/              # SendEmail con Resend
│       ├── lib/                # Errores personalizados
│       ├── middlewares/        # Auth, error handler, rate-limit, 404
│       ├── modules/
│       │   ├── auth/           # Register, login, forgot/reset password
│       │   └── games/          # CRUD con prioridad
│       ├── routes/             # Router principal
│       ├── utils/              # JWT, prioridad, serializers
│       ├── app.js              # Config Express
│       └── server.js           # Entry point
└── frontend/                   # Nuxt 4 SPA
    ├── nuxt.config.ts          # SSR off, proxy a backend
    ├── tailwind.config.js      # Paleta retro, animaciones pixel
    └── app/
        ├── app.vue             # Entry point
        ├── layouts/
        │   └── default.vue     # Header retro + nav + footer + CRT scanlines
        ├── pages/
        │   ├── index.vue       # Hero 90vh + avatar + GBA SP mockup
        │   ├── login.vue       # Inicio de sesión
        │   ├── registro.vue    # Registro de usuario
        │   ├── olvide-password.vue
        │   ├── restablecer-password.vue
        │   ├── perfil.vue      # Estadísticas tipo RPG
        │   └── juegos/         # CRUD completo
        ├── components/
        │   ├── games/          # GameCard, GameFilters, GameForm, etc.
        │   └── ui/             # BaseButton, BaseInput, BaseModal, etc.
        ├── composables/        # useAuth, useGames
        ├── services/           # gameService (mock→API), authService
        ├── middleware/
        │   └── auth.ts         # Guard de rutas protegidas
        ├── lib/
        │   └── schemas.js      # Zod schemas login/register
        ├── data/
        │   └── mockGames.js    # 8 juegos de ejemplo
        └── assets/
            └── css/main.css    # Tailwind + animaciones CRT/pixel
```

## Instalación

```bash
# Backend
cd backend
cp .env.example .env      # Configurar variables
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

## API Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | Rate-limited | Registrar usuario |
| POST | `/api/auth/login` | Rate-limited | Iniciar sesión |
| GET | `/api/auth/me` | JWT | Perfil del usuario |
| GET | `/api/auth/stats` | JWT | Estadísticas del usuario |
| POST | `/api/auth/forgot-password` | Rate-limited | Solicitar restablecimiento |
| POST | `/api/auth/reset-password` | Rate-limited | Restablecer con token |
| GET | `/api/games` | JWT | Listar juegos (filtros + ordenación) |
| GET | `/api/games/:id` | JWT | Detalle del juego |
| POST | `/api/games` | JWT | Crear juego |
| PUT | `/api/games/:id` | JWT | Actualizar juego |
| DELETE | `/api/games/:id` | JWT | Eliminar juego |
| PATCH | `/api/games/:id/complete` | JWT | Marcar como completado |

## Frontend Routes

| Ruta | Página | Auth |
|---|---|---|
| `/` | index.vue — Hero + GBA mockup | — |
| `/login` | login.vue | — |
| `/registro` | registro.vue | — |
| `/olvide-password` | olvide-password.vue | — |
| `/restablecer-password` | restablecer-password.vue | — |
| `/perfil` | perfil.vue — Estadísticas RPG | Sí |
| `/juegos` | juegos/index.vue — Listado + filtros | — |
| `/juegos/nuevo` | juegos/nuevo.vue | — |
| `/juegos/:id` | juegos/[id].vue | — |
| `/juegos/edicion/:id` | juegos/edicion/[id].vue | Sí |

## Algoritmo de prioridad

```
priorityScore = metacriticScore / hoursToBeat
```

> A mayor puntuación y menos horas, mayor prioridad en tu backlog.

## Licencia

**Uso educativo** — Proyecto final de DAW + IA.
