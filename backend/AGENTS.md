# AGENTS.md

## Proyecto
Gamer Backlog API — backend para gestionar y priorizar videojuegos con autenticación JWT.
Frontend Vue 3 en `../frontend/` — ver `../frontend/AGENTS.md`.

## Objetivo actual
Sprint 2 completado (backend + frontend) ✅ — Backend con autenticación JWT, rutas protegidas, juegos asociados a usuarios. Frontend Vue 3 con Tailwind.

## Stack usado
### Backend
- Node.js / Express
- JavaScript ES modules
- Prisma ORM / MySQL (Aiven)
- Zod / argon2 / jsonwebtoken

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Tailwind CSS
- Vite

## Estructura principal
```
  src/
    config/
      env.js             Variables de entorno (incluye RESEND_API_KEY, APP_URL)
      prisma.js          Cliente Prisma centralizado
    email/
      sendEmail.js       Envío de emails con Resend (password reset)
  docs/
    api-spec.md        Especificación de endpoints
    architecture.md    Decisiones técnicas y estructura
    data-model.md      Modelo de datos Prisma
  lib/
    errors.js          Clases AppError, NotFoundError, ConflictError, UnauthorizedError
  middlewares/
    error.middleware.js       Captura ZodError + AppError + errores genéricos
    not-found.middleware.js   404
    auth.middleware.js        Protege rutas con JWT
    rate-limit.middleware.js  Rate limiting para /login y /register
  modules/
    auth/
      auth.routes.js       POST /register, POST /login, GET /me, GET /stats, POST /forgot-password, POST /reset-password
      auth.controller.js   Valida con Zod, llama al use case
      auth.useCases.js     Lógica de negocio: register, login, forgot/reset password, stats
      auth.service.js      Solo consultas Prisma (incluye tokens de reset)
      auth.schemas.js      Schemas Zod (register, login, forgot-password, reset-password)
    games/
      games.routes.js      Rutas REST protegidas
      games.controller.js  Valida con Zod, llama al use case
      games.useCases.js    Lógica de negocio: CRUD con ownership + prioridad
      games.service.js     Solo consultas Prisma
      games.schemas.js     Schemas Zod (create, update, complete, query)
  routes/
    index.js           Router principal (/api/health, /api/auth, /api/games)
  utils/
    priority.js        Algoritmo: metacriticScore / hoursToBeat
    jwt.js             signToken / verifyToken
    game.js            Helper serializeGame
  app.js               Configuración Express
  server.js            Punto de entrada
```

## Reglas de desarrollo
- No usar TypeScript ni CommonJS
- Usar import/export en todos los archivos
- Controller: validar con Zod, llamar al use case, responder
- UseCase: lógica de negocio, reglas, orquestación
- Service: solo consultas Prisma (find, create, update, delete)
- Validar entradas con Zod
- Centralizar Prisma en src/config/prisma.js
- Usar respuestas consistentes:
  - éxito: { success: true, data }
  - error: { success: false, message, errors? }

## Endpoints
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/health | No | Health check |
| GET | /api/auth/me | Sí | Perfil del usuario autenticado |
| GET | /api/auth/stats | Sí | Estadísticas del usuario (nivel, clase, categorías) |
| POST | /api/auth/register | No (rate-limited) | Registrar usuario |
| POST | /api/auth/login | No (rate-limited) | Login |
| POST | /api/auth/forgot-password | No (rate-limited) | Solicitar restablecimiento de contraseña |
| POST | /api/auth/reset-password | No (rate-limited) | Restablecer contraseña con token |
| GET | /api/games | Sí | Listar con filtros (search, category, tag, completed) y ordenación (sortBy, order) |
| GET | /api/games/:id | Sí | Obtener juego por ID |
| POST | /api/games | Sí | Crear juego (calcula priorityScore) |
| PUT | /api/games/:id | Sí | Actualizar juego (recalcula priorityScore) |
| DELETE | /api/games/:id | Sí | Eliminar juego |
| PATCH | /api/games/:id/complete | Sí | Marcar completado con fecha auto + notas + rating |

## Parámetros de filtro GET /api/games
- search — búsqueda parcial por nombre
- category — filtro por categoría exacta
- tag — búsqueda parcial en tags
- completed — "true" o "false"
- sortBy — priorityScore, metacriticScore, hoursToBeat, name (default: priorityScore)
- order — asc o desc (default: desc)

## Algoritmo de prioridad
`priorityScore = metacriticScore / hoursToBeat`

## Autenticación
- Header: `Authorization: Bearer <token>`
- Registro: email, password (min 8), alias
- Login: email, password → devuelve token + user
- Token JWT con expiración configurable (default: 7 días)
- Contraseñas hasheadas con argon2
- Password reset: token aleatorio de 32 bytes, expira en 1h, envío por Resend
- Cada juego asociado a su userId (obligatorio)

## Password Reset
- `POST /api/auth/forgot-password`: recibe email, genera token, lo almacena en `PasswordResetToken`, envía email con Resend. Siempre devuelve el mismo mensaje (exista o no el email) para evitar enumeración de usuarios.
- `POST /api/auth/reset-password`: recibe `token` + `password` + `passwordRepeat`, valida el token (no expirado, no usado), actualiza la contraseña con argon2 y marca el token como usado.

## Comandos útiles
- npm install
- npm run dev
- npm run start
- npx prisma generate
- npx prisma migrate dev
